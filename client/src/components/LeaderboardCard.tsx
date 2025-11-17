import { Card } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  isCurrentUser?: boolean;
  isParent?: boolean;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardCard({ entries }: LeaderboardCardProps) {
  const getTrophyEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card
          key={entry.rank}
          className={`p-4 ${entry.isCurrentUser ? "ring-2 ring-primary" : ""}`}
          data-testid={`leaderboard-entry-${entry.rank}`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              {getTrophyEmoji(entry.rank) ? (
                <span className="text-3xl">{getTrophyEmoji(entry.rank)}</span>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground w-8 text-center">
                  {entry.rank}
                </span>
              )}
            </div>
            <span className="text-4xl flex-shrink-0">{entry.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate flex items-center gap-1">
                {entry.name}
                {entry.isParent && <span className="text-xl">👑</span>}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-2xl font-black text-primary">
                {entry.points}
              </span>
              <span className="text-xs text-muted-foreground ml-1">pts</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
