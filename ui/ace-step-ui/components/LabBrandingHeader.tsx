import React from 'react';
import { Bird } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { HEALING_MODE } from '../data/healingPresets';

interface LabBrandingHeaderProps {
  compact?: boolean;
  className?: string;
}

export const LabBrandingHeader: React.FC<LabBrandingHeaderProps> = ({
  compact = false,
  className = '',
}) => {
  const { t } = useI18n();
  const { mode } = useTheme();

  if (!HEALING_MODE) return null;

  return (
    <div
      className={`rounded-2xl border border-healing-primary/20 dark:border-tech-primary/20 bg-gradient-to-br from-healing-bg-card to-healing-bg-surface dark:from-tech-bg-card dark:to-tech-bg-surface px-4 py-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1
            className={`font-bold text-healing-text-primary dark:text-tech-text-primary tracking-wide ${
              compact ? 'text-base' : 'text-lg md:text-xl'
            }`}
          >
            夜莺 · 疗愈音乐生成
          </h1>
          {!compact && (
            <>
              <p className="text-xs md:text-sm text-healing-text-secondary dark:text-tech-text-secondary font-medium mt-0.5 leading-snug">
                上海脑舒科技 · SOOTHE
              </p>
              <p className="text-[11px] text-healing-text-muted dark:text-tech-text-muted mt-1 leading-relaxed">
                脑科学 × AI × 数字疗愈平台
              </p>
            </>
          )}
          {compact && (
            <p className="text-[11px] text-healing-text-muted dark:text-tech-text-muted mt-0.5 truncate">
              上海脑舒科技 · SOOTHE
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
