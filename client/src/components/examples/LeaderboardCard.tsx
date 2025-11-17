import LeaderboardCard from '../LeaderboardCard';

export default function LeaderboardCardExample() {
  const entries = [
    { rank: 1, name: "Sarah", avatar: "🦄", points: 450, isCurrentUser: false },
    { rank: 2, name: "Alex", avatar: "🐱", points: 340, isCurrentUser: true },
    { rank: 3, name: "Jamie", avatar: "🦖", points: 280, isCurrentUser: false },
    { rank: 4, name: "Mom", avatar: "🦁", points: 210, isCurrentUser: false },
    { rank: 5, name: "Dad", avatar: "🐻", points: 185, isCurrentUser: false },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <LeaderboardCard entries={entries} />
    </div>
  );
}
