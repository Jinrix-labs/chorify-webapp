import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  //todo: remove mock functionality
  const user = {
    name: "Alex",
    avatar: "🐱",
    familyCode: "SMITH2025",
    totalPoints: 1240,
    weeklyPoints: 340,
    completedChores: 42,
    rank: 2,
    streak: 7,
  };

  const stats = [
    { label: "Total Points", value: user.totalPoints, emoji: "⭐" },
    { label: "This Week", value: user.weeklyPoints, emoji: "📅" },
    { label: "Completed Chores", value: user.completedChores, emoji: "✅" },
    { label: "Current Rank", value: `#${user.rank}`, emoji: "🏆" },
    { label: "Day Streak", value: user.streak, emoji: "🔥" },
  ];

  return (
    <div className="pb-20 md:pb-6">
      <h2 className="text-3xl font-black mb-6">Profile</h2>

      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="text-8xl mb-4">{user.avatar}</div>
          <h3 className="text-3xl font-black mb-2">{user.name}</h3>
          <Badge variant="secondary" className="text-sm">
            Family: {user.familyCode}
          </Badge>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`text-center p-4 rounded-lg ${
                  stat.label === "Day Streak"
                    ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50"
                    : "bg-muted"
                }`}
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className={`text-2xl font-black mb-1 ${
                  stat.label === "Day Streak" ? "text-orange-600 dark:text-orange-400" : "text-primary"
                }`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Family Code</span>
              <Badge variant="outline">{user.familyCode}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avatar</span>
              <span className="text-2xl">{user.avatar}</span>
            </div>
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full gap-2"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
