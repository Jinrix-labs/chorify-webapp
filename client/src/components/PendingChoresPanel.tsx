import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface PendingChore {
  id: string;
  emoji: string;
  title: string;
  points: number;
  completedBy: {
    name: string;
    avatar: string;
  };
}

interface PendingChoresPanelProps {
  pendingChores: PendingChore[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingChoresPanel({
  pendingChores,
  onApprove,
  onReject,
}: PendingChoresPanelProps) {
  if (pendingChores.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <p className="text-muted-foreground">No chores waiting for approval</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingChores.map((chore) => (
        <Card
          key={chore.id}
          className="p-6 border-2 border-yellow-500/50 bg-yellow-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">{chore.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{chore.title}</h3>
                <Badge variant="outline" className="bg-yellow-500/20">
                  Pending
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{chore.completedBy.avatar}</span>
                <span className="text-sm text-muted-foreground">
                  {chore.completedBy.name} says they completed this
                </span>
              </div>
              <Badge variant="secondary" className="gap-1 mb-4">
                ⭐ {chore.points} points
              </Badge>
              <div className="flex gap-2">
                <Button
                  onClick={() => onApprove(chore.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  data-testid="button-approve-chore"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => onReject(chore.id)}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-reject-chore"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
