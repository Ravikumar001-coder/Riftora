INSERT IGNORE INTO organizations (org_id, org_name, org_slug, owner_user_id, description, logo_url, banner_url, website_url, discord_link, instagram_handle, youtube_url, contact_email, is_verified, visibility, plan_id)
SELECT 'moonknight-org-id', 'Moonknight Esports', 'moonknight', user_id, 
'Professional Esports organization competing in top tier tournaments across Asia. Follow our journey.', 
'https://ui-avatars.com/api/?name=MK&background=071426&color=fff', 
'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070', 
'https://moonknight.gg', 
'https://discord.gg/moonknight', 
'moonknight_esports', 
'youtube.com/moonknight', 
'contact@moonknight.gg', 
TRUE, 
'PUBLIC',
1
FROM users WHERE email = '157cseravikumar@example.com' LIMIT 1;
