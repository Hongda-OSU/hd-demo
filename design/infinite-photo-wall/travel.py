# Seven pixel-art travel snapshots for the infinite-photo-wall demo.
# 117x171 grids -- the 234:342 shape of a photo cell -- scaled x4 to 468x684,
# written as PNG8 into the demo's images folder. Run from anywhere:
#   python3 design/infinite-photo-wall/travel.py   (needs ImageMagick 7)
import math, os, random, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'samples'))
from px import Img, ramp, dither, vgrad, stars, ridge, fill_below, disc, rect, glow, hx

W, H = 117, 171
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'infinite-photo-wall', 'images'))

def tri(im, cx, top, base, half, c):
    for y in range(int(top), int(base) + 1):
        w = half * (y - top) / max(1, base - top)
        rect(im, cx - w, y, cx + w, y, c)

def pine(im, x, base, h, c, c2):
    rect(im, x, base - h // 5, x, base, '#2a1a12')
    for k in range(3):
        tri(im, x, base - h + k * h // 4, base - h // 5 - (2 - k) * h // 6, h / 4 + k * h / 10, c)
    for y in range(base - h + 2, base - h // 5, 3): im.put(x + 1, y, c2)

def fuji():                      # sunrise over Mt Fuji, a pagoda and cherry blossom
    rng = random.Random(1); im = Img(W, H)
    vgrad(im, 0, 112, ramp('#4a5ac8', '#9a86d6', '#f4a0a8', '#ffd6a0'), 1.1)
    disc(im, 26, 104, 9, lambda x, y: '#fff2c4'); glow(im, 26, 104, 26, '#ffe0a0', .45)
    tops = [44 + max(0, abs(x - 60) - 5) * (0.95 + abs(x - 60) * .004) for x in range(W)]
    def mtn(x, y, d):
        snow = d < 20 + 4 * math.sin(x * .9) + (x - 60) * .05
        if snow: return '#c9d0f2' if x > 62 and (x + y) % 2 else '#f6f7ff'
        return dither(ramp('#7a84c4', '#55609e', '#3e4880'), d / 70 + (x > 60) * .25, x, y)
    fill_below(im, tops, None, 120, mtn)
    fill_below(im, ridge(W, 114, [(.11, 3), (.05, 4)], 3), '#4a3a6a', 126)
    fill_below(im, ridge(W, 122, [(.17, 2), (.07, 3)], 4), None, None,
               lambda x, y, d: dither(ramp('#2e4a3e', '#1e3428'), d / 40, x, y))
    px, base = 92, 126                                    # five-storey pagoda in silhouette
    for k in range(5):
        y = base - 10 - k * 9
        rect(im, px - 9 + k, y, px + 9 - k, y + 1, '#2a1420')
        im.put(px - 10 + k, y - 1, '#2a1420'); im.put(px + 10 - k, y - 1, '#2a1420')
        rect(im, px - 5 + k // 2, y + 2, px + 5 - k // 2, y + 8, '#8a2430')
    rect(im, px, base - 62, px, base - 54, '#2a1420')
    for cx, cy, n in ((6, 8, 22), (110, 150, 26), (4, 160, 18)):    # blossom clusters
        for _ in range(n):
            x, y, r = cx + rng.uniform(-14, 14), cy + rng.uniform(-12, 12), rng.uniform(2, 4.5)
            disc(im, x, y, r, lambda a, b, x=x, y=y: '#ffd9e8' if a < x and b < y else rng.choice(['#ff9cc4', '#ffb3d1']))
    for _ in range(30): im.put(rng.randrange(W), rng.randrange(60, H), '#ffc4dc')
    return im

def beach():                     # sunset over the sea, palm in silhouette
    rng = random.Random(2); im = Img(W, H)
    vgrad(im, 0, 104, ramp('#24184a', '#7a2e6e', '#e8566a', '#ffa25a', '#ffd27a'), 1)
    disc(im, 66, 94, 15, lambda x, y: None if y > 104 or (y > 92 and y % 3 == 0) else '#fff0b0')
    glow(im, 66, 94, 40, '#ffb070', .4)
    vgrad(im, 104, 142, ramp('#3a2a6a', '#22264e', '#141a36'), 1)
    for y in range(105, 142):                             # sun's broken path on the water
        w = 4 + (y - 104) // 2
        for x in range(66 - w, 66 + w):
            if rng.random() < .35 and y % 2: im.put(x, y, rng.choice(['#ffd27a', '#ff9a5a', '#ffe9a8']))
    for y in range(110, 142, 6):
        for x in range(rng.randrange(6), W, 9): rect(im, x, y, x + 3, y, '#4a4a8a')
    vgrad(im, 142, H, ramp('#e0a070', '#b8784e', '#8a5636'), 1)
    for x in range(W): im.put(x, 142 + int(1.5 * math.sin(x * .3)), '#fff4e0')
    for t in range(200):                                  # leaning trunk
        u = t / 200; x = 16 + 20 * u ** 1.6; y = 171 - 101 * u
        disc(im, x, y, 2.6 - u, lambda a, b: '#1a0e1a')
    for a0 in (-2.8, -2.2, -1.6, -1.0, -0.4, 0.3, 2.9):    # drooping fronds with leaflets
        L = 30
        for s_ in range(L):
            u = s_ / L
            x = 36 + math.cos(a0) * s_; y = 70 + math.sin(a0) * s_ * .6 + 14 * u * u
            disc(im, x, y, 1.4 * (1 - u) + .5, lambda a, b: '#1a0e1a')
            if s_ % 2 == 0 and s_ > 3:
                for k in range(1, int(5 * (1 - u)) + 2):
                    im.put(x - k * .4, y + k, '#1a0e1a'); im.put(x + k * .4, y + k, '#1a0e1a')
    for bx, by in ((86, 40), (94, 46), (80, 50)):         # gulls
        for d in (-1, 1): im.put(bx + d, by - 1, '#2a1830'); im.put(bx + 2 * d, by - 1, '#2a1830')
        im.put(bx, by, '#2a1830')
    return im

def alps():                      # snowy peaks over a still lake, pines on the shore
    rng = random.Random(3); im = Img(W, H)
    vgrad(im, 0, 100, ramp('#3c7ad8', '#76aef0', '#c6e4ff'), 1)
    for cx, cy, n in ((24, 18, 5), (88, 30, 4)):
        for k in range(n): disc(im, cx + k * 5 - n * 2, cy + (k % 2) * 2, 4 + k % 3, lambda x, y: '#ffffff' if y < cy + 2 else '#e2eefc')
    tops = ridge(W, 64, [(.09, 16), (.21, 6), (.04, 8)], 7)
    def peak(x, y, d):
        if d < 10 + 3 * math.sin(x * 1.3): return '#ffffff' if (x * 3 + y) % 7 < 5 else '#d6e2f6'
        return dither(ramp('#6e7c9e', '#4a5676', '#323c56'), d / 46, x, y)
    fill_below(im, tops, None, 100, peak)
    fill_below(im, ridge(W, 92, [(.13, 4), (.06, 5)], 9), None, 102,
               lambda x, y, d: dither(ramp('#3a6a52', '#22483a'), d / 14, x, y))
    for y in range(102, 140):                             # mirrored, darkened, rippled
        my = 101 - (y - 102)
        for x in range(W):
            sx = min(W - 1, max(0, x + (1 if (y // 2) % 3 == 0 else 0)))
            r, g, b = im.p[max(0, my)][sx]
            im.p[y][x] = (int(r * .7), int(g * .78), int(b * .9))
        if y % 5 == 0:
            for x in range(rng.randrange(8), W, 13): rect(im, x, y, x + 4, y, '#a8c8e8')
    vgrad(im, 140, H, ramp('#5a9a4a', '#3a7a3a', '#2a5a2e'), 1)
    for x, base, h in ((6, 150, 46), (18, 146, 36), (28, 152, 28), (100, 148, 42), (110, 154, 50), (90, 150, 26)):
        pine(im, x, base, h, '#1e3a2a', '#2e5a3a')
    for _ in range(40): im.put(rng.randrange(W), rng.randrange(152, H), rng.choice(['#f4e06a', '#ffffff', '#e070a0']))
    return im

def desert():                    # a caravan crossing the dunes at sundown
    rng = random.Random(4); im = Img(W, H)
    vgrad(im, 0, 96, ramp('#3a2a6a', '#b04a5a', '#ff8a4a', '#ffd07a'), 1)
    disc(im, 80, 80, 18, lambda x, y: '#fff0b8'); glow(im, 80, 80, 40, '#ffc070', .45)
    for base, amp, seed, cols in ((92, 6, 11, ('#e8946a', '#c06a4e')), (110, 10, 12, ('#f4a868', '#c8784a')),
                                  (136, 12, 13, ('#ffbe78', '#d88a52')), (158, 8, 14, ('#ffcc88', '#e09a5e'))):
        tops = ridge(W, base, [(.05, amp), (.12, amp / 3)], seed)
        fill_below(im, tops, None, None,
                   lambda x, y, d, t=tops, c=cols: dither(ramp(c[0], c[1]), d / 45 + (.35 if t[min(W - 1, x + 1)] > t[max(0, x - 1)] else 0), x, y))
        for x in range(W): im.put(x, tops[x], '#fff0c8')
    crest = ridge(W, 110, [(.05, 10), (.12, 10 / 3)], 12)
    for i, cx in enumerate((26, 40, 54)):                 # camels with riders
        cy = int(crest[cx]) - 1; c = '#2a1420'
        rect(im, cx - 5, cy - 9, cx + 3, cy - 6, c); disc(im, cx - 1, cy - 10, 2.5, lambda x, y: c)
        rect(im, cx + 3, cy - 13, cx + 4, cy - 7, c); rect(im, cx + 4, cy - 14, cx + 7, cy - 12, c)
        for lx in (cx - 5, cx - 3, cx + 1, cx + 3): rect(im, lx, cy - 5, lx, cy, c)
        if i != 1: rect(im, cx - 2, cy - 16, cx - 1, cy - 12, c); im.put(cx - 2, cy - 17, c)
    for _ in range(25): im.put(rng.randrange(W), rng.randrange(30), '#ffe0c0')
    return im

def terraces():                  # rice terraces stepping down a misty valley
    rng = random.Random(5); im = Img(W, H)
    vgrad(im, 0, 60, ramp('#c8e4ea', '#e6f2e8', '#f4f6e4'), 1)
    for base, col, seed in ((40, '#a8c8b8', 21), (52, '#86ae9a', 22), (64, '#5e8e74', 23)):
        fill_below(im, ridge(W, base, [(.06, 8), (.15, 3)], seed), col, 80)
    for y in range(58, 70):
        for x in range(W):
            if rng.random() < .5 - (y - 58) / 30: im.put(x, y, '#e8f2ec')
    greens = ['#9ccc5a', '#7cb648', '#5e9c3a', '#b4d86a']
    for k, y0 in enumerate(range(66, H, 9)):              # contour bands, each with a water edge
        off = [y0 + 4 * math.sin(x * .05 + k * .7) + 3 * math.sin(x * .13 + k) for x in range(W)]
        for x in range(W):
            for y in range(int(off[x]), H):
                d = y - off[x]
                im.put(x, y, '#cfe8f0' if d < 1.2 else ('#2e5a2a' if d > 7.8 else dither(ramp(greens[k % 4], '#3e7a32'), min(d, 9) / 9, x, y)))
        for x in range(rng.randrange(5), W, 7):
            im.put(x, int(off[x]) + 3, '#c4e480')
    hx0, hy0 = 82, 106                                    # thatched hut on a terrace
    rect(im, hx0, hy0, hx0 + 14, hy0 + 8, '#7a4a2a'); rect(im, hx0 + 6, hy0 + 3, hx0 + 8, hy0 + 8, '#2a1a10')
    for i in range(7): rect(im, hx0 - 3 + i, hy0 - 1 - i, hx0 + 17 - i, hy0 - 1 - i, '#d8b060' if i % 2 else '#b88a40')
    for bx, by in ((30, 30), (36, 34)):
        im.put(bx - 1, by - 1, '#4a5a4a'); im.put(bx + 1, by - 1, '#4a5a4a'); im.put(bx, by, '#4a5a4a')
    return im

def santorini():                 # whitewashed houses and blue domes above the sea
    rng = random.Random(6); im = Img(W, H)
    vgrad(im, 0, 64, ramp('#3a8ee8', '#7ec0f8', '#c8e8ff'), 1)
    vgrad(im, 64, H, ramp('#2a7ac8', '#1a5aa8', '#0e3a7a'), 1)
    for y in range(68, H, 4):
        for x in range(rng.randrange(9), W, 11): rect(im, x, y, x + 2, y, '#5aa8e8')
    cliff = [52 + 76 * (x / W) ** 1.6 for x in range(W)]
    fill_below(im, cliff, None, None, lambda x, y, d: dither(ramp('#a86a4a', '#7a4a36'), d / 40, x, y))
    houses = []
    for row in range(9):
        y = 52 + row * 13
        for col in range(5):
            x = 4 + col * 22 + (row % 2) * 9 + rng.randrange(-2, 3)
            if y < cliff[min(W - 1, max(0, x + 8))] - 4 or x > W - 10: continue
            houses.append((x, y, rng.randrange(12, 18), rng.randrange(9, 12)))
    for x, y, w, h in houses:
        rect(im, x, y, x + w, y + h, '#fbfbf6'); rect(im, x + w - 3, y, x + w, y + h, '#d8dcea')
        rect(im, x + 3, y + h - 6, x + 5, y + h - 1, '#2a5ab0'); rect(im, x + 8, y + 3, x + 9, y + 5, '#2a5ab0')
        rect(im, x - 1, y - 1, x + w + 1, y - 1, '#e8e8e0')
    for x, y, r in ((22, 66, 7), (58, 96, 6), (34, 118, 7)):    # blue domes with crosses
        rect(im, x - r, y, x + r, y + 10, '#fbfbf6'); rect(im, x + r - 3, y, x + r, y + 10, '#d8dcea')
        disc(im, x, y, r, lambda a, b, x=x, y=y: None if b > y else ('#5a9af0' if a < x - 2 and b < y - 3 else '#1e58c8'))
        rect(im, x, y - r - 4, x, y - r, '#fbfbf6'); rect(im, x - 1, y - r - 3, x + 1, y - r - 3, '#fbfbf6')
    for _ in range(36):                                   # bougainvillea
        x, y = rng.randrange(W), rng.randrange(66, 140)
        if im.get(x, y) == hx('#fbfbf6'): disc(im, x, y, 1.4, lambda a, b: rng.choice(['#e8408a', '#ff6aa8']))
    return im

def balloons():                  # hot-air balloons over a valley of rock chimneys
    rng = random.Random(7); im = Img(W, H)
    vgrad(im, 0, 120, ramp('#8ab0e8', '#c8c8e0', '#ffd0a8', '#ffe2b0'), 1)
    glow(im, 20, 118, 40, '#fff0c0', .4)
    fill_below(im, ridge(W, 112, [(.07, 5), (.2, 2)], 31), '#c89a86', 150)
    for i in range(9):                                    # fairy chimneys
        cx, h, w = 6 + i * 13 + rng.randrange(-3, 4), rng.randrange(18, 40), rng.randrange(4, 7)
        base = 150
        for y in range(base - h, H):
            ww = w * min(1, .55 + (y - base + h) / h * .8)
            for x in range(int(cx - ww), int(cx + ww) + 1):
                im.put(x, y, dither(ramp('#f0c89a', '#d8a478', '#a8785a'), (x - cx + ww) / (2 * ww + 1) * .9, x, y))
        disc(im, cx, base - h, w * .6, lambda x, y: '#8a5a44')
    vgrad(im, 150, H, ramp('#c8946a', '#a8744e'), 1)
    for _ in range(16): pine_x = rng.randrange(W); disc(im, pine_x, rng.randrange(148, 168), 2, lambda x, y: '#6a8a4a')
    pals = [('#e84a4a', '#ffd04a'), ('#4a8ae8', '#ffffff'), ('#ffa83a', '#e84a8a'), ('#5ac87a', '#ffe06a'),
            ('#a85ae8', '#ffd0f0'), ('#e8604a', '#4ab8e8')]
    for i, (x, y, r) in enumerate(((34, 40, 13), (84, 26, 9), (96, 70, 7), (60, 84, 5), (16, 92, 4), (106, 98, 3.5), (74, 54, 4))):
        a, b = pals[i % len(pals)]
        disc(im, x, y, r, lambda px_, py_, x=x, y=y, r=r, a=a, b=b:
             '#ffffff' if px_ < x - r * .4 and py_ < y - r * .4 and r > 6 and (px_ + py_) % 3 == 0 else (a if int((px_ - x) / r * 3 + 3) % 2 else b))
        for k in range(int(r * .6)):
            ww = r * .7 * (1 - k / (r * .6)); rect(im, x - ww, y + r - 1 + k, x + ww, y + r - 1 + k, b if k % 2 else a)
        by = y + r + int(r * .6) + max(1, int(r * .3))
        rect(im, x - max(1, r * .2), by, x + max(1, r * .2), by + max(1, r * .25), '#5a3a22')
    return im

SCENES = [fuji, beach, alps, desert, terraces, santorini, balloons]
NAMES = ['fuji', 'beach', 'alps', 'desert', 'terraces', 'santorini', 'balloons']

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    os.chdir(tempfile.mkdtemp())
    for fn, name in zip(SCENES, NAMES):
        fn().save(name, 4)
        subprocess.run(['magick', name + '.png', '-strip', f'PNG8:{os.path.join(OUT, name + ".png")}'], check=True)
        print(name)
