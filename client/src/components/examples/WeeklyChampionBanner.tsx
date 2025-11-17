import WeeklyChampionBanner from '../WeeklyChampionBanner';

export default function WeeklyChampionBannerExample() {
  const champion = {
    name: "Sarah",
    avatar: "🦄",
    weeklyPoints: 450,
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Weekly Champion</h2>
      <WeeklyChampionBanner champion={champion} />
    </div>
  );
}
