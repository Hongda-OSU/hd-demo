# Regenerates the holo-card demo's images from the scripts beside this file.
# Run from anywhere: python3 design/holo-card/build.py  (needs ImageMagick 7)
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'holo-card', 'images'))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'samples')]
import card, sparkles

os.makedirs(OUT, exist_ok=True)
os.chdir(tempfile.mkdtemp())
card.card().save('card', 5)
subprocess.run(['magick', 'card.png', '-strip', f'PNG8:{os.path.join(OUT, "card.png")}'], check=True)
paths = []
for i, im in enumerate(sparkles.frames()):
    im.save(f'sparkle-{i}', 2)
    paths.append(f'sparkle-{i}.png')
subprocess.run(['magick', '-delay', '14', '-loop', '0', *paths, '-strip', os.path.join(OUT, 'sparkles.gif')], check=True)
print('card.png, sparkles.gif')
