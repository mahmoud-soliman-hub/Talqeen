"""Splice re-rendered agenda windows into a 2× master and deliver a 1080p file with the voiceover.
python3 scripts/splice.py <master.mp4> <composition id> <WxH> <audio.wav> <out.mp4>"""
import json, os, subprocess, sys

master, comp, size, audio, out = sys.argv[1:6]
FPS = 30
meta = json.load(open('out/seg/ranges.json'))
ranges, frames = meta['ranges'], meta['frames']
work = f'out/splice-{comp}'
os.makedirs(work, exist_ok=True)
W, H = size.split('x')
ENC = ['-vf', f'scale={W}:{H}:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
       '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-video_track_timescale', '90000', '-an']

def count(f):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-count_frames', '-show_entries', 'stream=nb_read_frames',
                        '-of', 'csv=p=0', f], capture_output=True, text=True)
    return int(r.stdout.strip())

pieces, cur = [], 0
for a, b in ranges:
    if a > cur:
        pieces.append(('old', cur, a - 1))
    pieces.append(('new', a, b))
    cur = b + 1
if cur <= frames - 1:
    pieces.append(('old', cur, frames - 1))

listing = []
for i, (kind, a, b) in enumerate(pieces):
    n = b - a + 1
    dst = f'{work}/p{i:02d}.mp4'
    if kind == 'old':
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{(a - 0.5) / FPS:.6f}', '-i', master, '-frames:v', str(n), *ENC, dst]
    else:
        src = f'out/seg/{comp}-{a}-{b}.mp4'
        assert count(src) == n, (src, count(src), n)
        cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', str(n), *ENC, dst]
    if not (os.path.exists(dst) and count(dst) == n):
        subprocess.run(cmd, check=True)
    got = count(dst)
    assert got == n, (dst, got, n)
    print(f'{kind:3s} {a:5d}-{b:5d} ({n} frames) ok', flush=True)
    listing.append(f"file '{os.path.abspath(dst)}'")

open(f'{work}/list.txt', 'w').write('\n'.join(listing) + '\n')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{work}/list.txt', '-i', audio,
                '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest',
                '-movflags', '+faststart', out], check=True)
total = count(out)
print('TOTAL', total, 'expected', frames)
assert total == frames
