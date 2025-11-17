import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChoreCard from "@/components/ChoreCard";
import AddChoreDialog from "@/components/AddChoreDialog";
import CompletionCelebration from "@/components/CompletionCelebration";
import { Plus } from "lucide-react";
import { notifications } from "@/lib/notifications";

export default function ChoresPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [celebration, setCelebration] = useState<number | null>(null);

  //todo: remove mock functionality
  const unassignedChores = [
    { id: "1", emoji: "🗑️", title: "Take out the trash", points: 10 },
    { id: "2", emoji: "🐕", title: "Feed the dog", points: 15 },
  ];

  const myChores = [
    {
      id: "3",
      emoji: "🧹",
      title: "Vacuum the living room",
      points: 20,
      assignedBy: "Mom",
    },
    {
      id: "4",
      emoji: "🍽️",
      title: "Load the dishwasher",
      points: 10,
      assignedBy: "Dad",
    },
  ];

  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱" },
    { id: "2", name: "Sarah", avatar: "🦄" },
    { id: "3", name: "Jamie", avatar: "🦖" },
    { id: "4", name: "Mom", avatar: "🦁" },
    { id: "5", name: "Dad", avatar: "🐻" },
  ];

  const handleComplete = (points: number, choreTitle: string, emoji: string) => {
    console.log("Completed chore, earned", points, "points");
    setCelebration(points);
    
    // Send notification to family members
    notifications.choreCompleted("Alex", choreTitle, points, emoji);
  };

  const handleClaimChore = (choreId: string, choreTitle: string, emoji: string) => {
    console.log("Claimed chore:", choreId);
    
    // Send notification
    notifications.choreClaimed("You", choreTitle, emoji);
  };

  return (
    <div className="pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black">Chores</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="gap-2"
          data-testid="button-add-chore"
        >
          <Plus className="w-5 h-5" />
          Add Chore
        </Button>
      </div>

      <Tabs defaultValue="unassigned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unassigned" data-testid="tab-unassigned">
            Needs a Hero! 🦸
          </TabsTrigger>
          <TabsTrigger value="mine" data-testid="tab-mine">
            My Chores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unassigned" className="space-y-4">
          {unassignedChores.length > 0 ? (
            <div className="space-y-4">
              {unassignedChores.map((chore) => (
                <ChoreCard
                  key={chore.id}
                  id={chore.id}
                  emoji={chore.emoji}
                  title={chore.title}
                  points={chore.points}
                  onClaimChore={() => handleClaimChore(chore.id, chore.title, chore.emoji)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No chores need a hero right now
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          {myChores.length > 0 ? (
            <div className="space-y-4">
              {myChores.map((chore) => (
                <ChoreCard
                  key={chore.id}
                  id={chore.id}
                  emoji={chore.emoji}
                  title={chore.title}
                  points={chore.points}
                  assignedTo={{ name: "You", avatar: "🐱" }}
                  assignedBy={chore.assignedBy}
                  onComplete={() => handleComplete(chore.points, chore.title, chore.emoji)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">😎</div>
              <h3 className="text-2xl font-bold mb-2">You're all done!</h3>
              <p className="text-muted-foreground">
                No chores assigned to you right now
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AddChoreDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        familyMembers={familyMembers}
        onAddChore={(chore) => console.log("New chore added:", chore)}
      />

      {celebration !== null && (
        <CompletionCelebration
          points={celebration}
          onClose={() => setCelebration(null)}
        />
      )}
    </div>
  );
}
