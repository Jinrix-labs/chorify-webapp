import { useEffect, useState } from 'react';
import {
  shouldResetWeek,
  markWeekReset,
  getWeeklyChampion,
  setWeeklyChampion,
  type WeeklyChampion,
} from '@/lib/weeklyReset';
import { sendNotification } from '@/lib/notifications';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  weeklyPoints: number;
  totalPoints: number;
}

export const useWeeklyReset = (familyMembers: FamilyMember[]) => {
  const [champion, setChampion] = useState<WeeklyChampion | null>(null);
  const [hasResetThisWeek, setHasResetThisWeek] = useState(false);

  useEffect(() => {
    // Check if we need to reset the week
    if (shouldResetWeek() && !hasResetThisWeek) {
      console.log('🏆 Weekly reset triggered!');
      
      // Find the champion (person with most weekly points)
      if (familyMembers.length > 0) {
        const sortedMembers = [...familyMembers].sort(
          (a, b) => b.weeklyPoints - a.weeklyPoints
        );
        const winner = sortedMembers[0];

        if (winner && winner.weeklyPoints > 0) {
          const newChampion: WeeklyChampion = {
            name: winner.name,
            avatar: winner.avatar,
            weeklyPoints: winner.weeklyPoints,
            weekEnding: new Date().toISOString(),
          };

          // Save the champion
          setWeeklyChampion(newChampion);
          setChampion(newChampion);

          // Send notification to everyone
          sendNotification({
            title: '🏆 New Week Started!',
            body: `${winner.name} was crowned Chore Champion! Who's taking the crown this week?`,
            tag: 'weekly-reset',
          });

          console.log(`👑 ${winner.name} is the new Chore Champion!`);
        }
      }

      // Mark that we've reset this week
      markWeekReset();
      setHasResetThisWeek(true);

      // In a real app, this would trigger a backend call to reset everyone's weekly points
      console.log('Weekly points reset to 0 (keeping lifetime points)');
    } else {
      // Load current champion if exists
      const currentChampion = getWeeklyChampion();
      setChampion(currentChampion);
    }
  }, [familyMembers, hasResetThisWeek]);

  return { champion };
};
