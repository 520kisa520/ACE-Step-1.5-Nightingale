import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'healing' | 'dawn' | 'tech';
  blur?: 'glass' | 'glass-strong';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  blur = 'glass'
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border backdrop-blur transition-all duration-300',
        {
          'bg-white/10 border-healing-primary/20 shadow-healing': variant === 'healing',
          'bg-white/10 border-dawn-primary/20 shadow-dawn': variant === 'dawn',
          'bg-white/10 border-tech-primary/20 shadow-tech': variant === 'tech',
          'bg-white/10 border-white/10 shadow-glass': variant === 'default',
        },
        `backdrop-blur-${blur}`,
        className
      )}
    >
      {children}
    </div>
  );
};
