import {Config} from '@remotion/cli/config';

export const config: Config = {
  // 视频输出配置
  outputCodec: 'h264',
  outputPixelFormat: 'yuv420p',

  // 预览配置
  previewServerPort: 3000,

  // 渲染配置
  overrideWebpackConfig: (config) => config,

  // 图片配置
  webpackOverride: (config) => config,
};

export default config;
