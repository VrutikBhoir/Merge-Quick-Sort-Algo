import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStepAnimationOptions {
  totalSteps: number;
  speed: number; // steps per second multiplier
  onComplete?: () => void;
}

export function useStepAnimation({ totalSteps, speed, onComplete }: UseStepAnimationOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
      onCompleteRef.current?.();
      return;
    }

    const delay = 1000 / speed;
    timerRef.current = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, delay);

    return clearTimer;
  }, [isPlaying, currentStep, totalSteps, speed]);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const next = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);
  const prev = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);
  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);
  const goTo = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    next,
    prev,
    restart,
    goTo,
  };
}
