import React from 'react';
import { Leaf } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
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

  if (!HEALING_MODE) return null;

  return (
    <div
      className={`rounded-2xl border border-[#e2ddd4] dark:border-white/10 bg-gradient-to-br from-[#faf8f5] to-[#f0ebe3] dark:from-zinc-900/80 dark:to-zinc-800/60 px-4 py-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A9E8E] to-[#5C7A6E] flex items-center justify-center flex-shrink-0 shadow-sm"
          aria-hidden
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1
            className={`font-semibold text-[#3D4540] dark:text-white tracking-wide ${
              compact ? 'text-sm' : 'text-base md:text-lg'
            }`}
          >
            {t('brandProductName')} · {t('create')}
          </h1>
          {!compact && (
            <>
              <p className="text-xs md:text-sm text-[#5C7A6E] dark:text-[#B8CFC4] font-medium mt-0.5 leading-snug">
                {t('labFullName')}
              </p>
              <p className="text-[11px] text-[#8A9490] dark:text-zinc-400 mt-1 leading-relaxed">
                {t('labTagline')}
              </p>
            </>
          )}
          {compact && (
            <p className="text-[11px] text-[#8A9490] dark:text-zinc-400 mt-0.5 truncate">
              {t('labShortName')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
