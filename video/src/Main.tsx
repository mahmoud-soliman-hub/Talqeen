import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop } from './components/Backdrop';
import { SceneStart, k } from './lib';
import { FPS } from './theme';
import { Aims, Founding, Opening } from './scenes/Intro';
import { Governance, Mission, Values, Vision } from './scenes/Identity';
import { Goals, Outputs } from './scenes/Goals';
import { Outro, Programs, Sustainability } from './scenes/Projects';

export const DURATION = 216;

// [start, end] in voiceover seconds; neighbours overlap by 0.5s for the cross-dissolve.
const SCENES: [React.FC, number, number][] = [
  [Opening, 0, 8.6],
  [Founding, 8.1, 25.3],
  [Aims, 24.8, 40.3],
  [Governance, 39.8, 51.2],
  [Vision, 50.7, 63.4],
  [Mission, 62.9, 82.6],
  [Values, 82.1, 90.2],
  [Goals, 89.7, 131.0],
  [Outputs, 130.5, 162.3],
  [Programs, 161.8, 188.6],
  [Sustainability, 188.1, 209.9],
  [Outro, 209.4, DURATION],
];

const Fade: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const t = start + useCurrentFrame() / FPS;
  const first = start === 0;
  const last = end === DURATION;
  const o = Math.min(first ? 1 : k(t, start, start + 0.5), last ? 1 : 1 - k(t, end - 0.5, end));
  const s = 1 + 0.015 * (1 - (first ? 1 : k(t, start, start + 0.7))) - 0.01 * (last ? 0 : k(t, end - 0.5, end));
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    {SCENES.map(([Scene, start, end]) => (
      <Sequence key={start} from={Math.round(start * FPS)} durationInFrames={Math.round((end - start) * FPS)}>
        <SceneStart value={start}>
          <Fade start={start} end={end}>
            <Scene />
          </Fade>
        </SceneStart>
      </Sequence>
    ))}
    <Audio src={staticFile('voiceover.mp3')} />
    <Audio src={staticFile('sfx.wav')} volume={0.55} />
  </AbsoluteFill>
);
