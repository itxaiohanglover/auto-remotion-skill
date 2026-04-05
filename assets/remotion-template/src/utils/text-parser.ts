/**
 * 文本内容解析器
 * 从 content.txt 提取结构化数据
 */

export interface ParsedContent {
  title: string;
  paragraphs: string[];
  metrics: Metric[];
  keywords: string[];
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
  context: string;
}

/**
 * 解析文本内容
 */
export function parseTextContent(text: string): ParsedContent {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // 提取标题（第一行）
  const title = lines[0] || '未命名视频';

  // 提取段落（空行分隔）
  const paragraphs: string[] = [];
  let currentParagraph = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line) {
      currentParagraph += line;
    } else if (currentParagraph) {
      paragraphs.push(currentParagraph);
      currentParagraph = '';
    }
  }
  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  // 提取数据指标
  const metrics = extractMetrics(text);

  // 提取关键词
  const keywords = extractKeywords(text);

  return {
    title,
    paragraphs,
    metrics,
    keywords,
  };
}

/**
 * 提取数据指标
 */
function extractMetrics(text: string): Metric[] {
  const metrics: Metric[] = [];

  // 匹配模式
  const patterns = [
    { regex: /(\d+)%/g, suffix: '%' },                    // 百分比
    { regex: /(\d+)万/g, suffix: '万' },                   // 万单位
    { regex: /(\d+)千/g, suffix: '千' },                   // 千单位
    { regex: /(\d+)期/g, suffix: '期' },                   // 期数
    { regex: /(\d+)人/g, suffix: '人' },                   // 人数
    { regex: /(\d+)次/g, suffix: '次' },                   // 次数
    { regex: /(\d+)个/g, suffix: '个' },                   // 个数
  ];

  for (const { regex, suffix } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const value = parseInt(match[1]);
      const fullMatch = match[0];
      const index = match.index;

      // 提取上下文（前后20字）
      const contextStart = Math.max(0, index - 20);
      const contextEnd = Math.min(text.length, index + fullMatch.length + 20);
      const context = text.slice(contextStart, contextEnd);

      // 尝试提取标签
      const label = extractLabel(context, value);

      metrics.push({
        value,
        suffix,
        label,
        context: context.replace(/\n/g, ' '),
      });
    }
  }

  return metrics.slice(0, 8); // 最多8个指标
}

/**
 * 提取标签
 */
function extractLabel(context: string, value: number): string {
  // 常见模式
  const patterns = [
    /([^。，；]+?)增长/,
    /([^。，；]+?)达到/,
    /([^。，；]+?)突破/,
    /([^。，；]+?)提升/,
    /([^。，；]+?)扩展/,
    /累计([^。，；]+)/,
    /全年([^。，；]+)/,
  ];

  for (const pattern of patterns) {
    const match = context.match(pattern);
    if (match) {
      return match[1].slice(-8); // 取最后8个字符
    }
  }

  return '数据';
}

/**
 * 提取关键词
 */
function extractKeywords(text: string): string[] {
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
 * 为视频引擎生成数据
 */
export function generateVideoData(parsed: ParsedContent) {
  // 生成卡片数据（最多4个）
  const cards = parsed.metrics.slice(0, 4).map((m, i) => ({
    id: i,
    label: m.label,
    value: m.value,
    suffix: m.suffix,
  }));

  // 如果没有提取到数据，使用默认值
  if (cards.length === 0) {
    cards.push(
      { id: 0, label: '数据1', value: 100, suffix: '%' },
      { id: 1, label: '数据2', value: 50, suffix: '万' },
      { id: 2, label: '数据3', value: 1000, suffix: '次' },
      { id: 3, label: '数据4', value: 30, suffix: '%' }
    );
  }

  // 填充到4个
  while (cards.length < 4) {
    const last = cards[cards.length - 1];
    cards.push({
      id: cards.length,
      label: `数据${cards.length + 1}`,
      value: Math.floor(last.value * 0.8),
      suffix: last.suffix,
    });
  }

  return {
    title: parsed.title,
    subtitle: parsed.paragraphs[0]?.slice(0, 50) || '',
    cards,
  };
}
