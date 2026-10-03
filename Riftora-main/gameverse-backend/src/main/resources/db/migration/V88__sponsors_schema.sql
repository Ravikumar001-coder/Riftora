CREATE TABLE sponsors (
    sponsor_id UUID PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(org_id),
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    tier VARCHAR(20) NOT NULL, -- TITLE, GOLD, SILVER, BRONZE, IN_KIND
    website_url VARCHAR(500),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sponsor_reps (
    rep_id UUID PRIMARY KEY,
    sponsor_id UUID NOT NULL REFERENCES sponsors(sponsor_id),
    user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sponsor_id, user_id)
);

CREATE TABLE tournament_sponsors (
    assign_id UUID PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES tournaments(tournament_id),
    sponsor_id UUID NOT NULL REFERENCES sponsors(sponsor_id),
    opt_out_graphics BOOLEAN DEFAULT FALSE,
    opt_out_stream BOOLEAN DEFAULT FALSE,
    impressions_page INT DEFAULT 0,
    impressions_stream INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, sponsor_id)
);

-- Note: Ensure ROLE_SPONSOR_REP exists in platform roles if managed via ENUM, or just rely on the link table for permissions.
