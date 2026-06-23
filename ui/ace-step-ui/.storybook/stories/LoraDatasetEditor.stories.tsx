import type { Meta, StoryObj } from '@storybook/react';
import { LoraDatasetEditor } from '../components/LoraDatasetEditor';

const meta: Meta<typeof LoraDatasetEditor> = {
  title: 'Components/LoraDatasetEditor',
  component: LoraDatasetEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoraDatasetEditor>;

export const Default: Story = {
  args: {
    samples: [
      {
        id: 'sample-1',
        audioUrl: '',
        filename: 'meditation_rain.mp3',
        caption: 'Gentle rain meditation with guqin and xiao',
        emotionTags: ['peaceful', 'calm', 'serene'],
        instrumentTags: ['guqin', 'xiao', 'ambient'],
        bpm: 60,
        keyScale: 'C minor',
        timeSignature: '4/4',
        scene: 'rain',
        duration: 180,
      },
      {
        id: 'sample-2',
        audioUrl: '',
        filename: 'forest_morning.mp3',
        caption: 'Dawn in bamboo forest with birds',
        emotionTags: ['hopeful', 'gentle', 'uplifting'],
        instrumentTags: ['guzheng', 'flute', 'nature'],
        bpm: 72,
        keyScale: 'G major',
        timeSignature: '3/4',
        scene: 'forest',
        duration: 240,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    samples: [],
  },
};

export const SingleSample: Story = {
  args: {
    samples: [
      {
        id: 'sample-1',
        audioUrl: '',
        filename: 'ocean_waves.mp3',
        caption: 'Ocean waves with soft piano',
        emotionTags: ['relaxing', 'meditative', 'soothing'],
        instrumentTags: ['piano', 'ambient', 'pad'],
        bpm: 65,
        keyScale: 'D major',
        timeSignature: '4/4',
        scene: 'ocean',
        duration: 300,
      },
    ],
  },
};
