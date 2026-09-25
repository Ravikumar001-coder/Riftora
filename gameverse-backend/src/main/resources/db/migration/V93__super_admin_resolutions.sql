ALTER TABLE disputes
ADD COLUMN is_appealed BOOLEAN DEFAULT FALSE;

ALTER TABLE dispute_resolutions
ADD COLUMN super_admin_override BOOLEAN DEFAULT FALSE,
ADD COLUMN super_admin_notes TEXT,
ADD COLUMN super_admin_resolved_at DATETIME,
ADD COLUMN super_admin_resolved_by VARCHAR(36),
ADD CONSTRAINT fk_super_admin_res_user FOREIGN KEY (super_admin_resolved_by) REFERENCES users(user_id);
