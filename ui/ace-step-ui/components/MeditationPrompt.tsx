import React, { useState } from 'react';
import { Sparkles, Wind, Moon, Sun, Droplets, Music2 } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface MeditationPromptProps {
  onPromptChange: (prompt: string) => void;
  className?: string;
}

const MEDITATION_TEMPLATES = [
  {
    icon: <Moon size={16} />,
    label: '深度冥想',
    prompt: 'Deep meditation music, slow tempo, ambient pads, minimal percussion, peaceful atmosphere, no vocals',
  },
  {
    icon: <Wind size={16} />,
    label: '呼吸练习',
    prompt: 'Breathing exercise music, gentle rhythm, flowing melody, calming atmosphere, soft ambient textures',
  },
  {
    icon: <Sun size={16} />,
    label: '晨间唤醒',
    prompt: 'Morning awakening music, gentle energy, uplifting melody, soft piano, ambient textures',
  },
  {
    icon: <Droplets size={16} />,
    label: '自然之声',
    prompt: 'Nature sounds meditation, water elements, forest ambience, gentle rain, peaceful atmosphere',
  },
  {
    icon: <Music2 size={16} />,
    label: '瑜伽伴奏',
    prompt: 'Yoga background music, steady rhythm, flowing melody, ambient textures, peaceful atmosphere',
  },
];

export const MeditationPrompt: React.FC<MeditationPromptProps> = ({
  onPromptChange,
  className
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (template: typeof MEDITATION_TEMPLATES[0]) => {
    setSelectedTemplate(template.label);
    setCustomPrompt(template.prompt);
    onPromptChange(template.prompt);
  };

  const handleCustomChange = (value: string) => {
    setCustomPrompt(value);
    setSelectedTemplate(null);
    onPromptChange(value);
  };

  return (
    <GlassCard variant="healing" className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-healing-primary" />
          <h3 className="text-sm font-semibold text-healing-text-primary">
            冥想轻音乐提示词
          </h3>
        </div>

        {/* Template Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {MEDITATION_TEMPLATES.map((template) => (
            <button
              key={template.label}
              onClick={() => handleTemplateSelect(template)}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-200 ${
                selectedTemplate === template.label
                  ? 'bg-healing-primary/20 border-healing-primary/50 text-healing-primary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-healing-text-secondary'
              } border`}
            >
              {template.icon}
              <span>{template.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Prompt Input */}
        <textarea
          value={customPrompt}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="自定义冥想音乐提示词..."
          className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-healing-text-primary placeholder-healing-text-muted focus:outline-none focus:border-healing-primary/50 resize-none transition-colors"
        />

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['ambient', 'peaceful', 'slow', 'minimal', 'no vocals'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleCustomChange(customPrompt ? `${customPrompt}, ${tag}` : tag)}
              className="text-[10px] px-2 py-1 rounded-full bg-healing-primary/10 text-healing-primary hover:bg-healing-primary/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
