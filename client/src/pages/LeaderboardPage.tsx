import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardCard from "@/components/LeaderboardCard";

export default function LeaderboardPage() {
  //todo: remove mock functionality
  const weeklyLeaderboard = [
    { rank: 1, name: "Sarah", avatar: "🦄", points: 450, isCurrentUser: false },
    { rank: 2, name: "Alex", avatar: "🐱", points: 340, isCurrentUser: true },
    { rank: 3, name: "Jamie", avatar: "🦖", points: 280, isCurrentUser: false },
    { rank: 4, name: "Mom", avatar: "🦁", points: 210, isCurrentUser: false },
    { rank: 5, name: "Dad", avatar: "🐻", points: 185, isCurrentUser: false },
  ];

  const monthlyLeaderboard = [
    { rank: 1, name: "Alex", avatar: "🐱", points: 1240, isCurrentUser: true },
    { rank: 2, name: "Sarah", avatar: "🦄", points: 1180, isCurrentUser: false },
    { rank: 3, name: "Jamie", avatar: "🦖", points: 980, isCurrentUser: false },
    { rank: 4, name: "Dad", avatar: "🐻", points: 750, isCurrentUser: false },
    { rank: 5, name: "Mom", avatar: "🦁", points: 690, isCurrentUser: false },
  ];

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
