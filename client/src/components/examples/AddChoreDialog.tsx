import AddChoreDialog from '../AddChoreDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddChoreDialogExample() {
  const [open, setOpen] = useState(false);
  
  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱" },
    { id: "2", name: "Sarah", avatar: "🦄" },
    { id: "3", name: "Jamie", avatar: "🦖" },
  ];
  
  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)} data-testid="button-open-dialog">
        Add New Chore
      </Button>
      <AddChoreDialog 
        open={open}
        onOpenChange={setOpen}
        familyMembers={familyMembers}
        onAddChore={(chore) => console.log('New chore:', chore)}
      />
    </div>
  );
}
