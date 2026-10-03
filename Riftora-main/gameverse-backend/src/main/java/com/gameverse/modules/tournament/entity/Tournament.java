package com.gameverse.modules.tournament.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.JdbcTypeCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
public class Tournament {

    @Id
    @UuidGenerator
    @Column(name = "tournament_id", length = 36, updatable = false, nullable = false)
    private String tournamentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scoring_template_id")
    private ScoringTemplate scoringTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_config_template_id")
    private GameConfigurationTemplate gameConfigTemplate;

    // Basic Info
    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "slug", length = 200, unique = true, nullable = false)
    private String slug;

    public enum ThemeType {
        USE_ORG, DARK_PRO, NEON_CYBER, CLEAN_LIGHT, FIRE_RED, CUSTOM
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "theme_type")
    private ThemeType themeType = ThemeType.USE_ORG;

    @Enumerated(EnumType.STRING)
    @Column(name = "tournament_type")
    private TournamentType tournamentType = TournamentType.single;

    @Column(name = "edition_number")
    private Integer editionNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "tournament_tier")
    private TournamentTier tournamentTier = TournamentTier.community;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "rules_text", columnDefinition = "TEXT")
    private String rulesText;

    @Column(name = "rulebook_url", length = 500)
    private String rulebookUrl;

    // Brand Kit (Snapshot from Org or Custom)
    @Column(name = "secondary_logo_url", length = 500)
    private String secondaryLogoUrl;

    @Column(name = "primary_color", length = 10)
    private String primaryColor;

    @Column(name = "secondary_color", length = 10)
    private String secondaryColor;

    @Column(name = "accent_color", length = 10)
    private String accentColor;

    @Column(name = "primary_font", length = 100)
    private String primaryFont;

    @Column(name = "secondary_font", length = 100)
    private String secondaryFont;

    @Column(name = "brand_tagline", length = 60)
    private String brandTagline;

    // Format
    @Enumerated(EnumType.STRING)
    @Column(name = "format_type")
    private FormatType formatType;

    @Column(name = "teams_per_match")
    private Integer teamsPerMatch;

    @Column(name = "total_team_slots")
    private Integer totalTeamSlots;

    @Column(name = "total_rounds")
    private Integer totalRounds;

    @Column(name = "matches_per_round")
    private Integer matchesPerRound = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_pool", columnDefinition = "json")
    private List<String> mapPool;

    @Column(name = "group_advancement_rule")
    private String groupAdvancementRule = "TOTAL_POINTS";

    @Column(name = "wild_card_spots")
    private Integer wildCardSpots = 0;

    public enum TiebreakerRule {
        TOTAL_POINTS,
        CHICKEN_DINNERS,
        TOTAL_KILLS,
        TOTAL_DAMAGE,
        BEST_SINGLE_MATCH_RANK,
        BEST_SINGLE_MATCH_POINTS,
        FEWEST_LAST_PLACE_FINISHES,
        HEAD_TO_HEAD,
        MOST_WINS
    }

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tiebreaker_sequence", columnDefinition = "json")
    private List<TiebreakerRule> tiebreakerSequence;

    // Dates
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "registration_open")
    private LocalDateTime registrationOpen;

    @Column(name = "registration_close")
    private LocalDateTime registrationClose;

    // Registration Settings
    @Column(name = "entry_fee", precision = 10, scale = 2)
    private BigDecimal entryFee = BigDecimal.ZERO;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payment_methods", columnDefinition = "json")
    private List<String> paymentMethods;

    @Column(name = "min_team_size")
    private Integer minTeamSize;

    @Column(name = "max_team_size")
    private Integer maxTeamSize;

    @Column(name = "max_substitutes")
    private Integer maxSubstitutes = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_mode")
    private ApprovalMode approvalMode;

    @Column(name = "waitlist_enabled")
    private Boolean waitlistEnabled = false;

    @Column(name = "waitlist_capacity")
    private Integer waitlistCapacity;

    @Column(name = "checkin_required")
    private Boolean checkinRequired = true;

    @Column(name = "checkin_open_mins")
    private Integer checkinOpenMins;

    @Column(name = "checkin_close_mins")
    private Integer checkinCloseMins;

    // Prize
    @Column(name = "prize_pool_total", precision = 12, scale = 2)
    private BigDecimal prizePoolTotal = BigDecimal.ZERO;

    @Column(name = "prize_currency", length = 3)
    private String prizeCurrency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "prize_funded_by")
    private PrizeFundedBy prizeFundedBy = PrizeFundedBy.entry_fees;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TournamentStatus status = TournamentStatus.draft;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "scheduled_publish_date")
    private LocalDateTime scheduledPublishDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Broadcast
    @Column(name = "stream_url", length = 500)
    private String streamUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "stream_platform")
    private StreamPlatform streamPlatform;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrizePosition> prizePositions = new ArrayList<>();

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TournamentMessage> messages = new ArrayList<>();

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TournamentStaff> staff = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Staff Access Codes
    @Column(name = "master_access_code", length = 50, unique = true)
    private String masterAccessCode;

    // FR-16-005: Winner Confirmation
    @Column(name = "winners_confirmed")
    private Boolean winnersConfirmed = false;

    @Column(name = "winners_confirmed_at")
    private LocalDateTime winnersConfirmedAt;

    @Column(name = "winners_confirmed_by", length = 36)
    private String winnersConfirmedBy;

    // FR-16-016: Organizer Payout Release
    @Column(name = "organizer_payout_released")
    private Boolean organizerPayoutReleased = false;

    @Column(name = "organizer_payout_released_at")
    private LocalDateTime organizerPayoutReleasedAt;

    @Column(name = "organizer_payout_amount", precision = 12, scale = 2)
    private java.math.BigDecimal organizerPayoutAmount;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "is_postponed")
    private Boolean isPostponed = false;

    @Column(name = "original_start_date")
    private LocalDateTime originalStartDate;

    @Column(name = "original_end_date")
    private LocalDateTime originalEndDate;

    @Column(name = "postponement_reason", columnDefinition = "TEXT")
    private String postponementReason;

    @Column(name = "schedule_published")
    private Boolean schedulePublished = false;

    @Column(name = "is_template")
    private Boolean isTemplate = false;

    @Column(name = "auto_lock_credentials")
    private Boolean autoLockCredentials = true;

    @Column(name = "auto_lock_mins_after_start")
    private Integer autoLockMinsAfterStart = 10;

    @Enumerated(EnumType.STRING)
    @Column(name = "result_publication_mode")
    private PublicationMode resultPublicationMode = PublicationMode.auto_publish;

    @Column(name = "is_leaderboard_locked")
    private Boolean isLeaderboardLocked = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "leaderboard_config", columnDefinition = "json")
    private LeaderboardConfig leaderboardConfig;

    @Column(name = "dispute_sequence")
    private Integer disputeSequence = 0;

    @Column(name = "dispute_submission_window_mins")
    private Integer disputeSubmissionWindowMins = 30;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum FormatType {
        league, group_stage_finals, multi_day
    }

    public enum ApprovalMode {
        auto, manual, invite_only
    }

    public enum PrizeFundedBy {
        entry_fees, sponsor, org
    }

    public enum TournamentStatus {
        draft, published, registration_open, registration_closed, check_in, live, completed, cancelled
    }

    public enum StreamPlatform {
        youtube, twitch, facebook_gaming, custom
    }

    public enum TournamentType {
        single, league
    }

    public enum TournamentTier {
        community, invitational, open, pro
    }

    public enum PublicationMode {
        auto_publish, director_verify
    }
}
