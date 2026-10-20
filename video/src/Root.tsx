import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './theme';
import { DURATION, Main } from './Main';
import { loadFonts } from './fonts';

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="Talqeen" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="TalqeenVertical" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{ vertical: true }} />
  </>
);
