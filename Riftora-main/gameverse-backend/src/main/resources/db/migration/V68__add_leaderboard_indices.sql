-- FR-11-006: Leaderboard optimization indices
CREATE INDEX idx_match_results_status ON match_results (status, is_draft);
CREATE INDEX idx_team_scores_result ON team_match_scores (result_id);
