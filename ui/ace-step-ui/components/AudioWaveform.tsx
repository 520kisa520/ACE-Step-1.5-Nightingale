import React, { useRef, useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';

interface AudioWaveformProps {
  audioUrl?: string;
  isPlaying?: boolean;
  className?: string;
  color?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  isPlaying = false,
  className,
  color = '#7C3AED'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const initAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
        
        // Create visualizer
        const source = audioContext!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser!);
        analyser!.connect(audioContext!.destination);
        source.start(0);
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    };

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

    setAudioContext(ctx);
    setAnalyser(analyserNode);
    setDataArray(dataArray);
    dataArrayRef.current = dataArray;

    initAudio();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      ctx.close();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!canvasRef.current || !analyser || !dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray as any);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / (dataArray as any).length) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < (dataArray as any).length; i++) {
        barHeight = ((dataArray as any)[i] / 255) * canvas.height;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}33`);

        ctx.fillStyle = gradient;
        
        // Draw rounded bars
        const radius = barWidth / 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, [radius, radius, 0, 0]);
        } else {
          ctx.rect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, dataArray, color, isPlaying]);

  // Fallback visualization when no audio
  const drawFallback = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barCount = 32;
    const barWidth = canvas.width / barCount - 2;

    for (let i = 0; i < barCount; i++) {
      const height = isPlaying 
        ? Math.random() * canvas.height * 0.8 
        : canvas.height * 0.2;
      
      const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}33`);

      ctx.fillStyle = gradient;
      const radius = barWidth / 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(i * (barWidth + 2), canvas.height - height, barWidth, height, [radius, radius, 0, 0]);
      } else {
        ctx.rect(i * (barWidth + 2), canvas.height - height, barWidth, height);
      }
      ctx.fill();
    }
  };

  useEffect(() => {
    if (!audioUrl) {
      const interval = setInterval(drawFallback, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, audioUrl, color]);

  return (
    <GlassCard variant="healing" className={className}>
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={80}
          className="w-full h-20"
        />
      </div>
    </GlassCard>
  );
};
