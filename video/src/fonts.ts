import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT } from './theme';

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('fonts');
  const faces = [
    new FontFace(FONT, `url(${staticFile('fonts/thmanyahseriftext-Light.otf')})`, { weight: '300' }),
    new FontFace(FONT, `url(${staticFile('fonts/thmanyahseriftext-Bold.otf')})`, { weight: '700' }),
  ];
  Promise.all(faces.map((f) => f.load())).then((fs) => {
    fs.forEach((f) => (document.fonts as unknown as Set<FontFace>).add(f));
    continueRender(handle);
  });
};
