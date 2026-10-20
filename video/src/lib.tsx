import React, { createContext, useContext } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from './theme';
import { inv } from './timeline';

// Every scene works in absolute voiceover seconds. The context holds the scene's start in film
// seconds; film time maps back to voiceover time, which holds still while an agenda gap plays.
const StartCtx = createContext(0);
export const SceneStart = StartCtx.Provider;
export const useFilmT = () => useContext(StartCtx) + useCurrentFrame() / FPS;
export const useT = () => inv(useFilmT());

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

// Eased 0→1 progress of t across [a, b].
export const k = (t: number, a: number, b: number, ease = EASE) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// 1 inside [a, b], easing in/out over `fade` seconds at both ends.
export const win = (t: number, a: number, b: number, fade = 0.45) =>
  Math.min(k(t, a, a + fade), 1 - k(t, b - fade, b, EASE_IO));

export const font = (size: number, weight: 300 | 700 = 300, color = C.ink): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: weight,
  fontSize: size,
  color,
  direction: 'rtl',
  lineHeight: 1.45,
  margin: 0,
});

// Letters that never join to the following letter.
const NON_JOIN = 'اأإآٱدذرزوؤةءى';
const HARAKAT = /[ً-ْٰ]/;

// Stretch the last word with tatweel before its final letter (or the nearest legal join).
export const kashida = (text: string, n = 3) => {
  const words = text.split(' ');
  const w = [...words[words.length - 1]];
  for (let i = w.length - 1; i > 0; i--) {
    if (HARAKAT.test(w[i])) continue;
    let p = i - 1;
    while (p >= 0 && HARAKAT.test(w[p])) p--;
    if (p < 0) break;
    if (!NON_JOIN.includes(w[p]) && w[i] !== 'ء') {
      w.splice(p + 1, 0, 'ـ'.repeat(n));
      break;
    }
  }
  words[words.length - 1] = w.join('');
  return words.join(' ');
};
