package com.gameverse.modules.scoring.dto;

import java.util.Map;

public class VisionEventRequest {
    private int schemaVersion;
    private String eventId;
    private String matchId;
    private String eventType;
    private Map<String, Object> killer;
    private Map<String, Object> victim;
    private Map<String, Object> evidence;
    private double confidence;

    public int getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(int schemaVersion) { this.schemaVersion = schemaVersion; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public Map<String, Object> getKiller() { return killer; }
    public void setKiller(Map<String, Object> killer) { this.killer = killer; }
    public Map<String, Object> getVictim() { return victim; }
    public void setVictim(Map<String, Object> victim) { this.victim = victim; }
    public Map<String, Object> getEvidence() { return evidence; }
    public void setEvidence(Map<String, Object> evidence) { this.evidence = evidence; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
}
