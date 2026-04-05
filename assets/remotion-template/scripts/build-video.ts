#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { parseTextContent, generateVideoData, ParsedContent } from '../src/utils/text-parser';
import { checkLocalImages } from '../src/utils/image-fetcher';

const topic = process.argv[2];

if (!topic) {
  console.error('❌ 请指定主题名');
  console.error('用法: npm run build:video <topic>');
  console.error('示例: npm run build:video annual-review');
  process.exit(1);
}

interface VideoConfig {
  topic: string;
  style: string;
  width: number;
  height: number;
  fps: number;
  scenes: Array<{
    type: string;
    duration: number;
    from?: number;
    durationInFrames?: number;
  }>;
}

/**
 * 准备素材
 */
function prepareAssets(topicName: string): { textContent: string; images: string[] } {
  const topicDir = path.join(process.cwd(), 'topics', topicName);

  // 读取文本内容
  const contentPath = path.join(topicDir, 'content.txt');
  let textContent = '';
  if (fs.existsSync(contentPath)) {
    textContent = fs.readFileSync(contentPath, 'utf-8');
  }

  // 检查本地图片
  const images = checkLocalImages(topicDir);

  return { textContent, images };
}

/**
 * 构建视频配置
 */
function buildVideoConfig(topicName: string): VideoConfig {
  // 读取 keywords.json 配置
  const keywordsPath = path.join(process.cwd(), 'topics', topicName, 'keywords.json');
  let customConfig: any = {};

  if (fs.existsSync(keywordsPath)) {
    customConfig = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'));
  }

  return {
    topic: topicName,
    style: customConfig.style || 'apple-presentation',
    width: 1920,
    height: 1080,
    fps: 30,
    scenes: customConfig.scenes || [
      { type: 'intro', duration: 4 },
      { type: 'data-dashboard', duration: 8 },
      { type: 'outro', duration: 4 },
    ],
  };
}

async function main() {
  console.log(`🎬 开始生成视频: ${topic}\n`);

  // Step 1: 准备素材
  console.log('[1/4] 📦 准备素材...');
  const { textContent, images: localImages } = prepareAssets(topic);

  if (textContent.length === 0) {
    console.error(`❌ 未找到文本内容: topics/${topic}/content.txt`);
    console.error('请创建该文件并写入视频文案');
    process.exit(1);
  }

  console.log(`   ✓ 文本内容: ${textContent.length} 字符`);
  console.log(`   ✓ 本地图片: ${localImages.length} 张`);

  // Step 2: 解析文本内容
  console.log('\n[2/4] 🔍 解析文本...');
  const parsedContent = parseTextContent(textContent);
  console.log(`   ✓ 标题: ${parsedContent.title}`);
  console.log(`   ✓ 段落: ${parsedContent.paragraphs.length} 个`);
  console.log(`   ✓ 数据指标: ${parsedContent.metrics.length} 个`);
  parsedContent.metrics.forEach((m, i) => {
    console.log(`      ${i + 1}. ${m.label}: ${m.value}${m.suffix}`);
  });

  // Step 3: 复制图片到 public
  console.log('\n[3/4] 🖼️  处理图片...');
  const publicDir = path.join(process.cwd(), 'public/images/uploaded', topic);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  localImages.forEach((imgPath, i) => {
    const dest = path.join(publicDir, `image-${i}.jpg`);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(imgPath, dest);
    }
  });
  console.log(`   ✓ 图片已复制到 public/images/uploaded/${topic}/`);

  // Step 4: 加载配置并生成
  console.log('\n[4/4] 📝 生成配置...');
  const config = buildVideoConfig(topic);

  // 生成视频配置
  const configWithFrames = {
    ...config,
    durationInFrames: config.scenes.reduce((sum, s) => sum + s.duration * config.fps, 0),
    scenes: config.scenes.map((scene, index) => ({
      ...scene,
      from: config.scenes.slice(0, index).reduce((sum, s) => sum + s.duration * config.fps, 0),
      durationInFrames: scene.duration * config.fps,
    })),
  };

  // 生成视频数据
  const videoData = generateVideoData(parsedContent);

  // 写入文件
  fs.writeFileSync(
    path.join(process.cwd(), 'src/generated/config.json'),
    JSON.stringify(configWithFrames, null, 2)
  );

  fs.writeFileSync(
    path.join(process.cwd(), 'src/generated/data.json'),
    JSON.stringify(videoData, null, 2)
  );

  console.log(`   ✓ 配置已保存: src/generated/config.json`);
  console.log(`   ✓ 数据已保存: src/generated/data.json`);
  console.log(`   ✓ 卡片数据: ${videoData.cards.map(c => c.label + ':' + c.value + c.suffix).join(', ')}`);

  console.log('\n' + '='.repeat(50));
  console.log('✅ 准备完成！');
  console.log('='.repeat(50));
  console.log('\n🎬 渲染视频:');
  console.log('   npm run build');
  console.log('\n📁 输出位置:');
  console.log('   output/video.mp4');
  console.log('');
}

main().catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
