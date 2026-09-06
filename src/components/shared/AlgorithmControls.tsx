import { Play, Pause, SkipForward, SkipBack, RotateCcw, Gauge } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AlgorithmControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
}

export function AlgorithmControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
}: AlgorithmControlsProps) {
  const { theme } = useTheme();

  const btnBase = `rounded-lg p-2.5 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 ${
    theme === 'dark'
      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button onClick={onRestart} className={btnBase} title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={onPrev} className={btnBase} disabled={currentStep === 0} title="Previous Step">
          <SkipBack className="w-4 h-4" />
        </button>
        {isPlaying ? (
          <button onClick={onPause} className={`rounded-lg p-2.5 transition-all hover:scale-105 ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`} title="Pause">
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onPlay} className={`rounded-lg p-2.5 transition-all hover:scale-105 ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`} title="Play">
            <Play className="w-4 h-4" />
          </button>
        )}
        <button onClick={onNext} className={btnBase} disabled={currentStep >= totalSteps - 1} title="Next Step">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Gauge className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className={`text-xs font-mono w-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {speed}x
        </span>
      </div>

      <div className={`text-xs font-mono ml-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Step {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
}
