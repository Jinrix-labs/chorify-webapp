import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
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
import type { Member, Family } from "@shared/schema";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [activeTab, setActiveTab] = useState("chores");
  
  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱", weeklyPoints: 340, totalPoints: 1240 },
    { id: "2", name: "Sarah", avatar: "🦄", weeklyPoints: 450, totalPoints: 1350 },
    { id: "3", name: "Jamie", avatar: "🦖", weeklyPoints: 280, totalPoints: 980 },
  ];
  
  const { champion } = useWeeklyReset(familyMembers);
  const isCurrentUserChampion = champion?.name === currentMember?.name;
  
  const [newAssignments] = useState([
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

  const handleLogin = (data: { member: Member; family: Family }) => {
    console.log("Login data:", data);
    setCurrentMember(data.member);
    setCurrentFamily(data.family);
    setIsLoggedIn(true);
    
    applyAvatarTheme(data.member.avatar);
    
    if (data.member.isParent) {
      console.log("🎉 Parent mode activated! You have special powers.");
    }
    
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
        <AuthProvider member={currentMember} family={currentFamily}>
          <InstallPrompt />
          <NotificationPermissionDialog
            onPermissionGranted={() => console.log("Notifications enabled!")}
            onPermissionDenied={() => console.log("Notifications denied")}
          />
          
          <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
              <ProfileHeader
                name={currentMember?.name || ""}
                avatar={currentMember?.avatar || "🐱"}
                points={currentMember?.totalPoints || 0}
                rank={2}
                weeklyPoints={currentMember?.weeklyPoints || 0}
                streak={currentMember?.streak || 0}
                notificationCount={newAssignments.length}
                isChampion={isCurrentUserChampion}
              />

              {champion && !isCurrentUserChampion && (
                <WeeklyChampionBanner champion={champion} />
              )}

              {newAssignments.length > 0 && (
                <AssignmentBanner
                  assignments={newAssignments}
                  onDismiss={(id) => {
                    console.log("Dismiss assignment:", id);
                  }}
                  onViewChore={(id) => {
                    console.log("View chore:", id);
                    setActiveTab("chores");
                  }}
                />
              )}

              <div className="md:hidden">
                {activeTab === "chores" && <ChoresPage />}
                {activeTab === "parent" && currentMember?.isParent && <ParentDashboard />}
                {activeTab === "leaderboard" && <LeaderboardPage />}
                {activeTab === "rewards" && <RewardsPage />}
                {activeTab === "profile" && <ProfilePage />}
              </div>

              <div className="hidden md:block">
                {currentMember?.isParent ? <ParentDashboard /> : <ChoresPage />}
              </div>
            </div>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isParent={currentMember?.isParent || false} />
          </div>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
