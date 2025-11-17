import RewardCard from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RewardsPage() {
  //todo: remove mock functionality
  const currentPoints = 340;

  const rewards = [
    { id: "1", emoji: "🍕", title: "Pick dinner tonight", pointCost: 100 },
    { id: "2", emoji: "📱", title: "Extra 30 min screen time", pointCost: 200 },
    { id: "3", emoji: "🎮", title: "Choose game night activity", pointCost: 150 },
    { id: "4", emoji: "🎬", title: "Movie pick this weekend", pointCost: 250 },
    { id: "5", emoji: "🍦", title: "Ice cream outing", pointCost: 300 },
    { id: "6", emoji: "🎨", title: "Skip one chore", pointCost: 400 },
  ];

  const handleClaimReward = (rewardId: string) => {
    console.log("Claimed reward:", rewardId);
  };

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
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            id={reward.id}
            emoji={reward.emoji}
            title={reward.title}
            pointCost={reward.pointCost}
            currentPoints={currentPoints}
            onClaim={() => handleClaimReward(reward.id)}
          />
        ))}
      </div>
    </div>
  );
}
