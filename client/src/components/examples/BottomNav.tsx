import BottomNav from '../BottomNav';
import { useState } from 'react';

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState("chores");
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">Current tab: {activeTab}</h2>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
