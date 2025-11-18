import { useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingChoresPanel from "@/components/PendingChoresPanel";
import PointsManager from "@/components/PointsManager";
import RewardCard from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Chore, Member, Reward } from "@shared/schema";

export default function ParentDashboard() {
  const { family } = useAuth();
  const { toast } = useToast();

  const { data: chores, isLoading: choresLoading } = useQuery<Chore[]>({
    queryKey: ["/api/families", family?.id, "chores"],
    enabled: !!family?.id,
  });

  const { data: familyMembers, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/families", family?.id, "members"],
    enabled: !!family?.id,
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ["/api/families", family?.id, "rewards"],
    enabled: !!family?.id,
  });

  const approveChoreMutation = useMutation({
    mutationFn: async (choreId: string) => {
      const res = await apiRequest("PATCH", `/api/chores/${choreId}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "chores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "members"] });
      toast({
        title: "Success!",
        description: "Chore approved and points awarded! 🎉",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to approve chore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const rejectChoreMutation = useMutation({
    mutationFn: async (choreId: string) => {
      const res = await apiRequest("DELETE", `/api/chores/${choreId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "chores"] });
      toast({
        title: "Chore Rejected",
        description: "Chore has been rejected and removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reject chore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const adjustPointsMutation = useMutation({
    mutationFn: async ({ memberId, points }: { memberId: string; points: number }) => {
      const res = await apiRequest("PATCH", `/api/members/${memberId}/points`, { points });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "members"] });
      toast({
        title: "Success!",
        description: "Points adjusted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to adjust points: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleApprove = (choreId: string) => {
    approveChoreMutation.mutate(choreId);
  };

  const handleReject = (choreId: string) => {
    rejectChoreMutation.mutate(choreId);
  };

  const handleAdjustPoints = (memberId: string, points: number, reason: string) => {
    adjustPointsMutation.mutate({ memberId, points });
  };

  const handleResetPoints = (memberId: string) => {
    const member = familyMembers?.find((m) => m.id === memberId);
    if (!member) return;
    
    const resetAmount = -(member.weeklyPoints + member.totalPoints);
    adjustPointsMutation.mutate({ memberId, points: resetAmount });
  };

  const pendingChores = useMemo(() => {
    if (!chores || !familyMembers) return [];
    
    return chores
      .filter((c) => c.status === "pending")
      .map((chore) => {
        const completedByMember = familyMembers.find((m) => m.id === chore.completedById);
        return {
          id: chore.id,
          emoji: chore.emoji,
          title: chore.title,
          points: chore.points,
          completedBy: completedByMember
            ? { name: completedByMember.name, avatar: completedByMember.avatar }
            : { name: "Unknown", avatar: "❓" },
        };
      });
  }, [chores, familyMembers]);

  const membersList = useMemo(() => {
    if (!familyMembers) return [];
    
    return familyMembers.map((m) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      points: m.totalPoints,
    }));
  }, [familyMembers]);

  if (choresLoading || membersLoading || rewardsLoading) {
    return (
      <div className="pb-20 md:pb-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl">👑</span>
        <h2 className="text-3xl font-black">Parent Dashboard</h2>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({pendingChores.length})
          </TabsTrigger>
          <TabsTrigger value="points" data-testid="tab-points">
            Points
          </TabsTrigger>
          <TabsTrigger value="rewards" data-testid="tab-rewards">
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingChoresPanel
            pendingChores={pendingChores}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="points">
          <PointsManager
            familyMembers={membersList}
            onAdjustPoints={handleAdjustPoints}
            onResetPoints={handleResetPoints}
          />
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-4">
            <Button className="w-full gap-2" data-testid="button-add-reward">
              <Plus className="w-5 h-5" />
              Add New Reward
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards?.map((reward) => (
                <div key={reward.id} className="relative">
                  <RewardCard
                    id={reward.id}
                    emoji={reward.emoji}
                    title={reward.title}
                    pointCost={reward.pointCost}
                    currentPoints={0}
                    showActions={false}
                  />
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-edit-reward-${reward.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-delete-reward-${reward.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
