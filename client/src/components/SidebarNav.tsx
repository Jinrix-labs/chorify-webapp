import { Home, Trophy, Gift, User, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isParent?: boolean;
}

export default function SidebarNav({ activeTab, onTabChange, isParent = false }: SidebarNavProps) {
  const { logout, member } = useAuth();

  const tabs = isParent
    ? [
        { id: "chores", label: "Chores", icon: Home },
        { id: "parent", label: "Parent Dashboard", icon: Crown },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "profile", label: "Profile", icon: User },
      ]
    : [
        { id: "chores", label: "Chores", icon: Home },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "rewards", label: "Rewards", icon: Gift },
        { id: "profile", label: "Profile", icon: User },
      ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-card border-r border-border z-30">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{member?.avatar || "🐱"}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black truncate">{member?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground truncate">
                {isParent ? "👑 Parent" : "Family Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`sidebar-tab-${tab.id}`}
              >
                <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                <span className={cn("font-medium", isActive && "font-bold")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

