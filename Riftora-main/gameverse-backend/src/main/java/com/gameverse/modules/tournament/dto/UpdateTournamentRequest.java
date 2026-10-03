package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.entity.TournamentMessage;
import com.gameverse.modules.tournament.entity.TournamentStaff;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateTournamentRequest {

    @JsonProperty("name")
    private String name;
    
    @JsonProperty("slug")
    private String slug;
    
    @JsonProperty("theme_type")
    private Tournament.ThemeType themeType;
    
    @JsonProperty("tournament_type")
    private Tournament.TournamentType tournamentType;
    
    @JsonProperty("edition_number")
    private Integer editionNumber;
    
    @JsonProperty("tournament_tier")
    private Tournament.TournamentTier tournamentTier;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("logo_url")
    private String logoUrl;
    
    @JsonProperty("banner_url")
    private String bannerUrl;
    
    @JsonProperty("secondary_logo_url")
    private String secondaryLogoUrl;
    
    @JsonProperty("primary_color")
    private String primaryColor;
    
    @JsonProperty("secondary_color")
    private String secondaryColor;
    
    @JsonProperty("accent_color")
    private String accentColor;
    
    @JsonProperty("primary_font")
    private String primaryFont;
    
    @JsonProperty("secondary_font")
    private String secondaryFont;
    
    @JsonProperty("brand_tagline")
    private String brandTagline;

    @JsonProperty("scoring_template_id")
    private String scoringTemplateId;
    
    @JsonProperty("game_config_template_id")
    private String gameConfigTemplateId;
    
    @JsonProperty("format_type")
    private Tournament.FormatType formatType;
    
    @JsonProperty("teams_per_match")
    private Integer teamsPerMatch;
    
    @JsonProperty("total_team_slots")
    private Integer totalTeamSlots;
    
    @JsonProperty("total_rounds")
    private Integer totalRounds;
    
    @JsonProperty("matches_per_round")
    private Integer matchesPerRound;
    
    @JsonProperty("map_pool")
    private List<String> mapPool;
    
    @JsonProperty("tiebreaker_rules")
    private String tiebreakerRules;

    @JsonProperty("start_date")
    private LocalDateTime startDate;
    
    @JsonProperty("end_date")
    private LocalDateTime endDate;
    
    @JsonProperty("scheduled_publish_date")
    private LocalDateTime scheduledPublishDate;
    
    @JsonProperty("registration_open")
    private LocalDateTime registrationOpen;
    
    @JsonProperty("registration_close")
    private LocalDateTime registrationClose;

    @JsonProperty("entry_fee")
    private BigDecimal entryFee;
    
    @JsonProperty("payment_methods")
    private List<String> paymentMethods;
    
    @NotNull(message = "Min team size is required")
    @Min(value = 1, message = "Min team size must be at least 1")
    @JsonProperty("min_team_size")
    private Integer minTeamSize;
    
    @NotNull(message = "Max team size is required")
    @Min(value = 1, message = "Max team size must be at least 1")
    @JsonProperty("max_team_size")
    private Integer maxTeamSize;
    
    @JsonProperty("max_substitutes")
    private Integer maxSubstitutes;
    
    @JsonProperty("approval_mode")
    private Tournament.ApprovalMode approvalMode;
    
    @JsonProperty("waitlist_enabled")
    private Boolean waitlistEnabled;
    
    @JsonProperty("waitlist_capacity")
    private Integer waitlistCapacity;
    
    @JsonProperty("checkin_required")
    private Boolean checkinRequired;
    
    @JsonProperty("checkin_open_mins")
    private Integer checkinOpenMins;
    
    @JsonProperty("checkin_close_mins")
    private Integer checkinCloseMins;

    @JsonProperty("prize_pool_total")
    private BigDecimal prizePoolTotal;
    
    @JsonProperty("prize_currency")
    private String prizeCurrency;
    
    @JsonProperty("prize_funded_by")
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
