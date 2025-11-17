import ProfileHeader from '../ProfileHeader';

export default function ProfileHeaderExample() {
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">Regular User</h2>
      <ProfileHeader
        name="Alex"
        avatar="🐱"
        points={340}
        rank={2}
        weeklyPoints={85}
        streak={7}
        notificationCount={3}
        isChampion={false}
      />
      
      <h2 className="text-2xl font-bold mt-8">Chore Champion</h2>
      <ProfileHeader
        name="Sarah"
        avatar="🦄"
        points={450}
        rank={1}
        weeklyPoints={120}
        streak={10}
        notificationCount={0}
        isChampion={true}
      />
    </div>
  );
}
