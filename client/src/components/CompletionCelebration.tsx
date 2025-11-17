import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";

interface CompletionCelebrationProps {
  points: number;
  onClose: () => void;
}

const CHEER_MESSAGES = [
  "Great job!",
  "You're a chore legend!",
  "Mom is proud!",
  "Dad is impressed!",
  "Amazing work!",
  "You're crushing it!",
  "Superstar!",
  "Keep it up!",
  "Incredible!",
  "You're the best!",
];

export default function CompletionCelebration({
  points,
  onClose,
}: CompletionCelebrationProps) {
  const [cheerMessage] = useState(
    () => CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]
  );

  useEffect(() => {
    // Play cheer sound
    const utterance = new SpeechSynthesisUtterance(cheerMessage);
    utterance.rate = 1.2;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeout(onClose, 500);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, [onClose, cheerMessage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="p-12 text-center max-w-md mx-4 animate-in zoom-in-50 duration-500">
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-6xl font-black text-primary mb-4">
          +{points} POINTS!
        </h2>
        <p className="text-3xl font-bold mb-2">{cheerMessage}</p>
        <p className="text-xl text-muted-foreground">
          You're making great progress!
        </p>
      </Card>
    </div>
  );
}
