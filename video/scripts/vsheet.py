"""Tile vertical stills into one sheet: python3 scripts/vsheet.py out/dir"""
import glob, sys
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + '/t*.png'))
ims = [Image.open(f) for f in fs]
w, h = 360, 640
sheet = Image.new('RGB', (w * len(ims), h), 'white')
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    sheet.paste(im.convert('RGB').resize((w, h)), (i * w, 0))
    d.text((i * w + 8, 8), f.split('/t')[-1].replace('.png', '') + 's', fill='red')
sheet.save(sys.argv[1] + '/vsheet.jpg')
