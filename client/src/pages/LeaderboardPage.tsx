import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardCard from "@/components/LeaderboardCard";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Member } from "@shared/schema";

export default function LeaderboardPage() {
  const { member, family } = useAuth();

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["/api/families", family?.id, "members"],
    enabled: !!family?.id,
  });

  const weeklyLeaderboard = useMemo(() => {
    if (!members) return [];
    
    return [...members]
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
      .map((m, index) => ({
        rank: index + 1,
        name: m.name,
        avatar: m.avatar,
        points: m.weeklyPoints,
        isCurrentUser: m.id === member?.id,
        isParent: m.isParent,
      }));
  }, [members, member?.id]);

  const monthlyLeaderboard = useMemo(() => {
    if (!members) return [];
    
    return [...members]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((m, index) => ({
        rank: index + 1,
        name: m.name,
        avatar: m.avatar,
        points: m.totalPoints,
        isCurrentUser: m.id === member?.id,
        isParent: m.isParent,
      }));
  }, [members, member?.id]);

  if (isLoading) {
    return (
      <div className="pb-20 md:pb-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      <h2 className="text-3xl font-black mb-6">Leaderboard 🏆</h2>

      <Tabs defaultValue="week" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week" data-testid="tab-week">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" data-testid="tab-month">
            This Month
          </TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <LeaderboardCard entries={weeklyLeaderboard} />
        </TabsContent>

        <TabsContent value="month">
          <LeaderboardCard entries={monthlyLeaderboard} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
