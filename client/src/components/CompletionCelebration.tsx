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

// Helper function to get the best available voice
function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer kid-friendly voices (higher pitch, more energetic)
  // Priority order:
  // 1. Female voices with "child" or "young" in name
  // 2. Female voices (generally more kid-friendly)
  // 3. Any voice with higher pitch capability
  // 4. Default to first available

  const childVoices = voices.filter(v => 
    v.name.toLowerCase().includes('child') || 
    v.name.toLowerCase().includes('young') ||
    v.name.toLowerCase().includes('zira') || // Windows friendly female voice
    v.name.toLowerCase().includes('samantha') || // macOS friendly female voice
    v.name.toLowerCase().includes('karen') // macOS/Australian friendly voice
  );

  if (childVoices.length > 0) {
    return childVoices[0];
  }

  const femaleVoices = voices.filter(v => 
    v.name.toLowerCase().includes('female') ||
    v.name.toLowerCase().includes('woman') ||
    v.name.toLowerCase().includes('zira') ||
    v.name.toLowerCase().includes('samantha') ||
    v.name.toLowerCase().includes('karen') ||
    v.name.toLowerCase().includes('susan') ||
    v.name.toLowerCase().includes('victoria')
  );

  if (femaleVoices.length > 0) {
    return femaleVoices[0];
  }

  // Fallback to any available voice
  return voices[0];
}

export default function CompletionCelebration({
  points,
  onClose,
}: CompletionCelebrationProps) {
  const [cheerMessage] = useState(
    () => CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]
  );

  useEffect(() => {
    // Wait for voices to load (they load asynchronously)
    let voicesLoaded = false;
    let voiceTimeout: NodeJS.Timeout | null = null;
    let checkVoicesInterval: NodeJS.Timeout | null = null;
    
    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        voicesLoaded = true;
      }
    };

    // Some browsers load voices immediately, others need this event
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // If voices aren't loaded yet, wait a bit
    voiceTimeout = setTimeout(() => {
      voicesLoaded = true;
    }, 100);

    const speakMessage = () => {
      const utterance = new SpeechSynthesisUtterance(cheerMessage);
      
      // Get the best available voice
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }
      
      // Optimized settings for kid-friendly, energetic voice
      utterance.rate = 1.15; // Slightly faster for excitement
      utterance.pitch = 1.3; // Higher pitch for more energetic/cheerful sound
      utterance.volume = 0.9; // Louder for celebration
      
      window.speechSynthesis.speak(utterance);
    };

    // Wait for voices to be ready before speaking
    if (voicesLoaded) {
      speakMessage();
    } else {
      checkVoicesInterval = setInterval(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
          if (checkVoicesInterval) clearInterval(checkVoicesInterval);
          if (voiceTimeout) clearTimeout(voiceTimeout);
          speakMessage();
        }
      }, 50);
      
      setTimeout(() => {
        if (checkVoicesInterval) clearInterval(checkVoicesInterval);
        if (window.speechSynthesis.getVoices().length > 0) {
          speakMessage();
        }
      }, 500);
    }

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
      if (voiceTimeout) clearTimeout(voiceTimeout);
      if (checkVoicesInterval) clearInterval(checkVoicesInterval);
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
