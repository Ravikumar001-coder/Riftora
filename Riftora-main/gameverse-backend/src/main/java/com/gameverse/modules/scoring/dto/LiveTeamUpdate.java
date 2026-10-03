package com.gameverse.modules.scoring.dto;

import java.io.Serializable;

public class LiveTeamUpdate implements Serializable {
    private String type = "LIVE_TEAM_UPDATE";
    private String matchId;
    private int teamSlot;
    private int kills;
    private int livePoints;

    public LiveTeamUpdate() {}

    public LiveTeamUpdate(String matchId, int teamSlot, int kills, int livePoints) {
        this.matchId = matchId;
        this.teamSlot = teamSlot;
        this.kills = kills;
        this.livePoints = livePoints;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }
    public int getTeamSlot() { return teamSlot; }
    public void setTeamSlot(int teamSlot) { this.teamSlot = teamSlot; }
    public int getKills() { return kills; }
    public void setKills(int kills) { this.kills = kills; }
    public int getLivePoints() { return livePoints; }
    public void setLivePoints(int livePoints) { this.livePoints = livePoints; }
}
