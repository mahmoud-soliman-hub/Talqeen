import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Divider } from '../components/Ornaments';
import { Label, Wipe, Words } from '../components/Type';
import { Diamond, Icon, Media, Photo } from '../components/Visual';
import { C } from '../theme';
import { MEDIA } from '../media';
import { font, k, useT, win } from '../lib';

// 0:00 — logo assembles, then the slogan.
export const Opening: React.FC = () => {
  const t = useT();
  const mark = k(t, 0.35, 1.6);
  const name = k(t, 1.3, 2.4);
  const tag = k(t, 2.1, 3.1);
  const glow = k(t, 0.2, 2.2);
  const lift = k(t, 4.4, 5.4);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,251,240,1) 0%, rgba(255,251,240,0) 65%)',
          opacity: glow,
          top: 40,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${-70 * lift}px) scale(${1 - 0.12 * lift})` }}>
        <Img
          src={staticFile('brand/logo-mark.png')}
          style={{
            height: 250,
            clipPath: `inset(${(1 - mark) * 100}% 0 0 0)`,
            transform: `translateY(${(1 - mark) * 40}px) scale(${0.92 + 0.08 * mark})`,
          }}
        />
        <div style={{ height: 34 }} />
        <Img
          src={staticFile('brand/wordmark-name.png')}
          style={{ height: 120, clipPath: `inset(-10% 0 -10% ${(1 - name) * 100}%)` }}
        />
        <div style={{ height: 18 }} />
        <Img
          src={staticFile('brand/wordmark-tagline.png')}
          style={{ height: 46, opacity: tag, transform: `translateY(${(1 - tag) * 14}px)` }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, opacity: k(t, 2.7, 3.6), transform: `translateY(${(1 - k(t, 2.7, 3.6)) * 12}px)` }}>
          <div style={{ width: 46, height: 2, background: C.green }} />
          <p style={{ ...font(40, 700, '#727373'), lineHeight: 1.2 }}>بمنطقة تبوك</p>
          <div style={{ width: 46, height: 2, background: C.green }} />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 790, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Divider width={640} progress={k(t, 4.5, 5.6)} />
        <div style={{ height: 22, opacity: 0 }} />
        <Words
          segs={[{ s: 4.85, e: 6.6, text: 'تلقينٌ وإتقان' }]}
          size={86}
          weight={700}
          hot={['وإتقان']}
          hotColor={C.teal}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 14,
          width: `${k(t, 0.3, 2.6) * 100}%`,
          background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
        }}
      />
    </AbsoluteFill>
  );
};

// 0:08 — why Talqeen exists.
export const Founding: React.FC = () => {
  const t = useT();
  const a = win(t, 8.2, 15.3, 0.5);
  const b = k(t, 15.2, 15.9);
  const chain = [
    { at: 18.9, text: 'ضبط القراءات' },
    { at: 20.7, text: 'التأهيل لمراتب الإقراء والإجازة' },
    { at: 23.0, text: 'بالسند المتصل' },
  ];
  return (
    <AbsoluteFill>
      <Photo src={MEDIA["s01-founding"]} w={600} h={820} at={7.85} span={17} shape="arch" pos="50% 60%" style={{ position: 'absolute', left: 170, top: 150 }} />
      <div style={{ position: 'absolute', right: 170, top: 200, width: 920, textAlign: 'right' }}>
        <Label at={8.4}>عن الجمعية</Label>
        <div style={{ position: 'relative', marginTop: 20 }}>
          <div style={{ opacity: a, position: 'absolute', right: 0, width: 920 }}>
            <Words
              segs={[{ s: 8.49, e: 13.42, text: 'تأسست لمعالجة فجوات الأداء والإتقان القرآني' }]}
              size={74}
              weight={700}
              hot={['الأداء', 'والإتقان']}
              lineHeight={1.4}
            />
            <div style={{ display: 'flex', gap: 22, justifyContent: 'flex-start', direction: 'rtl', marginTop: 40 }}>
              {[
                { at: 13.75, w: 'تلاوةً' },
                { at: 14.35, w: 'وحفظًا' },
              ].map(({ at, w }) => {
                const p = k(t, at, at + 0.6);
                return (
                  <div
                    key={w}
                    style={{
                      ...font(46, 700, C.tealDeep),
                      padding: '10px 44px',
                      borderRadius: 60,
                      border: `2px solid ${C.teal}`,
                      background: 'rgba(43,181,201,0.07)',
                      opacity: p,
                      transform: `scale(${0.85 + 0.15 * p})`,
                    }}
                  >
                    {w}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ opacity: b, position: 'absolute', right: 0, width: 920 }}>
            <Words
              segs={[{ s: 15.38, e: 18.36, text: 'واحتواء الخاتمين في مرحلة ما بعد الإتمام' }]}
              size={56}
              weight={700}
              hot={['الخاتمين']}
              lineHeight={1.4}
            />
            <div style={{ position: 'relative', marginTop: 50, marginRight: 14 }}>
              <div
                style={{
                  position: 'absolute',
                  right: 11,
                  top: 26,
                  width: 2,
                  height: 230 * k(t, 18.8, 23.6),
                  background: `linear-gradient(${C.teal}, ${C.green})`,
                }}
              />
              {chain.map(({ at, text }, i) => {
                const p = k(t, at, at + 0.7);
                return (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 34, height: 115, direction: 'rtl' }}>
                    <Diamond size={24} fill={p > 0.5 ? (i % 2 ? C.green : C.teal) : C.bg} stroke={i % 2 ? C.green : C.teal} style={{ opacity: p }} />
                    <Wipe at={at} dur={0.8}>
                      <p style={font(i === 2 ? 56 : 50, i === 2 ? 700 : 300, i === 2 ? C.tealDeep : C.ink)}>{text}</p>
                    </Wipe>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 0:25 — building an elite of masters.
export const Aims: React.FC = () => {
  const t = useT();
  const feats = [
    { at: 31.43, icon: 'voice', text: 'سلامة التلاوة' },
    { at: 33.24, icon: 'leaf', text: 'استدامة الأثر' },
    { at: 34.79, icon: 'circle', text: 'بيئة إقرائية تخصصية' },
    { at: 37.46, icon: 'book', text: 'مناهج علمية محكمة' },
  ];
  const img = k(t, 24.9, 26.4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: img }}>
        <Media
          src={MEDIA['s02-aims']}
          pos="50% 60%"
          style={{ transform: `scale(${1.12 - 0.08 * k(t, 24.9, 40.3, (x) => x)}) translateX(${-30 * k(t, 24.9, 40.3, (x) => x)}px)` }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(270deg, ${C.bg} 0%, rgba(250,248,243,0.96) 38%, rgba(250,248,243,0.55) 62%, rgba(250,248,243,0.1) 100%)`,
          }}
        />
        <AbsoluteFill style={{ background: `linear-gradient(0deg, ${C.bg} 0%, rgba(250,248,243,0) 30%)` }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', right: 150, top: 150, width: 1000, textAlign: 'right' }}>
        <Label at={25.4}>رسالتنا في الميدان</Label>
        <div style={{ height: 16 }} />
        <Words segs={[{ s: 25.52, e: 28.6, text: 'صناعة نخبة من المتقنين' }]} size={86} weight={700} hot={['المتقنين']} lineHeight={1.3} />
        <Words segs={[{ s: 28.6, e: 31.09, text: 'وتأهيل كفاءات تعليمية جادة' }]} size={54} color={C.inkSoft} style={{ marginTop: 10 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '34px 40px', marginTop: 60, direction: 'rtl' }}>
          {feats.map(({ at, icon, text }, i) => {
            const p = k(t, at, at + 0.7);
            return (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                <div
                  style={{
                    width: 86,
                    height: 86,
                    borderRadius: 22,
                    background: '#FFFFFF',
                    boxShadow: '0 14px 30px -18px rgba(30,80,90,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={icon} at={at + 0.1} size={50} color={i % 2 ? C.greenDeep : C.tealDeep} />
                </div>
                <p style={font(40, 700, C.ink)}>{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

