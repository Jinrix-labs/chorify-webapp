import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHORE_EMOJIS = ["🗑️", "🐕", "🍽️", "🧹", "🧺", "🌱", "🚗", "📚", "🛏️", "🪟"];

interface AddChoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyMembers?: Array<{ id: string; name: string; avatar: string }>;
  onAddChore?: (chore: {
    emoji: string;
    title: string;
    points: number;
    assignedToId?: string;
  }) => void;
}

export default function AddChoreDialog({
  open,
  onOpenChange,
  familyMembers = [],
  onAddChore,
}: AddChoreDialogProps) {
  const [emoji, setEmoji] = useState("🗑️");
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("10");
  const [assignedTo, setAssignedTo] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddChore?.({
        emoji,
        title: title.trim(),
        points: parseInt(points) || 10,
        assignedToId: assignedTo || undefined,
      });
      setTitle("");
      setPoints("10");
      setAssignedTo("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Chore 🎯
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Pick an emoji</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {CHORE_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-3xl p-2 rounded-md hover-elevate active-elevate-2 transition-all ${
                    emoji === e ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  data-testid={`emoji-${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Chore description</Label>
            <Input
              id="title"
              placeholder="e.g., Take out the trash"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-chore-title"
            />
          </div>

          <div>
            <Label htmlFor="points">Points reward</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              data-testid="input-chore-points"
            />
          </div>

          <div>
            <Label htmlFor="assign">Assign to (optional)</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger data-testid="select-assign-to">
                <SelectValue placeholder="Leave unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Leave unassigned</SelectItem>
                {familyMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.avatar} {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" data-testid="button-submit-chore">
            Add Chore
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
