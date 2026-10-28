# Regenerates the holo-card-grayscale demo's images from the scripts beside this file
# and design/holo-card/.
# Run from anywhere: python3 design/holo-card-grayscale/build.py [out-dir]  (needs ImageMagick 7)
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.normpath(
    os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'holo-card-grayscale', 'images'))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'holo-card'), os.path.join(HERE, '..', 'samples')]
import grass, sparkles

def save_rgba(px, path, scale):  # a grid of '#rrggbb' or None, written as RGBA via PAM
    with open(path + '.pam', 'wb') as f:
        f.write(f'P7\nWIDTH {len(px[0])}\nHEIGHT {len(px)}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n'.encode())
        for row in px:
            for c in row:
                f.write(bytes(4) if c is None else bytes(int(c[i:i + 2], 16) for i in (1, 3, 5)) + b'\xff')
    subprocess.run(['magick', path + '.pam', '-filter', 'point', '-resize', f'{scale * 100}%', path + '.png'], check=True)

os.makedirs(OUT, exist_ok=True)
os.chdir(tempfile.mkdtemp())
grass.card().save('card', 5)
save_rgba(grass.frog(), 'frog', 5)
for name in ('card', 'frog'):
    subprocess.run(['magick', f'{name}.png', '-strip', f'PNG8:{os.path.join(OUT, name + ".png")}'], check=True)
# holo-card's sparkles with the black taken out: here they sit in a layer that
# is transparent around the frog, so a black ground would cover the card.
paths = []
for i, im in enumerate(sparkles.frames()):
    im.save(f'sparkle-{i}', 2)
    paths.append(f'sparkle-{i}.png')
subprocess.run(['magick', '-delay', '14', '-loop', '0', '-dispose', 'previous', *paths, '-transparent', 'black',
                '-strip', os.path.join(OUT, 'sparkles.gif')], check=True)
print('card.png, frog.png, sparkles.gif')
