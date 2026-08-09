package com.smarthire.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.URL;

@Component
public class ResumeTextExtractor {

	public String extractText(String resumeUrl) {

	    System.out.println("=================================");
	    System.out.println("RESUME TEXT EXTRACTION STARTED");
	    System.out.println("Resume URL: " + resumeUrl);
	    System.out.println("=================================");

	    try (InputStream inputStream =
	                 new URL(resumeUrl).openStream();
	         PDDocument document =
	                 Loader.loadPDF(inputStream.readAllBytes())) {

	        PDFTextStripper stripper =
	                new PDFTextStripper();

	        String text =
	                stripper.getText(document);

	        System.out.println("Extracted resume text length: "
	                + (text == null ? 0 : text.length()));

	        if (text == null || text.trim().isEmpty()) {
	            throw new RuntimeException(
	                    "Resume PDF contains no readable text"
	            );
	        }

	        String limitedText =
	                text.length() > 8000
	                        ? text.substring(0, 8000)
	                        : text;

	        System.out.println("Resume extraction SUCCESS");

	        return limitedText;

	    } catch (Exception e) {

	        System.err.println("RESUME EXTRACTION FAILED");
	        e.printStackTrace();

	        throw new RuntimeException(
	                "Failed to extract resume text",
	                e
	        );
	    }
	}
}