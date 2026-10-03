package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.entity.TournamentMessage;
import com.gameverse.modules.tournament.entity.TournamentStaff;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateTournamentRequest {

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

    private String scoringTemplateId;
    
    private Tournament.FormatType formatType;
    private Integer teamsPerMatch;
    private Integer totalTeamSlots;
    private Integer totalRounds;
    private Integer matchesPerRound;
    private List<String> mapPool;

    private LocalDate startDate;
    private LocalDate endDate;
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

    private String streamUrl;
    private Tournament.StreamPlatform streamPlatform;

    private List<PrizePositionDto> prizePositions;
    private List<TournamentMessageDto> messages;
    private List<TournamentStaffDto> staff;

    @Data
    public static class PrizePositionDto {
        private Integer position;
        private String label;
        private BigDecimal amount;
        private BigDecimal percentage;
        private String category;
    }

    @Data
    public static class TournamentMessageDto {
        private TournamentMessage.MessageType messageType;
        private String title;
        private String body;
    }

    @Data
    public static class TournamentStaffDto {
        private String email;
        private TournamentStaff.StaffRole staffRole;
    }
}
