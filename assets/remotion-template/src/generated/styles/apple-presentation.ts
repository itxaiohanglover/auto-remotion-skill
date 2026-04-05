// Apple 风格配置
import { StyleConfig } from '../../core/types';

export const applepresentationStyle: StyleConfig = {
  name: 'apple-presentation',
  colors: {
    background: ["#1a1a2e","#000000"],
    primary: '#FFFFFF',
    accent: '#007AFF',
    secondary: '#8892b0',
  },
  typography: {
    title: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 72,
      fontWeight: 600,
    },
    body: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 36,
      fontWeight: 400,
    },
    number: {
      fontFamily: 'SF Mono, monospace',
      fontSize: 48,
      fontWeight: 500,
    },
  },
  animation: {
    easing: {
      standard: [0.25, 0.1, 0.25, 1.0],
      decelerate: [0.0, 0.0, 0.2, 1],
      accelerate: [0.4, 0.0, 1, 1],
    },
    duration: {
      fast: 15,
      normal: 30,
      slow: 60,
    },
  },
  layout: {
    safeArea: {
      top: 60,
      bottom: 60,
      left: 80,
      right: 80,
    },
    card: {
      width: 380,
      height: 180,
      borderRadius: 12,
      gap: 40,
    },
  },
  imageKeywords: ['technology', 'modern', 'abstract', 'minimalist'],
};

export default applepresentationStyle;
