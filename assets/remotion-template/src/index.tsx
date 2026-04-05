import {Composition} from 'remotion';
import {Video} from './core/VideoEngine';
import config from './generated/config.json';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={config.durationInFrames || 480}
      fps={config.fps}
      width={config.width}
      height={config.height}
      defaultProps={{
        config,
      }}
    />
  );
};
