# Regenerates public/samples/*.png from the scene scripts beside this file.
# Run from anywhere: python3 design/samples/build.py  (needs ImageMagick 7)
import os, runpy, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'samples'))
NAMES = ['landscape-1', 'landscape-2', 'landscape-3', 'portrait-1', 'portrait-2', 'portrait-3',
         'square-1', 'square-2', 'square-3']

sys.path.insert(0, HERE)
os.chdir(tempfile.mkdtemp())
runpy.run_path(os.path.join(HERE, 'synthwave.py'))
subprocess.run(['magick', 'synthwave.ppm', '-filter', 'point', '-resize', '500%', 'landscape-1.png'], check=True)
import scenes_land, scenes_port, scenes_sq
scenes_land.aurora(); scenes_land.desert()
scenes_port.cyber(); scenes_port.alley(); scenes_port.forest()
scenes_sq.planet(); scenes_sq.lighthouse(); scenes_sq.jelly()

# Every scene stays well under 256 colours, so PNG8 is lossless here.
os.makedirs(OUT, exist_ok=True)
for name in NAMES:
    subprocess.run(['magick', f'{name}.png', '-strip', f'PNG8:{os.path.join(OUT, name + ".png")}'], check=True)
    print(name)
