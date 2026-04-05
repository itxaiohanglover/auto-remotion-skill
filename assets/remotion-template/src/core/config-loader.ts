// 浏览器端配置加载器

import config from '../generated/config.json';
import { applepresentationStyle } from '../generated/styles/apple-presentation';
import { VideoConfig, StyleConfig } from './types';

const defaultStyle: StyleConfig = {
  name: 'default',
  colors: {
    background: ['#1a1a2e', '#16213e'],
    primary: '#FFFFFF',
    accent: '#4facfe',
    secondary: '#8892b0',
  },
  typography: {
    title: { fontFamily: 'system-ui', fontSize: 72, fontWeight: 600 },
    body: { fontFamily: 'system-ui', fontSize: 36, fontWeight: 400 },
    number: { fontFamily: 'monospace', fontSize: 48, fontWeight: 500 },
  },
  animation: {
    easing: {
      standard: [0.25, 0.1, 0.25, 1.0],
      decelerate: [0.0, 0.0, 0.2, 1],
      accelerate: [0.4, 0.0, 1, 1],
    },
    duration: { fast: 15, normal: 30, slow: 60 },
  },
  layout: {
    safeArea: { top: 60, bottom: 60, left: 80, right: 80 },
    card: { width: 380, height: 180, borderRadius: 12, gap: 40 },
  },
  imageKeywords: ['technology', 'modern', 'abstract'],
};

const styleMap: Record<string, StyleConfig> = {
  'apple-presentation': applepresentationStyle,
  'default': defaultStyle,
};

export function loadConfig(): VideoConfig {
  return config as VideoConfig;
}

export function loadStyleForBrowser(styleName: string): StyleConfig {
  return styleMap[styleName] || defaultStyle;
}
