-- V86: Seed Analytics Data

INSERT INTO tournament_analytics (
    analytics_id, 
    tournament_id, 
    org_id, 
    total_participants, 
    total_registrations, 
    prize_pool_distributed, 
    total_revenue,
    no_show_rate,
    disputes_raised,
    avg_match_duration_minutes,
    stream_peak_viewers
)
SELECT 
    UUID(), 
    tournament_id, 
    org_id, 
    FLOOR(RAND() * 200) + 50, -- total participants between 50-250
    FLOOR(RAND() * 50) + 10,  -- registrations 10-60
    ROUND(RAND() * 10000, 2), -- prize pool up to 10k
    ROUND(RAND() * 5000, 2),  -- revenue up to 5k
    ROUND(RAND() * 15, 2),    -- no show rate 0-15%
    FLOOR(RAND() * 5),        -- disputes 0-5
    FLOOR(RAND() * 20) + 20,  -- avg match duration 20-40 min
    FLOOR(RAND() * 5000)      -- peak viewers up to 5000
FROM tournaments;
