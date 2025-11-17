import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { Plus, Minus, RotateCcw } from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
}

interface PointsManagerProps {
  familyMembers: FamilyMember[];
  onAdjustPoints: (memberId: string, points: number, reason: string) => void;
  onResetPoints: (memberId: string) => void;
}

export default function PointsManager({
  familyMembers,
  onAdjustPoints,
  onResetPoints,
}: PointsManagerProps) {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [pointAmount, setPointAmount] = useState("10");
  const [reason, setReason] = useState("");

  const handleGivePoints = () => {
    if (selectedMember && pointAmount) {
      onAdjustPoints(selectedMember, parseInt(pointAmount), reason || "Bonus points!");
      setPointAmount("10");
      setReason("");
    }
  };

  const handleTakePoints = () => {
    if (selectedMember && pointAmount) {
      onAdjustPoints(selectedMember, -parseInt(pointAmount), reason || "Points deduction");
      setPointAmount("10");
      setReason("");
    }
  };

  return (
    <Card className="p-6 border-2 border-primary/50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👑</span>
        <h3 className="text-xl font-bold">Parent Mode - Manage Points</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="member">Select Family Member</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger data-testid="select-member">
              <SelectValue placeholder="Choose someone..." />
            </SelectTrigger>
            <SelectContent>
              {familyMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.avatar} {member.name} ({member.points} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="points">Point Amount</Label>
          <Input
            id="points"
            type="number"
            value={pointAmount}
            onChange={(e) => setPointAmount(e.target.value)}
            min="1"
            data-testid="input-point-amount"
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason (optional)</Label>
          <Input
            id="reason"
            placeholder="e.g., Great effort this week!"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            data-testid="input-reason"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGivePoints}
            disabled={!selectedMember}
            className="flex-1 bg-green-600 hover:bg-green-700"
            data-testid="button-give-points"
          >
            <Plus className="w-4 h-4 mr-2" />
            Give Points
          </Button>
          <Button
            onClick={handleTakePoints}
            disabled={!selectedMember}
            variant="destructive"
            className="flex-1"
            data-testid="button-take-points"
          >
            <Minus className="w-4 h-4 mr-2" />
            Take Points
          </Button>
        </div>

        <Button
          onClick={() => selectedMember && onResetPoints(selectedMember)}
          disabled={!selectedMember}
          variant="outline"
          className="w-full"
          data-testid="button-reset-points"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to 0
        </Button>
      </div>
    </Card>
  );
}
