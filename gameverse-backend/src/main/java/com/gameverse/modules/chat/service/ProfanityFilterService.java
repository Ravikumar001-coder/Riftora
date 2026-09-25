package com.gameverse.modules.chat.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ProfanityFilterService {

    // Simple blocklist matching English, Hindi, Tamil, Telugu profanity
    // In a real application, this list would be maintained in a DB or external configuration.
    private static final Set<String> BANNED_WORDS = new HashSet<>(Arrays.asList(
        "badword", "bannedword", "profanity", "spamword",
        "gaali", "kutte", "kameena", // Hindi
        "badu", "punda", "thevidiya", // Tamil
        "lanja", "naakoduka", "puku" // Telugu
    ));

    public boolean containsProfanity(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        String lowerText = text.toLowerCase();
        
        // Remove common obfuscation characters (e.g. p@ssword -> password)
        // Basic check for words
        for (String word : BANNED_WORDS) {
            // Using regex to match whole words to prevent false positives (like "assassin")
            if (Pattern.compile("\\b" + word + "\\b").matcher(lowerText).find()) {
                return true;
            }
        }

        return false;
    }
}
