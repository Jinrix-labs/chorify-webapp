import ChoreCard from '../ChoreCard';

export default function ChoreCardExample() {
  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Chore Cards</h2>
      
      <ChoreCard
        id="1"
        emoji="🗑️"
        title="Take out the trash"
        points={10}
        assignedTo={{ name: "Alex", avatar: "🐱" }}
        assignedBy="Mom"
        onComplete={() => console.log('Completed!')}
      />
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Unassigned Chore (Try the claim button!)</h3>
      <ChoreCard
        id="2"
        emoji="🐕"
        title="Feed the dog"
        points={15}
        onClaimChore={() => console.log('Claimed!')}
      />
    </div>
  );
}
