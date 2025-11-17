import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingChoresPanel from "@/components/PendingChoresPanel";
import PointsManager from "@/components/PointsManager";
import RewardCard from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ParentDashboard() {
  //todo: remove mock functionality
  const [pendingChores, setPendingChores] = useState([
    {
      id: "1",
      emoji: "🗑️",
      title: "Take out the trash",
      points: 10,
      completedBy: { name: "Alex", avatar: "🐱" },
    },
    {
      id: "2",
      emoji: "🧹",
      title: "Vacuum living room",
      points: 20,
      completedBy: { name: "Sarah", avatar: "🦄" },
    },
  ]);

  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱", points: 340 },
    { id: "2", name: "Sarah", avatar: "🦄", points: 450 },
    { id: "3", name: "Jamie", avatar: "🦖", points: 280 },
  ];

  const rewards = [
    { id: "1", emoji: "🍕", title: "Pick dinner tonight", pointCost: 100 },
    { id: "2", emoji: "📱", title: "Extra 30 min screen time", pointCost: 200 },
  ];

  const handleApprove = (choreId: string) => {
    console.log("Approved chore:", choreId);
    setPendingChores(pendingChores.filter((c) => c.id !== choreId));
  };

  const handleReject = (choreId: string) => {
    console.log("Rejected chore:", choreId);
    setPendingChores(pendingChores.filter((c) => c.id !== choreId));
  };

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
            familyMembers={familyMembers}
            onAdjustPoints={(id, points, reason) =>
              console.log("Adjust points:", { id, points, reason })
            }
            onResetPoints={(id) => console.log("Reset points:", id)}
          />
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-4">
            <Button className="w-full gap-2" data-testid="button-add-reward">
              <Plus className="w-5 h-5" />
              Add New Reward
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
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
