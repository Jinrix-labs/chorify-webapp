import AvatarPicker from '../AvatarPicker';
import { useState } from 'react';

export default function AvatarPickerExample() {
  const [selected, setSelected] = useState("🐱");
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pick Your Avatar!</h2>
      <AvatarPicker selected={selected} onSelect={setSelected} />
      <p className="mt-4 text-center text-muted-foreground">Selected: {selected}</p>
    </div>
  );
}
