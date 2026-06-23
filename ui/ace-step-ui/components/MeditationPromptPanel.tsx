import React, { useState } from 'react';
import { Sparkles, Wind, Droplets, Leaf, Moon, Sun, Coffee, ChevronDown } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface MeditationPromptPanelProps {
  onPromptSelect: (prompt: string) => void;
  currentPrompt?: string;
}

const MEDITATION_SCENES = [
  {
    id: 'rain',
    name: '雨夜冥想',
    icon: Droplets,
    prompt: 'Gentle rain falling on leaves, slow tempo meditation music with guqin and xiao, peaceful and calming atmosphere for deep relaxation and sleep',
    color: 'from-blue-400/20 to-cyan-400/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'forest',
    name: '森林晨曦',
    icon: Leaf,
    prompt: 'Dawn in the bamboo forest, soft ambient music with traditional Chinese instruments, birds chirping in the distance, peaceful morning meditation',
    color: 'from-green-400/20 to-emerald-400/20',
    iconColor: 'text-green-400',
  },
  {
    id: 'ocean',
    name: '海浪轻抚',
    icon: Wind,
    prompt: 'Ocean waves gently lapping on the shore, ambient meditation music with soft piano and natural sounds, calming and serene',
    color: 'from-cyan-400/20 to-teal-400/20',
    iconColor: 'text-cyan-400',
  },
  {
    id: 'night',
    name: '月夜入眠',
    icon: Moon,
    prompt: 'Moonlit night meditation, slow tempo healing music with gentle strings and ambient pads, designed for deep sleep and relaxation',
    color: 'from-purple-400/20 to-indigo-400/20',
    iconColor: 'text-purple-400',
  },
  {
    id: 'morning',
    name: '晨间唤醒',
    icon: Sun,
    prompt: 'Gentle morning awakening, soft uplifting music with light percussion and natural sounds, peaceful start to the day',
    color: 'from-amber-400/20 to-orange-400/20',
    iconColor: 'text-amber-400',
  },
  {
    id: 'tea',
    name: '茶香静谧',
    icon: Coffee,
    prompt: 'Quiet tea ceremony atmosphere, traditional Chinese instrumental music with guzheng and pipa, peaceful and contemplative',
    color: 'from-rose-400/20 to-pink-400/20',
    iconColor: 'text-rose-400',
  },
];

const HEALING_TAGS = [
  'meditation',
  'ambient',
  'healing',
  'peaceful',
  'relaxing',
  'calm',
  'serene',
  'sleep aid',
  'stress relief',
  'mindfulness',
  'tranquil',
  'soothing',
  'gentle',
];

export const MeditationPromptPanel: React.FC<MeditationPromptPanelProps> = ({
  onPromptSelect,
  currentPrompt,
}) => {
  const { t } = useI18n();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState(currentPrompt || '');

  const handleSceneSelect = (scene: typeof MEDITATION_SCENES[0]) => {
    setCustomPrompt(scene.prompt);
    onPromptSelect(scene.prompt);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      const promptWithTags = newTags.length > 0
        ? `${customPrompt}, ${newTags.join(', ')}`
        : customPrompt;
      
      onPromptSelect(promptWithTags);
      return newTags;
    });
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    onPromptSelect(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scene Selection */}
      <div>
        <h3 className="text-sm font-bold text-healing-primary dark:text-healing-primary-light mb-4 flex items-center gap-2">
          <Sparkles size={16} />
          冥想场景
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MEDITATION_SCENES.map((scene) => {
            const Icon = scene.icon;
            const isSelected = customPrompt === scene.prompt;
            return (
              <button
                key={scene.id}
                onClick={() => handleSceneSelect(scene)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-300
                  bg-gradient-to-br ${scene.color}
                  hover:scale-105 hover:shadow-lg
                  ${isSelected
                    ? 'border-healing-primary shadow-healing-strong'
                    : 'border-transparent hover:border-healing-primary/30'
                  }
                `}
              >
                <Icon className={`w-8 h-8 ${scene.iconColor} mb-2`} />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {scene.name}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-healing-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Healing Tags */}
      <div>
        <h3 className="text-sm font-bold text-healing-primary dark:text-healing-primary-light mb-4 flex items-center gap-2">
          <Leaf size={16} />
          疗愈标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {HEALING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                ${selectedTags.includes(tag)
                  ? 'bg-healing-primary/20 border-healing-primary text-healing-primary'
                  : 'bg-white dark:bg-healing-bg-card border-zinc-200 dark:border-healing-primary/20 text-zinc-600 dark:text-zinc-400 hover:border-healing-primary/50'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <h3 className="text-sm font-bold text-healing-primary dark:text-healing-primary-light mb-4 flex items-center gap-2">
          <Wind size={16} />
          自定义描述
        </h3>
        <textarea
          value={customPrompt}
          onChange={(e) => handleCustomPromptChange(e.target.value)}
          placeholder="描述您想要的冥想音乐场景..."
          className="w-full h-32 p-4 rounded-2xl border-2 border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 backdrop-blur-sm text-sm text-zinc-900 dark:text-healing-text-primary placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-healing-primary focus:ring-2 focus:ring-healing-primary/20 transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );
};
