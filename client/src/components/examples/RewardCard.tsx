import RewardCard from '../RewardCard';

export default function RewardCardExample() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RewardCard
          id="1"
          emoji="🍕"
          title="Pick dinner tonight"
          pointCost={100}
          currentPoints={120}
          onClaim={() => console.log('Claimed pizza pick!')}
        />
        <RewardCard
          id="2"
          emoji="📱"
          title="Extra 30 min screen time"
          pointCost={200}
          currentPoints={150}
          onClaim={() => console.log('Claimed screen time!')}
        />
      </div>
    </div>
  );
}
