import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { HEALING_MODE } from '../data/healingPresets';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => Promise<void>;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onSubmit }) => {
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError(t('usernameMinLength'));
      return;
    }

    if (!/^[\p{L}\p{N}_-]+$/u.test(trimmed)) {
      setError(t('usernameInvalidChars'));
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedToSetUsername'));
    } finally {
      setIsLoading(false);
    }
  };

  const accentBar = HEALING_MODE
    ? 'bg-gradient-to-r from-[#B8CFC4] via-[#7A9E8E] to-[#5C7A6E]'
    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500';

  const logoBg = HEALING_MODE
    ? 'bg-gradient-to-br from-[#7A9E8E] to-[#5C7A6E]'
    : 'bg-gradient-to-br from-pink-500 to-purple-600';

  const btnClass = HEALING_MODE
    ? 'bg-gradient-to-r from-[#7A9E8E] to-[#5C7A6E] hover:from-[#6a8f7f] hover:to-[#4d6b5f]'
    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700';

  const inputFocus = HEALING_MODE ? 'focus:ring-[#7A9E8E]' : 'focus:ring-pink-500';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className={`h-2 ${accentBar}`} />

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full ${logoBg} flex items-center justify-center shadow-lg`}>
              {HEALING_MODE ? (
                <Leaf className="w-8 h-8 text-white" />
              ) : (
                <span className="text-2xl">🎵</span>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-white mb-1">
            {t('welcomeTitle')}
          </h2>
          <p className="text-zinc-400 text-center text-sm mb-6 leading-snug px-2">
            {t('welcomeSubtitle')}
          </p>
          {HEALING_MODE && (
            <p className="text-zinc-500 text-center text-xs -mt-4 mb-6 leading-relaxed">
              {t('labTagline')}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                {t('yourName')}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('enterYourName')}
                className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${inputFocus} focus:border-transparent transition-all`}
                autoFocus
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className={`w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}
            >
              {isLoading ? t('gettingStarted') : t('getStarted')}
            </button>
          </form>

          <p className="mt-6 text-xs text-zinc-500 text-center leading-relaxed">
            {t('yourMusicYourWay')}
          </p>
        </div>
      </div>
    </div>
  );
};
