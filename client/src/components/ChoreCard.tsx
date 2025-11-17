import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles } from "lucide-react";

interface ChoreCardProps {
  id: string;
  emoji: string;
  title: string;
  points: number;
  assignedTo?: {
    name: string;
    avatar: string;
  };
  assignedBy?: string;
  onComplete?: () => void;
  onClaimChore?: () => void;
  showActions?: boolean;
}

export default function ChoreCard({
  emoji,
  title,
  points,
  assignedTo,
  assignedBy,
  onComplete,
  onClaimChore,
  showActions = true,
}: ChoreCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      onClaimChore?.();
      setIsClaiming(false);
    }, 1000);
  };

  return (
    <Card className="p-6 hover-elevate transition-all">
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1">
              ⭐ {points} points
            </Badge>
            {assignedTo && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="text-xl">{assignedTo.avatar}</span>
                <span>{assignedTo.name}</span>
              </div>
            )}
          </div>
          {assignedBy && (
            <p className="text-xs text-muted-foreground mb-3">
              Assigned by {assignedBy}
            </p>
          )}
          {showActions && (
            <div className="flex gap-2">
              {onComplete && (
                <Button
                  onClick={onComplete}
                  className="flex-1"
                  data-testid="button-complete-chore"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Done
                </Button>
              )}
              {onClaimChore && (
                <Button
                  onClick={handleClaim}
                  variant="default"
                  size="lg"
                  className={`flex-1 text-lg font-bold transition-all duration-500 ${
                    isClaiming
                      ? "bg-green-500 hover:bg-green-600 animate-spin"
                      : ""
                  }`}
                  data-testid="button-claim-chore"
                  disabled={isClaiming}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isClaiming ? "Claimed!" : "Claim this chore!"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
