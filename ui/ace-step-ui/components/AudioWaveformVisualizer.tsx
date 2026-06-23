import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  height?: number;
  barCount?: number;
  color?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  audioUrl,
  isPlaying = false,
  onPlayPause,
  height = 60,
  barCount = 64,
  color = '#5C8A7A',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const initAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!isInitialized || !canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const gap = 2;
      const actualBarWidth = barWidth - gap;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (bufferLength / barCount));
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * canvas.height;

        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}40`);

        ctx.fillStyle = gradient;
        
        // Draw rounded top bars
        ctx.beginPath();
        ctx.roundRect(x, y, actualBarWidth, barHeight, 4);
        ctx.fill();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, barCount, color, isPlaying]);

  // Simulated waveform for demo when no audio
  useEffect(() => {
    if (!audioUrl || !canvasRef.current || isInitialized) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const drawSimulated = () => {
      animationRef.current = requestAnimationFrame(drawSimulated);
      time += 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const gap = 2;
      const actualBarWidth = barWidth - gap;

      for (let i = 0; i < barCount; i++) {
        // Create gentle wave pattern
        const wave1 = Math.sin(i * 0.1 + time) * 0.5 + 0.5;
        const wave2 = Math.sin(i * 0.2 + time * 1.5) * 0.3 + 0.3;
        const wave3 = Math.sin(i * 0.05 + time * 0.5) * 0.2 + 0.2;
        
        const combinedWave = (wave1 + wave2 + wave3) / 3;
        const barHeight = combinedWave * canvas.height * 0.8;

        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}40`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, actualBarWidth, barHeight, 4);
        ctx.fill();
      }
    };

    drawSimulated();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, isInitialized, barCount, color]);

  return (
    <div className="relative w-full bg-white/50 dark:bg-healing-bg-card/50 backdrop-blur-sm rounded-2xl border border-healing-primary/20 overflow-hidden">
      <canvas
        ref={canvasRef}
        height={height}
        className="w-full"
        style={{ imageRendering: 'auto' }}
      />
      {onPlayPause && (
        <button
          onClick={onPlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-healing-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </div>
        </button>
      )}
    </div>
  );
};
