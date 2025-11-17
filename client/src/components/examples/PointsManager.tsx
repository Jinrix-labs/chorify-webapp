import PointsManager from '../PointsManager';

export default function PointsManagerExample() {
  const familyMembers = [
    { id: "1", name: "Alex", avatar: "🐱", points: 340 },
    { id: "2", name: "Sarah", avatar: "🦄", points: 450 },
    { id: "3", name: "Jamie", avatar: "🦖", points: 280 },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <PointsManager
        familyMembers={familyMembers}
        onAdjustPoints={(id, points, reason) => 
          console.log('Adjust points:', { id, points, reason })
        }
        onResetPoints={(id) => console.log('Reset points:', id)}
      />
    </div>
  );
}
