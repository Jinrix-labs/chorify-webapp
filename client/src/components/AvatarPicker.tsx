import { useState } from "react";
import { Card } from "@/components/ui/card";

const AVATARS = ["🐱", "🦖", "🤖", "🦄", "🐻", "🦁", "🐶", "🐸", "🦊", "🐼", "🦅", "🐢"];

interface AvatarPickerProps {
  selected?: string;
  onSelect: (avatar: string) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {AVATARS.map((avatar) => (
        <Card
          key={avatar}
          onClick={() => onSelect(avatar)}
          className={`p-4 flex items-center justify-center cursor-pointer hover-elevate active-elevate-2 transition-all ${
            selected === avatar ? "ring-4 ring-primary shadow-lg" : ""
          }`}
          data-testid={`avatar-${avatar}`}
        >
          <span className="text-4xl md:text-5xl">{avatar}</span>
        </Card>
      ))}
    </div>
  );
}
