import { useQuery, useMutation } from "@tanstack/react-query";
import RewardCard from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Reward } from "@shared/schema";

export default function RewardsPage() {
  const { member, family } = useAuth();
  const { toast } = useToast();

  const { data: rewards, isLoading } = useQuery<Reward[]>({
    queryKey: ["/api/families", family?.id, "rewards"],
    enabled: !!family?.id,
  });

  const redeemMutation = useMutation({
    mutationFn: async ({ rewardId, memberId }: { rewardId: string; memberId: string }) => {
      const res = await apiRequest("POST", `/api/rewards/${rewardId}/redeem`, { memberId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "members"] });
      toast({
        title: "Success!",
        description: "Reward redeemed successfully! 🎉",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to redeem reward: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleClaimReward = (rewardId: string) => {
    if (!member?.id) return;
    
    const reward = rewards?.find((r) => r.id === rewardId);
    if (!reward) return;
    
    if (member.totalPoints < reward.pointCost) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.pointCost - member.totalPoints} more points to claim this reward.`,
        variant: "destructive",
      });
      return;
    }

    redeemMutation.mutate({ rewardId, memberId: member.id });
  };

  if (isLoading) {
    return (
      <div className="pb-20 md:pb-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black">Rewards</h2>
        <Button variant="outline" className="gap-2" data-testid="button-add-reward">
          <Plus className="w-5 h-5" />
          Add Reward
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards?.map((reward) => (
          <RewardCard
            key={reward.id}
            id={reward.id}
            emoji={reward.emoji}
            title={reward.title}
            pointCost={reward.pointCost}
            currentPoints={member?.totalPoints || 0}
            onClaim={() => handleClaimReward(reward.id)}
          />
        ))}
      </div>
    </div>
  );
}
