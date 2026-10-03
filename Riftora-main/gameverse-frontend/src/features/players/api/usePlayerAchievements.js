import { useQuery } from '@tanstack/react-query';
import { explorePlayerAchievements } from '../../../services/mockData';

const fetchPlayerAchievements = async (username) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const achievements = explorePlayerAchievements[username];
  
  if (!achievements) {
    return [];
  }

  return achievements;
};

export function usePlayerAchievements(username) {
  return useQuery({
    queryKey: ['playerAchievements', username],
    queryFn: () => fetchPlayerAchievements(username),
    enabled: !!username,
  });
}
