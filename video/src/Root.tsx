import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './theme';
import { DURATION, Main } from './Main';
import { loadFonts } from './fonts';

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="Talqeen" component={Main} durationInFrames={DURATION * FPS} fps={FPS} width={W} height={H} />
  </>
);
