import ProfileHeader from '../ProfileHeader';

export default function ProfileHeaderExample() {
  return (
    <div className="p-6 max-w-2xl">
      <ProfileHeader
        name="Alex"
        avatar="🐱"
        points={340}
        rank={2}
        weeklyPoints={85}
        notificationCount={3}
      />
    </div>
  );
}
