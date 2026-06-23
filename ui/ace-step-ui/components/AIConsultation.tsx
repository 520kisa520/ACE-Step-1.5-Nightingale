import React, { useState } from 'react';
import { Sparkles, Heart, Brain, Moon, Sun, Activity, MessageSquare, Send } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface AIConsultationProps {
  onConsultationResult?: (result: {
    prompt: string;
    style: string;
    mood: string;
    recommendations: string[];
  }) => void;
  className?: string;
}

const MOOD_OPTIONS = [
  { icon: <Moon size={16} />, label: '焦虑不安', value: 'anxious' },
  { icon: <Sun size={16} />, label: '疲惫倦怠', value: 'tired' },
  { icon: <Heart size={16} />, label: '情绪低落', value: 'sad' },
  { icon: <Activity size={16} />, label: '压力过大', value: 'stressed' },
  { icon: <Brain size={16} />, label: '注意力分散', value: 'distracted' },
  { icon: <Sparkles size={16} />, label: '需要灵感', value: 'inspired' },
];

export const AIConsultation: React.FC<AIConsultationProps> = ({
  onConsultationResult,
  className
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!selectedMood || !description.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisResult = {
      prompt: generatePrompt(selectedMood, description),
      style: generateStyle(selectedMood),
      mood: selectedMood,
      recommendations: generateRecommendations(selectedMood)
    };

    setResult(analysisResult);
    onConsultationResult?.(analysisResult);
    setIsAnalyzing(false);
  };

  const generatePrompt = (mood: string, desc: string): string => {
    const moodPrompts: Record<string, string> = {
      anxious: 'Calming meditation music, slow tempo, ambient pads, peaceful atmosphere, anxiety relief, no vocals',
      tired: 'Gentle awakening music, soft energy, uplifting melody, ambient textures, revitalizing, no vocals',
      sad: 'Warm comforting music, gentle melody, hopeful atmosphere, emotional support, no vocals',
      stressed: 'Deep relaxation music, stress relief, peaceful atmosphere, calming rhythms, no vocals',
      distracted: 'Focus-enhancing music, steady rhythm, ambient textures, concentration aid, no vocals',
      inspired: 'Creative inspiration music, uplifting melody, ethereal atmosphere, artistic support, no vocals'
    };
    return `${moodPrompts[mood] || 'peaceful ambient music, no vocals'}, based on: ${desc}`;
  };

  const generateStyle = (mood: string): string => {
    const styles: Record<string, string> = {
      anxious: 'ambient, meditation, calm, peaceful',
      tired: 'gentle, uplifting, ambient, revitalizing',
      sad: 'warm, comforting, gentle, hopeful',
      stressed: 'relaxation, spa, peaceful, calming',
      distracted: 'focus, ambient, steady, concentration',
      inspired: 'uplifting, ethereal, creative, artistic'
    };
    return styles[mood] || 'ambient, peaceful';
  };

  const generateRecommendations = (mood: string): string[] => {
    const recommendations: Record<string, string[]> = {
      anxious: ['建议时长：15-20分钟', '配合深呼吸练习', '选择安静环境聆听'],
      tired: ['建议时长：10-15分钟', '适合晨间或午后', '可配合轻度伸展'],
      sad: ['建议时长：20-30分钟', '允许情绪自然流动', '无需强求积极状态'],
      stressed: ['建议时长：15-25分钟', '睡前聆听效果更佳', '可配合冥想'],
      distracted: ['建议时长：25-30分钟', '工作或学习时聆听', '保持环境安静'],
      inspired: ['建议时长：不限', '创作或思考时聆听', '开放心态接收灵感']
    };
    return recommendations[mood] || ['建议时长：15-20分钟', '选择舒适环境聆听'];
  };

  return (
    <GlassCard variant="tech" className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-tech-primary" />
          <h3 className="text-sm font-semibold text-tech-text-primary">
            AI 问诊
          </h3>
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <label className="text-xs font-medium text-tech-text-secondary mb-2 block">
            当前身心状态
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-200 ${
                  selectedMood === option.value
                    ? 'bg-tech-primary text-white border-tech-primary'
                    : 'bg-tech-bg-surface text-tech-text-secondary hover:bg-tech-bg-hover border border-tech-primary/20'
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="text-xs font-medium text-tech-text-secondary mb-2 block">
            详细描述你的感受
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述你当前的身体感受、情绪状态、或者你希望音乐帮助你实现什么..."
            className="w-full h-24 bg-tech-bg-surface border border-tech-primary/20 rounded-lg p-3 text-sm text-tech-text-primary placeholder-tech-text-muted focus:outline-none focus:border-tech-primary resize-none transition-colors"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedMood || !description.trim() || isAnalyzing}
          className="w-full py-3 rounded-xl bg-tech-primary text-white font-medium hover:bg-tech-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Sparkles size={18} className="animate-pulse" />
              分析中...
            </>
          ) : (
            <>
              <Send size={18} />
              生成疗愈方案
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-tech-bg-surface border border-tech-primary/20 animate-slide-up">
            <h4 className="text-sm font-semibold text-tech-text-primary mb-2">
              疗愈方案
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-tech-text-muted">推荐风格：</span>
                <p className="text-sm text-tech-text-secondary">{result.style}</p>
              </div>
              <div>
                <span className="text-xs text-tech-text-muted">生成提示词：</span>
                <p className="text-sm text-tech-text-secondary">{result.prompt}</p>
              </div>
              <div>
                <span className="text-xs text-tech-text-muted">聆听建议：</span>
                <ul className="text-sm text-tech-text-secondary list-disc list-inside">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
