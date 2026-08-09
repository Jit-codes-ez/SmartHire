package com.smarthire.service.impl;

import com.smarthire.dto.resume.ScoreResult;
import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.enums.ResumeScoreStatus;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.util.ResumeTextExtractor;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.List;
import java.util.Map;

@Service
public class ApplicationResumeScoringService {

    private final ResumeTextExtractor textExtractor;
    private final ApplicationRepository applicationRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.model}")
    private String geminiModel;

    public ApplicationResumeScoringService(ResumeTextExtractor textExtractor,
                                            ApplicationRepository applicationRepository,
                                            RestTemplate restTemplate) {
        this.textExtractor = textExtractor;
        this.applicationRepository = applicationRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Scores an application's resume asynchronously.
     * This method does not block the student's application request.
     */
    @Async("resumeScoringExecutor")
    @Transactional
    public void scoreApplicationAsync(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        try {
            // 1. Get student's resume URL
            String resumeUrl = null;
            if (application.getStudent() != null) {
                resumeUrl = application.getStudent().getResumeUrl();
            }

            // 2. No resume
            if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
                application.setResumeScoreStatus(ResumeScoreStatus.NO_RESUME);
                applicationRepository.save(application);
                System.out.println("No resume found for application " + applicationId);
                return;
            }

            // 3. Extract text from PDF
            String resumeText = textExtractor.extractText(resumeUrl);
            if (resumeText == null || resumeText.trim().isEmpty()) {
                throw new RuntimeException("Resume contains no readable text");
            }

            // 4. Get job information
            Job job = application.getJob();
            if (job == null) {
                throw new RuntimeException("Application has no associated job");
            }

            // 5. Build Gemini prompt
            String prompt = buildPrompt(resumeText, job);

            // 6. Call Gemini
            ScoreResult result = callGemini(prompt);

            // 7. Validate Gemini result
            if (result == null) {
                throw new RuntimeException("Gemini returned an empty scoring result");
            }

            int score = result.score();
            if (score < 0) score = 0;
            if (score > 100) score = 100;

            // 8. Save result onto Application
            application.setResumeScore(score);
            application.setResumeScoreSummary(result.summary());
            application.setMatchedSkills(result.matchedSkills() == null
                    ? "" : String.join(", ", result.matchedSkills()));
            application.setMissingSkills(result.missingSkills() == null
                    ? "" : String.join(", ", result.missingSkills()));
            application.setResumeScoreStatus(ResumeScoreStatus.COMPLETED);

            applicationRepository.save(application);

            System.out.println("Resume scoring completed for application "
                    + applicationId + " with score " + score);

        } catch (Exception e) {
            application.setResumeScoreStatus(ResumeScoreStatus.FAILED);
            applicationRepository.save(application);

            System.err.println("Resume scoring failed for application " + applicationId);
            e.printStackTrace();
        }
    }

    /**
     * Creates the prompt sent to Gemini.
     */
    private String buildPrompt(String resumeText, Job job) {
        String jobTitle = job.getTitle() == null ? "Unknown" : job.getTitle();
        String requiredSkills = job.getSkills() == null
                ? "No specific skills provided" : job.getSkills();

        return """
                You are an AI resume screening assistant for SmartHire.

                Your task is to compare a student's resume against the
                requirements of a job.

                Score the resume from 0 to 100 based primarily on how well
                the candidate's skills and experience match the required
                skills of the job.

                IMPORTANT RULES:

                1. Only use information actually present in the resume.
                2. Do not invent skills, experience, education, or projects.
                3. A skill should be considered matched only when the resume
                   provides reasonable evidence that the candidate has it.
                4. List required skills that are not reasonably demonstrated
                   in the resume as missing skills.
                5. The score must be an integer from 0 to 100.
                6. Keep the summary concise and useful to a recruiter.
                7. Return only the requested structured JSON response.

                JOB TITLE:
                %s

                REQUIRED SKILLS:
                %s

                STUDENT RESUME:
                %s
                """.formatted(jobTitle, requiredSkills, resumeText);
    }

    /**
     * Calls Gemini and parses its structured JSON response.
     */
    private ScoreResult callGemini(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Gemini structured output schema.
        Map<String, Object> schema = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "score", Map.of("type", "INTEGER"),
                        "summary", Map.of("type", "STRING"),
                        "matchedSkills", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")),
                        "missingSkills", Map.of("type", "ARRAY", "items", Map.of("type", "STRING"))
                ),
                "propertyOrdering", List.of("score", "summary", "matchedSkills", "missingSkills")
        );

        // Gemini request body.
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "responseSchema", schema
                )
        );

        // Gemini Model Call
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + geminiModel + ":generateContent?key=" + apiKey;

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Gemini API returned HTTP status " + response.getStatusCode());
        }

        if (response.getBody() == null) {
            throw new RuntimeException("Gemini returned an empty response");
        }

        String rawJson = extractGeminiText(response.getBody());

        if (rawJson == null || rawJson.trim().isEmpty()) {
            throw new RuntimeException("Gemini returned empty scoring JSON");
        }

        try {
            return objectMapper.readValue(rawJson, ScoreResult.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Failed to parse Gemini scoring response: " + rawJson,
                    e
            );
        }
    }

    /**
     * Extracts candidates[0] -> content -> parts[0] -> text
     */
    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> responseBody) {
        Object candidatesObject = responseBody.get("candidates");
        if (!(candidatesObject instanceof List<?> candidates) || candidates.isEmpty()) {
            throw new RuntimeException("Gemini response contains no candidates");
        }

        Object firstCandidate = candidates.get(0);
        if (!(firstCandidate instanceof Map<?, ?> candidate)) {
            throw new RuntimeException("Invalid Gemini candidate response");
        }

        Object contentObject = candidate.get("content");
        if (!(contentObject instanceof Map<?, ?> content)) {
            throw new RuntimeException("Gemini response contains no content");
        }

        Object partsObject = content.get("parts");
        if (!(partsObject instanceof List<?> parts) || parts.isEmpty()) {
            throw new RuntimeException("Gemini response contains no parts");
        }

        Object firstPart = parts.get(0);
        if (!(firstPart instanceof Map<?, ?> part)) {
            throw new RuntimeException("Invalid Gemini part response");
        }

        Object textObject = part.get("text");
        if (!(textObject instanceof String text)) {
            throw new RuntimeException("Gemini response contains no text");
        }

        return text;
    }
}