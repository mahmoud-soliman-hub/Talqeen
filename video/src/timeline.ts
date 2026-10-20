// Film time vs. voiceover time.
// The voiceover ("orig" seconds) is cut open at each section start and silence is inserted there,
// so the index ("agenda") scene can return and zoom into the next section's title.
// Scenes keep authoring in orig seconds; during a gap their clock simply holds.

export type Gap = { at: number; add: number; item: number };

// Agenda entries, in reading order (right-to-left, top row first).
export const AGENDA = [
  { title: 'عن الجمعية', icon: 'circle' },
  { title: 'الرؤية', icon: 'target' },
  { title: 'الرسالة', icon: 'doc' },
  { title: 'القيم', icon: 'badge' },
  { title: 'الأهداف الاستراتيجية', icon: 'chart' },
  { title: 'المخرجات المتوقعة', icon: 'shield' },
  { title: 'المشاريع التعليمية', icon: 'teacher' },
  { title: 'مشاريع الاستدامة', icon: 'leaf' },
];

export const FIRST_GAP = 7.5;
export const GAP = 3.0;

// One gap before every section; the first one hosts the full agenda reveal.
export const GAPS: Gap[] = [
  { at: 7.9, add: FIRST_GAP, item: 0 },
  { at: 50.95, add: GAP, item: 1 },
  { at: 63.15, add: GAP, item: 2 },
  { at: 82.35, add: GAP, item: 3 },
  { at: 89.95, add: GAP, item: 4 },
  { at: 130.75, add: GAP, item: 5 },
  { at: 162.05, add: GAP, item: 6 },
  { at: 188.35, add: GAP, item: 7 },
];

export const ORIG_END = 217.0; // outro holds until the closing line ends
export const CLOSING_LINE = { from: 0.4, to: 4.3, at: 211.3 }; // "جمعية تلقين لتعليم القرآن الكريم", replayed in the outro

const TOTAL_GAP = GAPS.reduce((s, g) => s + g.add, 0);
export const DURATION = Math.ceil((ORIG_END + TOTAL_GAP) * 30) / 30;

// orig → film. A time sitting exactly on a gap maps to the gap's start unless `after` is set.
export const fwd = (o: number, after = false) =>
  o + GAPS.reduce((s, g) => s + (g.at < o || (after && g.at === o) ? g.add : 0), 0);

// film → orig (holds at the gap point while a gap plays).
export const inv = (n: number) => {
  let off = 0;
  for (const g of GAPS) {
    const start = g.at + off;
    if (n < start) return n - off;
    if (n < start + g.add) return g.at;
    off += g.add;
  }
  return n - off;
};

export const gapStart = (g: Gap) => fwd(g.at);
export const gapEnd = (g: Gap) => fwd(g.at) + g.add;
