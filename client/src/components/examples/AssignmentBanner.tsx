import AssignmentBanner from '../AssignmentBanner';
import { useState } from 'react';

export default function AssignmentBannerExample() {
  const [assignments, setAssignments] = useState([
    {
      id: "1",
      assignedBy: "MOM",
      choreTitle: "Clean your room",
      emoji: "🧹",
    },
    {
      id: "2",
      assignedBy: "DAD",
      choreTitle: "Take out the recycling",
      emoji: "♻️",
    },
  ]);

  const handleDismiss = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    console.log('Dismissed assignment:', id);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">New Assignments!</h2>
      <AssignmentBanner
        assignments={assignments}
        onDismiss={handleDismiss}
        onViewChore={(id) => console.log('View chore:', id)}
      />
      {assignments.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          All caught up! No new assignments.
        </p>
      )}
    </div>
  );
}
