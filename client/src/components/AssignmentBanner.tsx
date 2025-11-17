import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

interface Assignment {
  id: string;
  assignedBy: string;
  choreTitle: string;
  emoji: string;
}

interface AssignmentBannerProps {
  assignments: Assignment[];
  onDismiss: (id: string) => void;
  onViewChore?: (id: string) => void;
}

export default function AssignmentBanner({
  assignments,
  onDismiss,
  onViewChore,
}: AssignmentBannerProps) {
  if (assignments.length === 0) return null;

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <Card
          key={assignment.id}
          className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 animate-in slide-in-from-top-5 duration-500"
        >
          <div className="flex items-start gap-3">
            <div className="text-4xl flex-shrink-0">{assignment.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary uppercase mb-1">
                {assignment.assignedBy} ASSIGNED YOU:
              </p>
              <p className="text-xl font-black mb-3">
                {assignment.choreTitle} 😱
              </p>
              <Button
                onClick={() => {
                  onViewChore?.(assignment.id);
                  onDismiss(assignment.id);
                }}
                className="w-full gap-2"
                data-testid="button-view-assignment"
              >
                View Chore
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDismiss(assignment.id)}
              className="flex-shrink-0"
              data-testid="button-dismiss-assignment"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
