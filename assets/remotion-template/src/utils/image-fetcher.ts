/**
 * 图片获取工具
 * 支持本地图片和在线图片下载
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ImageFetchOptions {
  topic: string;
  scene: string;
  keywords: string[];
  count: number;
}

/**
 * 检查本地图片
 */
export function checkLocalImages(topicDir: string): string[] {
  const imagesDir = path.join(topicDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    return [];
  }

  const files = fs.readdirSync(imagesDir);
  return files
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => path.join(imagesDir, f));
}

/**
 * 从网上获取图片（示例实现）
 */
export async function fetchImages(options: ImageFetchOptions): Promise<string[]> {
  // 实际实现可以调用 Unsplash/Pexels API
  // 这里返回空数组，使用占位图
  console.log(`  搜索关键词: ${options.keywords.join(', ')}`);
  return [];
}

/**
 * 提取关键词
 */
export function extractKeywords(text: string): string[] {
  const keywords: string[] = [];

  const keywordMap: Record<string, string[]> = {
    '团队': ['team', 'people'],
    '技术': ['technology', 'innovation'],
    '数据': ['data', 'analytics'],
    '增长': ['growth', 'increase'],
    '突破': ['breakthrough', 'achievement'],
    '创新': ['innovation', 'creative'],
    '年度': ['annual', 'year'],
    '回顾': ['review', 'summary'],
    '校园': ['campus', 'university'],
    '直播': ['live', 'broadcast'],
  };

  for (const [cn, enList] of Object.entries(keywordMap)) {
    if (text.includes(cn)) {
      keywords.push(...enList);
    }
  }

  return [...new Set(keywords)].slice(0, 5);
}

/**
 * 生成占位图路径
 */
export function generatePlaceholder(topic: string, scene: string): string {
  // 返回一个默认图片路径
  return path.join(process.cwd(), 'public/images/placeholder.jpg');
}
