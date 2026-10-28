# reef.png: a coral reef in pixel art, a little larger than the demo's 350x420
# frame so the pan shows every edge -- light rays from above, fish and bubbles
# throughout, corals, sea grass and starfish on the sand.
# 125x115 grid, scaled x4 to 500x460. Only 40px taller than the frame on
# purpose: the demo pans between 15% and 45% down, so a taller picture would
# keep its sea floor out of view.
# Run from anywhere: python3 design/moving-background/reef.py  (needs ImageMagick 7)
import math, random, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'samples'))
from px import Img, ramp, dither, bayer, vgrad, ridge, fill_below, disc

W, H = 125, 115
rng = random.Random(12)

FISH = ['...xxxx..', '.xxxxxxxt', 'xexxxxxtt', '.xxxxxxxt', '...xxxx..']   # faces left

def fish(im, x0, y0, body, tail, right=False, stripes=()):
    for y, row in enumerate(FISH):
        for x, c in enumerate(row):
            if c == '.': continue
            col = {'x': body, 't': tail, 'e': '#10141c'}[c]
            if c == 'x' and x in stripes: col = '#ffffff'
            im.put(x0 + (len(row) - 1 - x if right else x), y0 + y, col)

def bubble(im, x, y, big):
    pts = ((0, -1), (1, 0), (0, 1), (-1, 0)) if not big else \
          ((0, -2), (1, -2), (2, -1), (2, 0), (1, 1), (0, 1), (-1, 0), (-1, -1))
    for dx, dy in pts: im.put(x + dx, y + dy, '#d8f6ff')
    im.put(x - (1 if big else 0), y - (1 if big else 1), '#ffffff')

def branch(im, x, y, a, length, width, depth, col, shade):
    # a branching coral: thick segments that split and thin as they rise
    for i in range(int(length)):
        px_, py_ = x + math.cos(a) * i, y - math.sin(a) * i
        disc(im, px_, py_, width, lambda u, v: shade if u > px_ else col)
    if depth == 0: return
    ex, ey = x + math.cos(a) * length, y - math.sin(a) * length
    for da in (-.45, .4):
        branch(im, ex, ey, a + da + rng.uniform(-.1, .1), length * .72, max(.6, width * .75), depth - 1, col, shade)

def seagrass(im, x, base, height, phase):
    for i in range(height):
        sx = x + 1.6 * math.sin(i * .25 + phase)
        im.put(sx, base - i, '#3aa84a'); im.put(sx + 1, base - i, '#1e7a3a')

def starfish(im, cx, cy):
    for k in range(5):
        a = -math.pi / 2 + k * 2 * math.pi / 5
        for r in range(4): im.put(cx + math.cos(a) * r, cy + math.sin(a) * r, '#ff7a3a' if r < 3 else '#ffb07a')
    im.put(cx, cy, '#ffd0a0')

def reef():
    im = Img(W, H)
    vgrad(im, 0, H, ramp('#8ae8f4', '#3ab8e0', '#1e7ec4', '#14509a', '#0e2e66'), power=.9)
    # light rays slanting down from the surface, fading with depth
    for rx in (12, 40, 70, 98):
        for y in range(0, 75):
            for x in range(W):
                d = abs((x - rx) - y * .35)
                if d < 5 and bayer(x, y, (1 - d / 5) * (1 - y / 75) * .55):
                    o = im.get(x, y); im.put(x, y, tuple(min(255, v + 40) for v in o))
    # sand with soft dunes, darker in the hollows
    tops = ridge(W, 92, [(.05, 3), (.13, 1.5)], 4)
    fill_below(im, tops, None, fn=lambda x, y, d: dither(ramp('#f2dca4', '#dcbc7c', '#c09a5c'), d / 22, x, y))
    # rocks the corals grow on
    for cx, cy, rx, ry in ((18, 98, 16, 9), (104, 96, 18, 10), (62, 103, 12, 6)):
        for y in range(int(cy - ry), int(cy + ry)):
            for x in range(int(cx - rx), int(cx + rx)):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                    im.put(x, y, dither(ramp('#5a6a8a', '#3a4868', '#26304a'), (y - cy + ry) / (2 * ry), x, y))
    for x, h, ph in ((4, 30, 0), (8, 22, 1.2), (34, 26, 2), (38, 18, .5), (80, 30, 1.7), (85, 24, .3),
                     (118, 28, 2.4), (121, 20, 1)):
        seagrass(im, x, 106, h, ph)
    branch(im, 18, 90, math.pi / 2, 12, 2, 3, '#ff6a9a', '#c83a6a')
    branch(im, 104, 87, math.pi / 2 + .15, 13, 2.2, 3, '#ff9a3a', '#c8602a')
    branch(im, 62, 98, math.pi / 2 - .1, 9, 1.6, 2, '#b07aff', '#7a4ad0')
    # brain corals and anemones
    for cx, cy, r in ((44, 101, 6), (88, 99, 5)):
        disc(im, cx, cy, r, lambda x, y: '#ffd23f' if (x + y) % 3 else '#c8962a')
    for cx in (28, 74, 112):
        for k in range(7):
            a = math.pi * (.15 + .7 * k / 6)
            for r in range(5): im.put(cx + math.cos(a) * r, 103 - math.sin(a) * r, '#ff8ad8' if r < 4 else '#ffd0f0')
    starfish(im, 52, 104); starfish(im, 96, 105); starfish(im, 10, 106)
    # fish across the whole water, so every edge of the pan has something in it
    for x, y, kind, right in ((14, 14, 'clown', True), (90, 10, 'tang', False), (52, 26, 'yellow', True),
                              (104, 36, 'clown', False), (20, 44, 'tang', True), (70, 52, 'yellow', False),
                              (40, 64, 'clown', True), (98, 68, 'tang', False), (8, 74, 'yellow', True),
                              (60, 78, 'tang', True), (110, 54, 'yellow', False), (30, 4, 'yellow', False)):
        body, tail, stripes = {'clown': ('#ff8a2a', '#ff8a2a', (3, 6)), 'tang': ('#2a5ae0', '#ffd23f', ()),
                               'yellow': ('#ffd23f', '#ffb02a', ())}[kind]
        fish(im, x, y, body, tail, right, stripes)
    # a small school of silver fish
    for i in range(9):
        sx, sy = 64 + (i % 3) * 6 + (i // 3) * 2, 34 + (i // 3) * 4
        for dx, c in ((0, '#d8e4f0'), (1, '#d8e4f0'), (2, '#a8b8c8'), (-1, '#10141c')): im.put(sx + dx, sy, c)
    for _ in range(26):
        bubble(im, rng.randrange(4, W - 4), rng.randrange(4, 86), rng.random() < .3)
    return im

if __name__ == '__main__':
    import subprocess, tempfile
    out = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'demos',
                                        'html', 'moving-background', 'images'))
    if len(sys.argv) > 1: out = os.path.abspath(sys.argv[1])
    os.makedirs(out, exist_ok=True)
    os.chdir(tempfile.mkdtemp())
    reef().save('reef', 4)
    subprocess.run(['magick', 'reef.png', '-strip', f'PNG8:{os.path.join(out, "reef.png")}'], check=True)
    print('reef.png')
