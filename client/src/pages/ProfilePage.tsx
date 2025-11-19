import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Chore, Member } from "@shared/schema";

export default function ProfilePage() {
  const { member, family, logout } = useAuth();

  const { data: familyMembers } = useQuery<Member[]>({
    queryKey: ["/api/families", family?.id, "members"],
    enabled: !!family?.id,
  });

  const { data: chores } = useQuery<Chore[]>({
    queryKey: ["/api/families", family?.id, "chores"],
    enabled: !!family?.id,
  });

  // Calculate stats from real data
  const stats = useMemo(() => {
    if (!member) return [];

    // Calculate completed chores count
    const completedChores = chores?.filter(
      (c) => c.status === "completed" && c.completedById === member.id
    ).length || 0;

    // Calculate rank (position in weekly leaderboard)
    const sortedMembers = familyMembers
      ? [...familyMembers].sort((a, b) => b.weeklyPoints - a.weeklyPoints)
      : [];
    const rank = sortedMembers.findIndex((m) => m.id === member.id) + 1;

    return [
      { label: "Total Points", value: member.totalPoints, emoji: "⭐" },
      { label: "This Week", value: member.weeklyPoints, emoji: "📅" },
      { label: "Completed Chores", value: completedChores, emoji: "✅" },
      { label: "Current Rank", value: `#${rank}`, emoji: "🏆" },
      { label: "Day Streak", value: member.streak, emoji: "🔥" },
    ];
  }, [member, chores, familyMembers]);

  if (!member || !family) {
    return null;
  }

  return (
    <div className="pb-20 md:pb-6">
      <h2 className="text-3xl font-black mb-6">Profile</h2>

      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="text-8xl mb-4">{member.avatar}</div>
          <h3 className="text-3xl font-black mb-2">{member.name}</h3>
          <Badge variant="secondary" className="text-sm">
            Family: {family.code}
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
              <Badge variant="outline">{family.code}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-semibold">{member.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avatar</span>
              <span className="text-2xl">{member.avatar}</span>
            </div>
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full gap-2"
          data-testid="button-logout"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
