// 核心类型定义

export interface StyleConfig {
  name: string;
  colors: {
    background: string[];
    primary: string;
    accent: string;
    secondary: string;
    surface?: string;
    error?: string;
    success?: string;
  };
  typography: {
    title: TypographyConfig;
    subtitle?: TypographyConfig;
    body: TypographyConfig;
    caption?: TypographyConfig;
    number?: TypographyConfig;
  };
  animation: {
    easing: {
      standard: [number, number, number, number];
      decelerate: [number, number, number, number];
      accelerate: [number, number, number, number];
      elastic?: [number, number, number, number];
    };
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
  };
  layout: {
    safeArea: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    card?: {
      width: number;
      height: number;
      borderRadius: number;
      gap: number;
    };
    grid?: {
      columns: number;
      gap: number;
    };
  };
  effects?: {
    cardGlass?: React.CSSProperties;
    shadow?: string;
    blur?: number;
  };
  imageKeywords?: string[];
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface SceneConfig {
  type: string;
  duration: number;
  layout?: string;
  data?: any;
  from?: number;
  durationInFrames?: number;
}

export interface VideoConfig {
  topic: string;
  style: string;
  width: number;
  height: number;
  fps: number;
  scenes: SceneConfig[];
  durationInFrames?: number;
  audio?: {
    backgroundMusic?: string;
    volume?: number;
  };
}

export interface MetricData {
  label: string;
  value: number;
  suffix?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  labels: string[];
  values: number[];
  title?: string;
}

export interface ImageSource {
  name: string;
  url: string;
  author?: string;
  source: 'unsplash' | 'pexels' | 'pixabay' | 'local';
}

export interface ParsedContent {
  title: string;
  paragraphs: string[];
  metrics: MetricData[];
  keywords: string[];
}
