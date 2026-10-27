# Regenerates the parallax-card demo's images from the scripts beside this file.
# Run from anywhere: python3 design/parallax-card/build.py [out-dir]  (needs ImageMagick 7)
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.normpath(
    os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'parallax-card', 'images'))
sys.path[:0] = [HERE]
import fire, mage

def save(px, path, scale):  # a grid of '#rrggbb' or None, written as RGBA via PAM
    with open(path + '.pam', 'wb') as f:
        f.write(f'P7\nWIDTH {len(px[0])}\nHEIGHT {len(px)}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n'.encode())
        for row in px:
            for c in row:
                f.write(bytes(4) if c is None else bytes(int(c[i:i + 2], 16) for i in (1, 3, 5)) + b'\xff')
    subprocess.run(['magick', path + '.pam', '-filter', 'point', '-resize', f'{scale * 100}%', path + '.png'], check=True)

os.makedirs(OUT, exist_ok=True)
os.chdir(tempfile.mkdtemp())
save(mage.mage(), 'mage', 6)
subprocess.run(['magick', 'mage.png', '-strip', f'PNG8:{os.path.join(OUT, "mage.png")}'], check=True)
paths = []
for i, px in enumerate(fire.frames()):
    save(px, f'fire-{i}', 8)
    paths.append(f'fire-{i}.png')
subprocess.run(['magick', '-delay', '10', '-loop', '0', '-dispose', 'previous', *paths, '-strip',
                os.path.join(OUT, 'fire.gif')], check=True)
print('mage.png, fire.gif')
