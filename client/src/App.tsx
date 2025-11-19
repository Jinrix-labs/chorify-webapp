import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import ChoresPage from "@/pages/ChoresPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import RewardsPage from "@/pages/RewardsPage";
import ProfilePage from "@/pages/ProfilePage";
import ParentDashboard from "@/pages/ParentDashboard";
import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/BottomNav";
import SidebarNav from "@/components/SidebarNav";
import NotificationPermissionDialog from "@/components/NotificationPermissionDialog";
import WeeklyChampionBanner from "@/components/WeeklyChampionBanner";
import InstallPrompt from "@/components/InstallPrompt";
import { useWeeklyReset } from "@/hooks/useWeeklyReset";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { Member } from "@shared/schema";

function AppContent() {
  const { member, family, isLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState("chores");

  const { data: familyMembers } = useQuery<Member[]>({
    queryKey: ["/api/families", family?.id, "members"],
    enabled: !!family?.id,
  });

  const { champion } = useWeeklyReset(familyMembers || []);
  const isCurrentUserChampion = champion?.name === member?.name;

  const handleLogin = (data: { member: Member; family: any }) => {
    console.log("Login data:", data);
    login(data.member, data.family);
    
    if (data.member.isParent) {
      console.log("🎉 Parent mode activated! You have special powers.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!member || !family) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <InstallPrompt />
      <NotificationPermissionDialog
        onPermissionGranted={() => console.log("Notifications enabled!")}
        onPermissionDenied={() => console.log("Notifications denied")}
      />
      
      <div className="min-h-screen bg-background flex">
        {/* Sidebar Navigation - Desktop Only */}
        <SidebarNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isParent={member.isParent} 
        />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            <ProfileHeader
              name={member.name}
              avatar={member.avatar}
              points={member.totalPoints}
              rank={
                familyMembers
                  ? familyMembers
                      .sort((a, b) => b.totalPoints - a.totalPoints)
                      .findIndex((m) => m.id === member.id) + 1
                  : 1
              }
              weeklyPoints={member.weeklyPoints}
              streak={member.streak}
              notificationCount={0}
              isChampion={isCurrentUserChampion}
            />

            {champion && !isCurrentUserChampion && (
              <WeeklyChampionBanner champion={champion} />
            )}

            {/* Page Content - Same for both mobile and desktop */}
            {activeTab === "chores" && <ChoresPage />}
            {activeTab === "parent" && member.isParent && <ParentDashboard />}
            {activeTab === "leaderboard" && <LeaderboardPage />}
            {activeTab === "rewards" && <RewardsPage />}
            {activeTab === "profile" && <ProfilePage />}
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isParent={member.isParent} />
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
