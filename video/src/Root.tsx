import React from 'react';
import { Composition } from 'remotion';
import { FrameOpening, FrameProgram, FrameVision } from './scenes/StyleFrames';
import { FPS, H, W } from './theme';
import { loadFonts } from './fonts';

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="SF-Opening" component={FrameOpening} durationInFrames={120} fps={FPS} width={W} height={H} />
    <Composition id="SF-Vision" component={FrameVision} durationInFrames={120} fps={FPS} width={W} height={H} />
    <Composition id="SF-Program" component={FrameProgram} durationInFrames={120} fps={FPS} width={W} height={H} defaultProps={{ index: 0 }} />
  </>
);
