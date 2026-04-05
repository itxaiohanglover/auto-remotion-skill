---
name: auto-remotion-skill
description: |
  自动化视频生成 Skill，基于 Remotion 将文本素材转换为专业数据可视化视频。
  触发条件：
  1. 用户说"生成视频"、"制作视频"、"auto-remotion"
  2. 用户需要初始化视频项目
  3. 用户已有文本素材需要转换为视频
  4. 工作目录包含 topics/ 或需要创建视频项目结构
---

# Auto Remotion Skill

自动化视频生成工作流，将文本内容转换为 Remotion 视频项目。

## 工作流程

### Step 1: 检查/初始化项目

检查当前工作目录是否有视频项目结构。如果没有，自动初始化：

```
工作目录/
├── topics/              # 用户放素材的目录
├── output/              # 视频输出目录
├── src/                 # Remotion 源代码（从 assets/ 复制）
├── scripts/             # 构建脚本（从 assets/ 复制）
├── public/images/       # 图片资源
├── package.json         # 项目配置（从 assets/ 生成）
└── remotion.config.ts   # Remotion 配置（从 assets/ 复制）
```

### Step 2: 素材准备

用户将素材放入 `topics/{name}/`：
- `content.txt` - 视频文案（必需）
- `images/` - 本地图片（可选）
- `keywords.json` - 配置（可选）

### Step 3: 生成视频

运行构建流程：
1. 解析 `content.txt` 提取数据和关键词
2. 生成 `src/generated/config.json` 和 `data.json`
3. 渲染视频到 `output/`

## 使用方法

### 初始化新项目

```
用户: 初始化视频项目
AI: 正在初始化 Remotion 视频项目...
    ✓ 创建目录结构
    ✓ 复制模板文件
    ✓ 生成 package.json
    
    项目已就绪！下一步：
    1. 编辑 topics/example/content.txt 放入你的文案
    2. 运行：生成视频 example
```

### 生成视频

```
用户: 生成视频 annual-review
AI: 开始生成视频: annual-review
    [1/4] 解析文本内容...
    [2/4] 提取数据指标: 50%, 100万, 120期...
    [3/4] 生成配置文件...
    [4/4] 渲染视频...
    
    ✅ 视频生成成功！
    📁 输出: output/video.mp4
```

## 核心脚本

使用 bundled scripts：

- `scripts/init_remotion_project.py` - 初始化项目结构
- `scripts/build_video.py` - 构建视频主流程
- `scripts/parse_content.py` - 解析文本内容
- `scripts/fetch_images.py` - 获取图片素材

## Assets 模板

从 `assets/remotion-template/` 复制：
- 完整的 Remotion 项目结构
- 预配置的 VideoEngine 组件
- 文本解析器和图片获取工具
- 示例配置和风格

## 项目配置

生成的 `package.json`：

```json
{
  "name": "video-project",
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion render src/index.tsx Video output/video.mp4",
    "build:video": "tsx scripts/build-video.ts"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.258",
    "react": "^18.0.0"
  }
}
```

## 数据提取规则

自动从文本识别：
- 百分比：`50%`, `增长35%`
- 数量：`100万次`, `120期`, `30人`
- 前4个指标用于数据仪表盘场景

## 图片素材来源

优先级：
1. `topics/{name}/images/` 本地图片
2. Unsplash API（基于关键词自动下载）
3. 纯色背景（备用）

## 错误处理

| 场景 | 处理 |
|-----|------|
| 无 content.txt | 提示创建并放入文案 |
| 无本地图片 | 自动从网上下载 |
| 下载失败 | 使用纯色背景 |
| 渲染失败 | 检查 FFmpeg 和依赖 |
