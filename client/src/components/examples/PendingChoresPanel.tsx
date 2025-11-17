import PendingChoresPanel from '../PendingChoresPanel';
import { useState } from 'react';

export default function PendingChoresPanelExample() {
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

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">👑 Parent Mode - Pending Chores</h2>
      <PendingChoresPanel
        pendingChores={pendingChores}
        onApprove={(id) => {
          setPendingChores(pendingChores.filter((c) => c.id !== id));
          console.log('Approved:', id);
        }}
        onReject={(id) => {
          setPendingChores(pendingChores.filter((c) => c.id !== id));
          console.log('Rejected:', id);
        }}
      />
    </div>
  );
}
