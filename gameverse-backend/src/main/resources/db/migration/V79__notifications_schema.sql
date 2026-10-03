-- Create notifications table
CREATE TABLE notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NULL,
    recipient_user_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36) NULL,
    match_id VARCHAR(36) NULL,
    
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    action_url VARCHAR(500) NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME NULL,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME NULL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES notification_templates(template_id) ON DELETE SET NULL,
    FOREIGN KEY (recipient_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_unread ON notifications(recipient_user_id, is_read, created_at DESC);

-- Create notification_deliveries table
CREATE TABLE notification_deliveries (
    delivery_id VARCHAR(36) PRIMARY KEY,
    notification_id VARCHAR(36) NOT NULL,
    
    channel ENUM('in_app','push','sms','email') NOT NULL,
    status ENUM('pending','sent','delivered','failed') NOT NULL DEFAULT 'pending',
    
    gateway_used VARCHAR(50) NULL,
    gateway_message_id VARCHAR(200) NULL,
    
    attempt_count INT DEFAULT 0,
    last_attempt_at DATETIME NULL,
    delivered_at DATETIME NULL,
    failure_reason TEXT NULL,
    
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE CASCADE
);

-- Add notification preferences to users table if not exists (or create a separate table)
CREATE TABLE user_notification_preferences (
    preference_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    
    do_not_disturb_enabled BOOLEAN DEFAULT FALSE,
    dnd_start_time TIME NULL,
    dnd_end_time TIME NULL,
    
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
