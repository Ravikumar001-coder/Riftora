ALTER TABLE disputes
MODIFY COLUMN category ENUM('score_mismatch', 'rule_violation', 'toxic_behavior', 'hacker_suspected', 'credential_leak', 'other') NOT NULL;
