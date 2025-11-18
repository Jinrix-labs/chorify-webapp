import { useState, useEffect } from "react";
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
import ParentDashboard from "@/pages/ParentDashboard";
import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/BottomNav";
import AssignmentBanner from "@/components/AssignmentBanner";
import NotificationPermissionDialog from "@/components/NotificationPermissionDialog";
import WeeklyChampionBanner from "@/components/WeeklyChampionBanner";
import InstallPrompt from "@/components/InstallPrompt";
import { notifications } from "@/lib/notifications";
import { useWeeklyReset } from "@/hooks/useWeeklyReset";
import { applyAvatarTheme } from "@/lib/avatarThemes";

function App() {
  //todo: remove mock functionality - replace with real auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isParent, setIsParent] = useState(false);
  const [activeTab, setActiveTab] = useState("chores");
  const [currentUserName, setCurrentUserName] = useState("Alex");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("🐱");
  
  //todo: remove mock functionality - replace with real family data
  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱", weeklyPoints: 340, totalPoints: 1240 },
    { id: "2", name: "Sarah", avatar: "🦄", weeklyPoints: 450, totalPoints: 1350 },
    { id: "3", name: "Jamie", avatar: "🦖", weeklyPoints: 280, totalPoints: 980 },
  ];
  
  const { champion } = useWeeklyReset(familyMembers);
  const isCurrentUserChampion = champion?.name === currentUserName;
  
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
    isParent: boolean;
  }) => {
    console.log("Login data:", data);
    setIsLoggedIn(true);
    setIsParent(data.isParent);
    setCurrentUserName(data.name);
    setCurrentUserAvatar(data.avatar);
    
    applyAvatarTheme(data.avatar);
    
    if (data.isParent) {
      console.log("🎉 Parent mode activated! You have special powers.");
    }
    
    // Simulate receiving assignment notifications on login
    // In a real app, these would come from the server
    if (newAssignments.length > 0) {
      newAssignments.forEach((assignment) => {
        notifications.choreAssigned(
          assignment.assignedBy,
          assignment.choreTitle,
          assignment.emoji
        );
      });
    }
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
        <InstallPrompt />
        <NotificationPermissionDialog
          onPermissionGranted={() => console.log("Notifications enabled!")}
          onPermissionDenied={() => console.log("Notifications denied")}
        />
        
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            <ProfileHeader
              name={currentUserName}
              avatar={currentUserAvatar}
              points={1240}
              rank={2}
              weeklyPoints={340}
              streak={7}
              notificationCount={newAssignments.length}
              isChampion={isCurrentUserChampion}
            />

            {champion && !isCurrentUserChampion && (
              <WeeklyChampionBanner champion={champion} />
            )}

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
              {activeTab === "parent" && isParent && <ParentDashboard />}
              {activeTab === "leaderboard" && <LeaderboardPage />}
              {activeTab === "rewards" && <RewardsPage />}
              {activeTab === "profile" && <ProfilePage />}
            </div>

            <div className="hidden md:block">
              {isParent ? <ParentDashboard /> : <ChoresPage />}
            </div>
          </div>

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isParent={isParent} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
