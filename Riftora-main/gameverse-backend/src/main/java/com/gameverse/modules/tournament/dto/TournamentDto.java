package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TournamentDto {
    private String tournamentId;
    private String orgId;
    private String gameId;
    private String gameName;
    private String scoringTemplateId;
    private String createdByUserId;
    private String name;
    private String slug;
    private Tournament.ThemeType themeType;
    private Tournament.TournamentType tournamentType;
    private Integer editionNumber;
    private Tournament.TournamentTier tournamentTier;
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private String secondaryLogoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String accentColor;
    private String primaryFont;
    private String secondaryFont;
    private String brandTagline;
    
    private Tournament.FormatType formatType;
    private Integer teamsPerMatch;
    private Integer totalTeamSlots;
    private Integer slotsTaken;
    private Boolean isFull;
    private Integer totalRounds;
    private Integer matchesPerRound;
    private List<String> mapPool;
    private String tiebreakerRules;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationOpen;
    private LocalDateTime registrationClose;

    private BigDecimal entryFee;
    private List<String> paymentMethods;
    private Integer minTeamSize;
    private Integer maxTeamSize;
    private Integer maxSubstitutes;
    private Tournament.ApprovalMode approvalMode;
    private Boolean waitlistEnabled;
    private Integer waitlistCapacity;
    private Boolean checkinRequired;
    private Integer checkinOpenMins;
    private Integer checkinCloseMins;

    private BigDecimal prizePoolTotal;
    private String prizeCurrency;
    private Tournament.PrizeFundedBy prizeFundedBy;

    private Tournament.TournamentStatus status;
    private LocalDateTime publishedAt;
    private LocalDateTime scheduledPublishDate;
    private LocalDateTime completedAt;

    private String streamUrl;
    private Tournament.StreamPlatform streamPlatform;
    
    private Boolean isTemplate;
    private Boolean isBookmarked;
    private Boolean schedulePublished;
    private Boolean autoLockCredentials;
    private Integer autoLockMinsAfterStart;
    private List<UpdateTournamentRequest.PrizePositionDto> prizePositions;
    
    // Staff Access Codes
    private String masterAccessCode;
}
