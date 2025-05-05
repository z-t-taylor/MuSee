import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

export const funFacts = [
  "Here's some fun facts while you wait..",
  "Art used to be an Olympic event between 1912 and 1948.",
  "Did you know Van Gogh only sold one painting in his lifetime?",
  "Claude Monet painted over 250 versions of his water lilies.",
  "When the Mona Lisa was stolen in 1911, crowds flocked to the empty wall!",
  "The Mona Lisa has her own mailbox in the Louvre because of all the love letters she receives.",
  "Da Vinci invented a primitive helicopter in 1493.",
  "Georgia O’Keeffe lived to be 98 and painted into her 90s.",
  "Rodin’s The Thinker was originally part of 'The Gates of Hell'.",
  "The world’s oldest animal painting is 45,500 years old.",
  "Hokusai’s Great Wave was part of a series called Thirty-Six Views of Mount Fuji.",
  "Banksy’s true identity is still unconfirmed. Maybe it's you!",
];

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface LoaderProps {
  initialMessage: string;
  loading: boolean;
  initialDurationMs?: number;
  rotateIntervalMs?: number;
  className?: string;
}

export function Loader({
  initialMessage,
  loading,
  initialDurationMs = 2000,
  rotateIntervalMs = 3500,
  className = "",
}: LoaderProps) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [idx, setIdx] = useState(0);

  const shuffledFunFacts = shuffleArray(funFacts.slice(1));

  useEffect(() => {
    if (!loading) return;
    const toPhase1 = setTimeout(() => setPhase(1), initialDurationMs);
    return () => clearTimeout(toPhase1);
  }, [loading, initialDurationMs]);

  useEffect(() => {
    if (!loading || phase !== 1) return;
    const toPhase2 = setTimeout(() => setPhase(2), rotateIntervalMs);
    return () => clearTimeout(toPhase2);
  }, [loading, phase, rotateIntervalMs]);

  useEffect(() => {
    if (!loading || phase !== 2) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % shuffledFunFacts.length);
    }, rotateIntervalMs);
    return () => clearInterval(interval);
  }, [loading, phase, rotateIntervalMs]);

  if (!loading) return null;

  let message = initialMessage;

  if (phase === 1) {
    message = funFacts[0];
  } else if (phase === 2) {
    message = shuffledFunFacts[idx];
  }

  return (
    <div
      className={`flex flex-col items-center justify-center mt-8 md:ml-[-165px] space-y-4 ${className}`}
    >
      <p className="mb-2 text-[#195183] text-center">{message}</p>
      <CircularProgress />
    </div>
  );
}
