import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProfileHeaderProps {
  name: string;
  avatar: string;
  points: number;
  rank: number;
  weeklyPoints: number;
  streak?: number;
  notificationCount?: number;
  isChampion?: boolean;
}

export default function ProfileHeader({
  name,
  avatar,
  points,
  rank,
  weeklyPoints,
  streak = 0,
  notificationCount = 0,
  isChampion = false,
}: ProfileHeaderProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="text-6xl">{avatar}</div>
          {isChampion && (
            <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
              👑
            </div>
          )}
          {notificationCount > 0 && !isChampion && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
              data-testid="badge-notification-count"
            >
              {notificationCount}
            </Badge>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black" data-testid="text-user-name">{name}</h1>
            {isChampion && (
              <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                Champion
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Total: <span className="font-bold text-primary">{points}</span>{" "}
            points
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="secondary" className="gap-1">
          🏆 Rank #{rank}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          ⭐ {weeklyPoints} this week
        </Badge>
        {streak > 0 && (
          <Badge variant="default" className="gap-1 bg-accent text-accent-foreground">
            🔥 {streak} day streak!
          </Badge>
        )}
      </div>
    </Card>
  );
}
