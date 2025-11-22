import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChoreCard from "@/components/ChoreCard";
import AddChoreDialog from "@/components/AddChoreDialog";
import CompletionCelebration from "@/components/CompletionCelebration";
import { Plus, Loader2 } from "lucide-react";
import { notifications } from "@/lib/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Chore, Member } from "@shared/schema";

export default function ChoresPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [celebration, setCelebration] = useState<number | null>(null);
  const { member, family } = useAuth();
  const { toast } = useToast();

  const { data: chores, isLoading: choresLoading } = useQuery<Chore[]>({
    queryKey: ["/api/families", family?.id, "chores"],
    enabled: !!family?.id,
  });

  const { data: familyMembers } = useQuery<Member[]>({
    queryKey: ["/api/families", family?.id, "members"],
    enabled: !!family?.id,
  });

  const claimChoreMutation = useMutation({
    mutationFn: async ({ choreId, memberId }: { choreId: string; memberId: string }) => {
      const res = await apiRequest("PATCH", `/api/chores/${choreId}/claim`, { memberId });
      return res.json();
    },
    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({ queryKey: ["/api/families", family?.id, "chores"] });
      const chore = chores?.find((c) => c.id === variables.choreId);
      if (chore) {
        notifications.choreClaimed(member?.name || "You", chore.title, chore.emoji);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to claim chore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const completeChoreMutation = useMutation({
    mutationFn: async ({ choreId, memberId }: { choreId: string; memberId: string }) => {
      const res = await apiRequest("PATCH", `/api/chores/${choreId}/complete`, { memberId });
      return res.json();
    },
    onSuccess: async (_, variables) => {
      const chore = chores?.find((c) => c.id === variables.choreId);
      if (chore) {
        setCelebration(chore.points);
        notifications.choreCompleted(member?.name || "You", chore.title, chore.points, chore.emoji);
      }
      // Force immediate refetch instead of just invalidating
      await queryClient.refetchQueries({ queryKey: ["/api/families", family?.id, "chores"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to complete chore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const createChoreMutation = useMutation({
    mutationFn: async (chore: { emoji: string; title: string; points: number; assignedToId?: string }) => {
      const res = await apiRequest("POST", "/api/chores", {
        familyId: family?.id,
        emoji: chore.emoji,
        title: chore.title,
        points: chore.points,
        assignedToId: chore.assignedToId || null,
        assignedById: member?.id || null,
        completedById: null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families", family?.id, "chores"] });
      toast({
        title: "Success!",
        description: "Chore created successfully! 🎉",
      });
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create chore: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleComplete = (choreId: string) => {
    if (!member?.id) return;
    completeChoreMutation.mutate({ choreId, memberId: member.id });
  };

  const handleClaimChore = (choreId: string) => {
    if (!member?.id) return;
    claimChoreMutation.mutate({ choreId, memberId: member.id });
  };

  const handleAddChore = (chore: { emoji: string; title: string; points: number; assignedToId?: string }) => {
    createChoreMutation.mutate(chore);
  };

  // Debug logging
  console.log("All chores from API:", chores);
  console.log("Current member ID:", member?.id);
  console.log("Family ID:", family?.id);

  const unassignedChores = chores?.filter((c) => c.status === "available" && !c.assignedToId) || [];
  const myChores = chores?.filter((c) =>
    c.assignedToId === member?.id &&
    (c.status === "claimed" || c.status === "available")
  ) || [];

  console.log("Unassigned chores:", unassignedChores);
  console.log("My chores:", myChores);

  if (choresLoading) {
    return (
      <div className="pb-20 md:pb-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
                  onClaimChore={() => handleClaimChore(chore.id)}
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
              {myChores.map((chore) => {
                const assignedByMember = familyMembers?.find((m) => m.id === chore.assignedById);
                return (
                  <ChoreCard
                    key={chore.id}
                    id={chore.id}
                    emoji={chore.emoji}
                    title={chore.title}
                    points={chore.points}
                    assignedTo={{ name: "You", avatar: member?.avatar || "🐱" }}
                    assignedBy={assignedByMember?.name}
                    onComplete={() => handleComplete(chore.id)}
                  />
                );
              })}
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
        familyMembers={familyMembers || []}
        onAddChore={handleAddChore}
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
