import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RewardCardProps {
  id: string;
  emoji: string;
  title: string;
  pointCost: number;
  currentPoints: number;
  onClaim?: () => void;
}

export default function RewardCard({
  emoji,
  title,
  pointCost,
  currentPoints,
  onClaim,
}: RewardCardProps) {
  const progress = Math.min((currentPoints / pointCost) * 100, 100);
  const canClaim = currentPoints >= pointCost;

  return (
    <Card className="p-6 hover-elevate transition-all">
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{emoji}</div>
        <div className="text-3xl font-black text-primary mb-1">
          {pointCost} ⭐
        </div>
      </div>
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-center text-muted-foreground">
          {currentPoints} / {pointCost} points
        </p>
        <Button
          onClick={onClaim}
          disabled={!canClaim}
          className="w-full"
          variant={canClaim ? "default" : "secondary"}
          data-testid="button-claim-reward"
        >
          {canClaim ? "Claim Reward! 🎉" : "Keep Going!"}
        </Button>
      </div>
    </Card>
  );
}
