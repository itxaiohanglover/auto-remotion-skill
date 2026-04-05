import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {VideoConfig} from './types';
import { loadStyleForBrowser } from './config-loader';
import videoData from '../generated/data.json';

interface VideoProps {
  config: VideoConfig;
}

// 开场场景
const IntroScene: React.FC = () => {
  const style = loadStyleForBrowser('apple-presentation');
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 淡入动画
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, fps * 0.5], [20, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${style.colors.background[0]} 0%, ${style.colors.background[1]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: style.colors.primary,
      fontFamily: style.typography.title.fontFamily,
      opacity,
    }}>
      <h1 style={{
        fontSize: style.typography.title.fontSize,
        fontWeight: style.typography.title.fontWeight,
        margin: 0,
        transform: `translateY(${translateY}px)`,
      }}>{videoData.title}</h1>
      <p style={{
        fontSize: style.typography.body.fontSize,
        color: style.colors.secondary,
        marginTop: 20,
        opacity: interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1]),
      }}>{videoData.subtitle}</p>
    </AbsoluteFill>
  );
};

// 数据仪表盘场景
const DashboardScene: React.FC = () => {
  const style = loadStyleForBrowser('apple-presentation');
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardStyle = (index: number): React.CSSProperties => {
    const delay = index * 10;
    const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const translateX = interpolate(frame, [delay, delay + 15], [-50, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      width: style.layout.card?.width,
      height: style.layout.card?.height,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: style.layout.card?.borderRadius,
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: style.colors.primary,
      opacity,
      transform: `translateX(${translateX}px)`,
    };
  };

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${style.colors.background[0]} 0%, ${style.colors.background[1]} 100%)`,
      padding: `${style.layout.safeArea.top}px ${style.layout.safeArea.left}px`,
    }}>
      <h2 style={{
        color: style.colors.primary,
        fontSize: style.typography.title.fontSize,
        marginBottom: 40,
        opacity: interpolate(frame, [0, 20], [0, 1]),
      }}>年度数据概览</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: style.layout.card?.gap,
      }}>
        {videoData.cards.map((card, index) => (
          <div key={card.id} style={cardStyle(index)}>
            <CounterValue
              value={card.value}
              suffix={card.suffix}
              frame={frame}
              delay={index * 10 + 30}
              fontSize={style.typography.number?.fontSize || 48}
            />
            <div style={{color: style.colors.secondary, marginTop: 8}}>{card.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 数字滚动组件
const CounterValue: React.FC<{
  value: number;
  suffix: string;
  frame: number;
  delay: number;
  fontSize: number;
}> = ({ value, suffix, frame, delay, fontSize }) => {
  const { fps } = useVideoConfig();

  const currentValue = interpolate(
    frame,
    [delay, delay + fps * 1.5],
    [0, value],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div style={{fontSize, fontWeight: 'bold'}}>
      {Math.round(currentValue)}{suffix}
    </div>
  );
};

// 结尾场景
const OutroScene: React.FC = () => {
  const style = loadStyleForBrowser('apple-presentation');
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${style.colors.background[0]} 0%, ${style.colors.background[1]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: style.colors.primary,
      opacity,
    }}>
      <h1 style={{
        fontSize: style.typography.title.fontSize,
        fontWeight: style.typography.title.fontWeight,
      }}>谢谢观看</h1>
      <p style={{color: style.colors.secondary, fontSize: style.typography.body.fontSize}}>
        2025，继续前行
      </p>
    </AbsoluteFill>
  );
};

const sceneComponents: Record<string, React.FC> = {
  'intro': IntroScene,
  'data-dashboard': DashboardScene,
  'outro': OutroScene,
};

export const Video: React.FC<VideoProps> = ({config}) => {
  return (
    <AbsoluteFill>
      {config.scenes.map((scene, index) => {
        const SceneComponent = sceneComponents[scene.type] || IntroScene;

        return (
          <Sequence
            key={index}
            from={scene.from || 0}
            durationInFrames={scene.durationInFrames}
          >
            <SceneComponent />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
