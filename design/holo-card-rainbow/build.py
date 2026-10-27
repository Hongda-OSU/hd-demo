# Regenerates the holo-card-rainbow demo's card from the script beside this file.
# Run from anywhere: python3 design/holo-card-rainbow/build.py [out-dir]  (needs ImageMagick 7)
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.normpath(
    os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'holo-card-rainbow', 'images'))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'holo-card'), os.path.join(HERE, '..', 'samples')]
import night

os.makedirs(OUT, exist_ok=True)
os.chdir(tempfile.mkdtemp())
night.card().save('card', 5)
subprocess.run(['magick', 'card.png', '-strip', f'PNG8:{os.path.join(OUT, "card.png")}'], check=True)
print('card.png')
