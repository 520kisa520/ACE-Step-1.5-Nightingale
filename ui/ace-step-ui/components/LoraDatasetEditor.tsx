import React, { useState, useRef } from 'react';
import { 
  Play, Pause, Upload, Download, Plus, Trash2, Edit3, 
  Save, Music2, Hash, Sliders, ChevronDown, ChevronUp,
  FileAudio, Tag, Heart, Zap
} from 'lucide-react';

interface DatasetSample {
  id: string;
  audioUrl: string;
  filename: string;
  caption: string;
  emotionTags: string[];
  instrumentTags: string[];
  bpm: number;
  keyScale: string;
  timeSignature: string;
  scene: string;
  duration?: number;
}

interface LoraDatasetEditorProps {
  samples?: DatasetSample[];
  onSamplesChange?: (samples: DatasetSample[]) => void;
  onSave?: (samples: DatasetSample[]) => void;
}

const EMOTION_TAGS = [
  'peaceful', 'calm', 'serene', 'relaxing', 'meditative',
  'melancholic', 'nostalgic', 'hopeful', 'joyful', 'gentle',
  'mysterious', 'ethereal', 'grounding', 'uplifting', 'soothing'
];

const INSTRUMENT_TAGS = [
  'piano', 'strings', 'guitar', 'flute', 'harp', 'guqin',
  'xiao', 'guzheng', 'pipa', 'erhu', 'synth', 'pad',
  'ambient', 'nature', 'percussion', 'bells', 'wind'
];

const KEY_SCALES = [
  '', 'C major', 'C minor', 'D major', 'D minor', 'E major', 'E minor',
  'F major', 'F minor', 'G major', 'G minor', 'A major', 'A minor',
  'B major', 'B minor'
];

const TIME_SIGNATURES = ['', '4/4', '3/4', '6/8', '2/4'];

const SCENES = [
  '', 'meditation', 'sleep', 'study', 'relaxation', 'yoga',
  'spa', 'nature', 'rain', 'forest', 'ocean', 'mountain'
];

export const LoraDatasetEditor: React.FC<LoraDatasetEditorProps> = ({
  samples = [],
  onSamplesChange,
  onSave,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSample = () => {
    const newSample: DatasetSample = {
      id: `sample-${Date.now()}`,
      audioUrl: '',
      filename: '',
      caption: '',
      emotionTags: [],
      instrumentTags: [],
      bpm: 60,
      keyScale: '',
      timeSignature: '',
      scene: '',
    };
    const updated = [...samples, newSample];
    onSamplesChange?.(updated);
    setEditingId(newSample.id);
    setExpandedId(newSample.id);
  };

  const handleDeleteSample = (id: string) => {
    const updated = samples.filter(s => s.id !== id);
    onSamplesChange?.(updated);
    if (editingId === id) setEditingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const handleUpdateSample = (id: string, updates: Partial<DatasetSample>) => {
    const updated = samples.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    onSamplesChange?.(updated);
  };

  const handleToggleTag = (
    id: string, 
    tagType: 'emotionTags' | 'instrumentTags', 
    tag: string
  ) => {
    const sample = samples.find(s => s.id === id);
    if (!sample) return;

    const currentTags = sample[tagType];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    handleUpdateSample(id, { [tagType]: updatedTags });
  };

  const handleFileUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    handleUpdateSample(id, {
      audioUrl: url,
      filename: file.name,
    });
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(samples, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lora-dataset.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        onSamplesChange?.(imported);
      } catch (error) {
        console.error('Failed to import JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-healing-primary dark:text-healing-primary-light flex items-center gap-2">
          <Music2 size={16} />
          LoRA 数据集编辑
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-healing-primary/10 text-healing-primary hover:bg-healing-primary/20 transition-colors flex items-center gap-1"
          >
            <Upload size={14} />
            导入 JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-healing-primary/10 text-healing-primary hover:bg-healing-primary/20 transition-colors flex items-center gap-1"
          >
            <Download size={14} />
            导出 JSON
          </button>
          <button
            onClick={handleAddSample}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-healing-primary text-white hover:bg-healing-primary-dark transition-colors flex items-center gap-1"
          >
            <Plus size={14} />
            添加样本
          </button>
        </div>
      </div>

      {/* Samples List */}
      <div className="space-y-4">
        {samples.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-healing-primary/30 text-center">
            <Music2 className="w-12 h-12 mx-auto text-healing-primary/50 mb-4" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              暂无样本，点击上方按钮添加
            </p>
          </div>
        ) : (
          samples.map((sample) => (
            <div
              key={sample.id}
              className="p-4 rounded-2xl border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 backdrop-blur-sm transition-all duration-300"
            >
              {/* Sample Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedId(expandedId === sample.id ? null : sample.id)}
                    className="w-8 h-8 rounded-lg bg-healing-primary/10 flex items-center justify-center hover:bg-healing-primary/20 transition-colors"
                  >
                    {expandedId === sample.id ? (
                      <ChevronUp size={16} className="text-healing-primary" />
                    ) : (
                      <ChevronDown size={16} className="text-healing-primary" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-healing-text-primary">
                      {sample.filename || `样本 ${samples.indexOf(sample) + 1}`}
                    </p>
                    {sample.duration && (
                      <p className="text-xs text-zinc-500">{sample.duration}s</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(editingId === sample.id ? null : sample.id)}
                    className="p-2 rounded-lg hover:bg-healing-primary/10 transition-colors"
                  >
                    <Edit3 size={16} className="text-healing-primary" />
                  </button>
                  <button
                    onClick={() => handleDeleteSample(sample.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === sample.id && (
                <div className="space-y-4 animate-slide-up">
                  {/* Audio Upload */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-healing-primary/30 hover:border-healing-primary/50 transition-colors cursor-pointer">
                        <FileAudio size={16} className="text-healing-primary" />
                        <span className="text-xs text-zinc-500">
                          {sample.audioUrl ? sample.filename : '上传音频文件'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(sample.id, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {sample.audioUrl && (
                      <audio
                        src={sample.audioUrl}
                        controls
                        className="h-8"
                      />
                    )}
                  </div>

                  {/* Caption Input */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                      Caption 描述
                    </label>
                    <textarea
                      value={sample.caption}
                      onChange={(e) => handleUpdateSample(sample.id, { caption: e.target.value })}
                      placeholder="输入音频描述..."
                      className="w-full h-20 p-3 rounded-xl border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 text-sm text-zinc-900 dark:text-healing-text-primary placeholder-zinc-400 focus:outline-none focus:border-healing-primary resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                        <Heart size={12} />
                        情绪标签
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {EMOTION_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(sample.id, 'emotionTags', tag)}
                            className={`px-2 py-1 rounded-md text-xs transition-colors ${
                              sample.emotionTags.includes(tag)
                                ? 'bg-healing-primary/20 text-healing-primary border border-healing-primary'
                                : 'bg-white/50 dark:bg-healing-bg-card/50 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-healing-primary/30'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                        <Zap size={12} />
                        乐器标签
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {INSTRUMENT_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(sample.id, 'instrumentTags', tag)}
                            className={`px-2 py-1 rounded-md text-xs transition-colors ${
                              sample.instrumentTags.includes(tag)
                                ? 'bg-healing-primary/20 text-healing-primary border border-healing-primary'
                                : 'bg-white/50 dark:bg-healing-bg-card/50 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-healing-primary/30'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Parameters */}
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                        <Hash size={12} />
                        BPM
                      </label>
                      <input
                        type="number"
                        value={sample.bpm}
                        onChange={(e) => handleUpdateSample(sample.id, { bpm: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 text-sm text-zinc-900 dark:text-healing-text-primary focus:outline-none focus:border-healing-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                        调式
                      </label>
                      <select
                        value={sample.keyScale}
                        onChange={(e) => handleUpdateSample(sample.id, { keyScale: e.target.value })}
                        className="w-full p-2 rounded-lg border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 text-sm text-zinc-900 dark:text-healing-text-primary focus:outline-none focus:border-healing-primary"
                      >
                        {KEY_SCALES.map(key => (
                          <option key={key} value={key}>{key || 'Auto'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                        拍号
                      </label>
                      <select
                        value={sample.timeSignature}
                        onChange={(e) => handleUpdateSample(sample.id, { timeSignature: e.target.value })}
                        className="w-full p-2 rounded-lg border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 text-sm text-zinc-900 dark:text-healing-text-primary focus:outline-none focus:border-healing-primary"
                      >
                        {TIME_SIGNATURES.map(ts => (
                          <option key={ts} value={ts}>{ts || 'Auto'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                        场景
                      </label>
                      <select
                        value={sample.scene}
                        onChange={(e) => handleUpdateSample(sample.id, { scene: e.target.value })}
                        className="w-full p-2 rounded-lg border border-healing-primary/20 bg-white/50 dark:bg-healing-bg-card/50 text-sm text-zinc-900 dark:text-healing-text-primary focus:outline-none focus:border-healing-primary"
                      >
                        {SCENES.map(scene => (
                          <option key={scene} value={scene}>{scene || 'Auto'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      {samples.length > 0 && onSave && (
        <button
          onClick={() => onSave(samples)}
          className="w-full py-3 rounded-xl bg-healing-primary text-white font-medium hover:bg-healing-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          保存数据集
        </button>
      )}
    </div>
  );
};
