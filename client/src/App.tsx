import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import ChoresPage from "@/pages/ChoresPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import RewardsPage from "@/pages/RewardsPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/BottomNav";
import AssignmentBanner from "@/components/AssignmentBanner";

function App() {
  //todo: remove mock functionality - replace with real auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("chores");
  
  //todo: remove mock functionality - replace with real notification data
  const [newAssignments, setNewAssignments] = useState([
    {
      id: "1",
      assignedBy: "MOM",
      choreTitle: "Clean your room",
      emoji: "🧹",
    },
    {
      id: "2",
      assignedBy: "DAD",
      choreTitle: "Take out the recycling",
      emoji: "♻️",
    },
  ]);

  const handleLogin = (data: {
    name: string;
    familyCode: string;
    avatar: string;
  }) => {
    console.log("Login data:", data);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginPage onLogin={handleLogin} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            <ProfileHeader
              name="Alex"
              avatar="🐱"
              points={1240}
              rank={2}
              weeklyPoints={340}
              streak={7}
              notificationCount={newAssignments.length}
            />

            <AssignmentBanner
              assignments={newAssignments}
              onDismiss={(id) => {
                setNewAssignments(newAssignments.filter((a) => a.id !== id));
              }}
              onViewChore={(id) => {
                console.log("View chore:", id);
                setActiveTab("chores");
              }}
            />

            <div className="md:hidden">
              {activeTab === "chores" && <ChoresPage />}
              {activeTab === "leaderboard" && <LeaderboardPage />}
              {activeTab === "rewards" && <RewardsPage />}
              {activeTab === "profile" && <ProfilePage />}
            </div>

            <div className="hidden md:block">
              <ChoresPage />
            </div>
          </div>

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
