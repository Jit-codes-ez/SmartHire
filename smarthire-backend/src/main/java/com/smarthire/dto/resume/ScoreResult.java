package com.smarthire.dto.resume;

import java.util.List;

public record ScoreResult(
        int score,
        String summary,
        List<String> matchedSkills,
        List<String> missingSkills
) {
}