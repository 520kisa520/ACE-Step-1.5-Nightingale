import React, { useState } from 'react';
import { Droplets, Wind, TreePine, Waves, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface EnvironmentSound {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  defaultVolume: number;
}

const ENVIRONMENT_SOUNDS: EnvironmentSound[] = [
  {
    id: 'rain',
    name: '雨声',
    icon: Droplets,
    color: 'from-blue-400/20 to-cyan-400/20',
    defaultVolume: 0.3,
  },
  {
    id: 'wind',
    name: '风声',
    icon: Wind,
    color: 'from-slate-400/20 to-gray-400/20',
    defaultVolume: 0.2,
  },
  {
    id: 'forest',
    name: '森林',
    icon: TreePine,
    color: 'from-green-400/20 to-emerald-400/20',
    defaultVolume: 0.25,
  },
  {
    id: 'ocean',
    name: '海浪',
    icon: Waves,
    color: 'from-cyan-400/20 to-teal-400/20',
    defaultVolume: 0.4,
  },
];

interface EnvironmentSoundPanelProps {
  onSoundMixChange?: (sounds: Record<string, number>) => void;
}

export const EnvironmentSoundPanel: React.FC<EnvironmentSoundPanelProps> = ({
  onSoundMixChange,
}) => {
  const [soundVolumes, setSoundVolumes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ENVIRONMENT_SOUNDS.forEach(sound => {
      initial[sound.id] = 0; // Start muted
    });
    return initial;
  });

  const [masterVolume, setMasterVolume] = useState(0.5);

  const handleVolumeChange = (soundId: string, volume: number) => {
    setSoundVolumes(prev => {
      const updated = { ...prev, [soundId]: volume };
      onSoundMixChange?.(updated);
      return updated;
    });
  };

  const handleReset = () => {
    const reset: Record<string, number> = {};
    ENVIRONMENT_SOUNDS.forEach(sound => {
      reset[sound.id] = 0;
    });
    setSoundVolumes(reset);
    setMasterVolume(0.5);
    onSoundMixChange?.(reset);
  };

  const getActiveSounds = () => {
    return ENVIRONMENT_SOUNDS.filter(sound => soundVolumes[sound.id] > 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-healing-primary dark:text-healing-primary-light flex items-center gap-2">
          <Volume2 size={16} />
          自然环境音
        </h3>
        <button
          onClick={handleReset}
          className="text-xs text-zinc-500 hover:text-healing-primary transition-colors flex items-center gap-1"
        >
          <RotateCcw size={12} />
          重置
        </button>
      </div>

      {/* Sound Controls */}
      <div className="grid grid-cols-2 gap-4">
        {ENVIRONMENT_SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const volume = soundVolumes[sound.id];
          const isActive = volume > 0;

          return (
            <div
              key={sound.id}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-300
                bg-gradient-to-br ${sound.color}
                ${isActive ? 'border-healing-primary shadow-healing' : 'border-transparent hover:border-healing-primary/30'}
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-healing-primary/20' : 'bg-white/50 dark:bg-healing-bg-card/50'}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-healing-primary' : 'text-zinc-400'}`} />
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {sound.name}
                </span>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>音量</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                  className="w-full h-2 bg-white/50 dark:bg-healing-bg-card/50 rounded-full appearance-none cursor-pointer accent-healing-primary"
                />
              </div>

              {/* Mute Toggle */}
              <button
                onClick={() => handleVolumeChange(sound.id, volume > 0 ? 0 : sound.defaultVolume)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/50 dark:bg-healing-bg-card/50 flex items-center justify-center hover:bg-white dark:hover:bg-healing-bg-card transition-colors"
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 text-healing-primary" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Master Volume */}
      <div className="p-4 rounded-2xl border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">总音量</span>
          <span className="text-xs text-zinc-500">{Math.round(masterVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          className="w-full h-2 bg-white/50 dark:bg-healing-bg-card/50 rounded-full appearance-none cursor-pointer accent-healing-primary"
        />
      </div>

      {/* Active Sounds Summary */}
      {getActiveSounds().length > 0 && (
        <div className="p-3 rounded-xl bg-healing-primary/10 border border-healing-primary/20">
          <p className="text-xs text-healing-primary">
            当前混合: {getActiveSounds().map(s => s.name).join(' + ')}
          </p>
        </div>
      )}
    </div>
  );
};
