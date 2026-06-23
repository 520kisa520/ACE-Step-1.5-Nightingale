import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Zap, Sliders } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface TrainingParams {
  learningRate: number;
  batchSize: number;
  epochs: number;
  warmupSteps: number;
  loraRank: number;
  loraAlpha: number;
  targetModules: string[];
}

interface LoRATrainingPanelProps {
  params?: TrainingParams;
  onParamsChange?: (params: TrainingParams) => void;
  onTrain?: () => void;
  isTraining?: boolean;
}

const DEFAULT_PARAMS: TrainingParams = {
  learningRate: 0.0001,
  batchSize: 4,
  epochs: 10,
  warmupSteps: 100,
  loraRank: 16,
  loraAlpha: 32,
  targetModules: ['attention', 'mlp'],
};

export const LoRATrainingPanel: React.FC<LoRATrainingPanelProps> = ({
  params = DEFAULT_PARAMS,
  onParamsChange,
  onTrain,
  isTraining = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localParams, setLocalParams] = useState<TrainingParams>(params);

  const handleParamChange = (key: keyof TrainingParams, value: any) => {
    const updated = { ...localParams, [key]: value };
    setLocalParams(updated);
    onParamsChange?.(updated);
  };

  const handleToggleModule = (module: string) => {
    const updated = localParams.targetModules.includes(module)
      ? localParams.targetModules.filter(m => m !== module)
      : [...localParams.targetModules, module];
    handleParamChange('targetModules', updated);
  };

  return (
    <GlassCard variant="tech" className="animate-fade-in">
      <div className="p-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-tech-primary" />
            <h3 className="text-sm font-bold text-tech-primary">
              LoRA 训练参数
            </h3>
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-tech-text-muted" /> : <ChevronDown size={16} className="text-tech-text-muted" />}
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-4 animate-slide-up">
            {/* Learning Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-tech-text-secondary">学习率</label>
                <span className="text-xs text-tech-primary">{localParams.learningRate}</span>
              </div>
              <input
                type="range"
                min="0.00001"
                max="0.001"
                step="0.00001"
                value={localParams.learningRate}
                onChange={(e) => handleParamChange('learningRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-tech-bg-surface rounded-lg appearance-none cursor-pointer accent-tech-primary"
              />
            </div>

            {/* Batch Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-tech-text-secondary">批次大小</label>
                <span className="text-xs text-tech-primary">{localParams.batchSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={localParams.batchSize}
                onChange={(e) => handleParamChange('batchSize', parseInt(e.target.value))}
                className="w-full h-2 bg-tech-bg-surface rounded-lg appearance-none cursor-pointer accent-tech-primary"
              />
            </div>

            {/* Epochs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-tech-text-secondary">训练轮数</label>
                <span className="text-xs text-tech-primary">{localParams.epochs}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={localParams.epochs}
                onChange={(e) => handleParamChange('epochs', parseInt(e.target.value))}
                className="w-full h-2 bg-tech-bg-surface rounded-lg appearance-none cursor-pointer accent-tech-primary"
              />
            </div>

            {/* LoRA Rank */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-tech-text-secondary">LoRA Rank</label>
                <span className="text-xs text-tech-primary">{localParams.loraRank}</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={localParams.loraRank}
                onChange={(e) => handleParamChange('loraRank', parseInt(e.target.value))}
                className="w-full h-2 bg-tech-bg-surface rounded-lg appearance-none cursor-pointer accent-tech-primary"
              />
            </div>

            {/* LoRA Alpha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-tech-text-secondary">LoRA Alpha</label>
                <span className="text-xs text-tech-primary">{localParams.loraAlpha}</span>
              </div>
              <input
                type="range"
                min="8"
                max="128"
                step="8"
                value={localParams.loraAlpha}
                onChange={(e) => handleParamChange('loraAlpha', parseInt(e.target.value))}
                className="w-full h-2 bg-tech-bg-surface rounded-lg appearance-none cursor-pointer accent-tech-primary"
              />
            </div>

            {/* Target Modules */}
            <div>
              <label className="text-xs font-medium text-tech-text-secondary mb-2 block">
                目标模块
              </label>
              <div className="flex flex-wrap gap-2">
                {['attention', 'mlp', 'output'].map((module) => (
                  <button
                    key={module}
                    onClick={() => handleToggleModule(module)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      localParams.targetModules.includes(module)
                        ? 'bg-tech-primary text-white'
                        : 'bg-tech-bg-surface text-tech-text-secondary hover:bg-tech-bg-hover'
                    }`}
                  >
                    {module}
                  </button>
                ))}
              </div>
            </div>

            {/* Train Button */}
            {onTrain && (
              <button
                onClick={onTrain}
                disabled={isTraining}
                className="w-full py-3 rounded-xl bg-tech-primary text-white font-medium hover:bg-tech-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTraining ? (
                  <>
                    <Zap size={18} className="animate-pulse" />
                    训练中...
                  </>
                ) : (
                  <>
                    <Sliders size={18} />
                    开始训练
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
