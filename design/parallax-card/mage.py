# mage.png: a hooded fire mage, head and shoulders, on a transparent background.
# Original character, 64x96 grid (the card's 2:3), scaled x6 to 384x576.
# Same method as design/pop-out-image/character.py: shapes filled back to front,
# shaded from the top left, outlined dark at the silhouette and in each part's
# own line colour where it overlaps another.
import math

W, H = 64, 96
RAMPS = {  # highlight, base, shadow, line
    'skin':  ('#ffe2c8', '#f4bf98', '#d4906e', '#9a5a48'),
    'hair':  ('#ffc46a', '#f07a2a', '#b84a1c', '#6a240e'),
    'hood':  ('#d4505a', '#982a3a', '#601828', '#2e0a14'),
    'inner': ('#2a1418', '#1e0e12', '#160a0e', '#0a0406'),
    'coat':  ('#4c4c66', '#2c2c40', '#1c1c2a', '#0c0c14'),
    'gold':  ('#fff2a8', '#e6b94a', '#a8782a', '#5a3c14'),
    'ember': ('#fff6c8', '#ffb03a', '#e0602a', '#7a2410'),
}
OUTLINE = '#0a0a12'
TRIM = [(6.5, 69.5), (20, 75.2), (32, 71.3), (44, 75.2), (57.5, 69.5)]

region = [[None] * W for _ in range(H)]
z = [[-1] * W for _ in range(H)]
order = 0

def shape(part, inside):
    global order
    order += 1
    for y in range(H):
        for x in range(W):
            if inside(x + .5, y + .5): region[y][x], z[y][x] = part, order

def ellipse(part, cx, cy, rx, ry): shape(part, lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1)
def poly(part, pts):
    def inside(x, y):
        c = False
        for (ax, ay), (bx, by) in zip(pts, pts[1:] + pts[:1]):
            if (ay > y) != (by > y) and x < ax + (y - ay) * (bx - ax) / (by - ay): c = not c
        return c
    shape(part, inside)
def segment(part, ax, ay, bx, by, r):
    def inside(x, y):
        dx, dy = bx - ax, by - ay
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
        return math.hypot(x - ax - t * dx, y - ay - t * dy) <= r
    shape(part, inside)

def draw():
    # cloak body, then the hood and its capelet over the shoulders
    poly('coat', [(4, 96), (8, 70), (18, 58), (32, 54), (46, 58), (56, 70), (60, 96)])
    poly('hood', [(12, 52), (32, 58), (52, 52), (58, 70), (44, 76), (32, 72), (20, 76), (6, 70)])
    ellipse('hood', 32, 34, 16, 17.5)
    poly('hood', [(19, 26), (14, 6), (30, 18)])               # the peak, swept back by the wind
    ellipse('inner', 32, 38, 12, 14)
    # loose locks escaping the hood on the windward side
    poly('hair', [(22, 38), (11, 47), (17, 46), (12, 56), (21, 49), (24, 46)])
    poly('hair', [(42, 38), (47, 50), (44, 49), (45, 55), (40, 47)])
    ellipse('skin', 32, 39, 8.5, 9.5)
    poly('skin', [(23.8, 40), (40.2, 40), (36, 48.5), (28, 48.5)])
    # a jagged fringe across the brow
    poly('hair', [(21, 32), (24, 26), (32, 23.5), (40, 26), (43, 32), (43, 41), (40.5, 35), (38.5, 38),
                  (36, 34.5), (33.5, 37.5), (31, 34), (28, 38), (26, 34.5), (23.5, 40), (21, 41)])
    for a, b in zip(TRIM, TRIM[1:]): segment('gold', *a, *b, .8)   # trim along the capelet's hem
    # high collar, gold-trimmed opening, and the clasp
    poly('coat', [(22, 52), (32, 60), (42, 52), (44, 60), (32, 67), (20, 60)])
    poly('inner', [(29, 66), (35, 66), (38, 96), (26, 96)])
    segment('gold', 28.5, 66, 25.3, 96, .9)
    segment('gold', 35.5, 66, 38.7, 96, .9)
    ellipse('gold', 32, 64, 3.2, 3)
    ellipse('ember', 32, 64, 1.6, 1.6)

def shade():
    px = [[None] * W for _ in range(H)]
    at = lambda x, y: region[y][x] if 0 <= x < W and 0 <= y < H else None
    for y in range(H):
        for x in range(W):
            p = region[y][x]
            if p is None: continue
            hi, mid, lo, line = RAMPS[p]
            nbrs = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
            if any(at(*n) is None for n in nbrs): c = OUTLINE
            elif any(at(*n) != p and z[n[1]][n[0]] < z[y][x] for n in nbrs): c = line
            elif at(x - 1, y) != p or at(x, y - 1) != p: c = hi
            elif at(x + 1, y) != p or at(x, y + 1) != p or at(x + 2, y) != p or at(x, y + 2) != p: c = lo
            else: c = mid
            px[y][x] = c
    return px

def details(px):
    def put(x, y, c): px[y][x] = c
    # open eyes, amber with a bright glint, under a dark lash line
    for x0, d in ((26, 1), (37, -1)):
        for i in range(4): put(x0 + d * i, 40, OUTLINE)
        put(x0, 41, OUTLINE)
        put(x0 + d, 41, '#fff6c8'); put(x0 + 2 * d, 41, '#ffb03a')
        put(x0 + d, 42, '#e0602a'); put(x0 + 2 * d, 42, '#7a2410')
    put(31, 46, '#b86a58'); put(32, 46, '#b86a58')
    for x in range(28, 37): put(x, 49, '#d4906e')   # shadow under the chin
    # stray embers drifting off the cloak
    for x, y, c in ((9, 60, '#ffb03a'), (6, 52, '#e0602a'), (55, 58, '#ffb03a'), (58, 49, '#fff6c8'),
                    (50, 44, '#e0602a'), (12, 40, '#fff6c8'), (4, 66, '#e0602a')):
        put(x, y, c)
    return px

def mage():
    draw()
    return details(shade())
