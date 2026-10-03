package com.gameverse.core.events;

import org.springframework.context.ApplicationEvent;

public class LeaderboardRecalculationEvent extends ApplicationEvent {

    private final String tournamentId;

    public LeaderboardRecalculationEvent(Object source, String tournamentId) {
        super(source);
        this.tournamentId = tournamentId;
    }

    public String getTournamentId() {
        return tournamentId;
    }
}
