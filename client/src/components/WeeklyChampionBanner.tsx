import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { getDaysUntilReset } from "@/lib/weeklyReset";

interface WeeklyChampionBannerProps {
  champion: {
    name: string;
    avatar: string;
    weeklyPoints: number;
  };
}

export default function WeeklyChampionBanner({
  champion,
}: WeeklyChampionBannerProps) {
  const daysLeft = getDaysUntilReset();

  return (
    <Card className="p-6 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-500">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="text-6xl">{champion.avatar}</div>
          <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
            👑
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 uppercase">
              Chore Champion
            </h3>
          </div>
          <p className="text-2xl font-black mb-1">{champion.name}</p>
          <p className="text-sm text-muted-foreground">
            Won last week with {champion.weeklyPoints} points!
          </p>
        </div>
        <Badge variant="outline" className="bg-yellow-500/20 border-yellow-600">
          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </Badge>
      </div>
    </Card>
  );
}
