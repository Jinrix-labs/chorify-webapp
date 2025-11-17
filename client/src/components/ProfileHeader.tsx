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
}

export default function ProfileHeader({
  name,
  avatar,
  points,
  rank,
  weeklyPoints,
  streak = 0,
  notificationCount = 0,
}: ProfileHeaderProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="text-6xl">{avatar}</div>
          {notificationCount > 0 && (
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
          <h1 className="text-3xl font-black mb-1" data-testid="text-user-name">{name}</h1>
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
