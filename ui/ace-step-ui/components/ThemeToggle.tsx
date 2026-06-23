import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { variant, mode, setVariant, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-tech-bg-surface hover:bg-tech-bg-hover transition-colors text-tech-text-primary"
        title={mode === 'dark' ? '切换到浅色' : '切换到深色'}
      >
        {mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Variant Selector */}
      <div className="flex items-center gap-1">
        <Palette size={18} className="text-tech-text-muted" />
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as any)}
          className="bg-tech-bg-surface text-tech-text-primary text-sm rounded-lg px-2 py-1 border border-tech-primary/20 focus:outline-none focus:border-tech-primary"
        >
          <option value="healing">治愈</option>
          <option value="dawn">晨曦</option>
          <option value="tech">科技</option>
        </select>
      </div>
    </div>
  );
};
