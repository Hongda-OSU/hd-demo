# character.png: a pixel-art swordsman on a transparent background, for pop-out
# effects. Original character, 64x96 grid, scaled x6 to 384x576.
# Parts are filled as shapes back to front, then shaded from the top left and
# outlined: dark at the silhouette, each part's own line colour where it overlaps.
import math, subprocess

W, H = 64, 96
RAMPS = {  # highlight, base, shadow, line
    'skin':  ('#ffe2c8', '#f4bf98', '#d4906e', '#9a5a48'),
    'hair':  ('#ffffff', '#d6dae6', '#9ca2ba', '#5a5e78'),
    'coat':  ('#4c4c66', '#2c2c40', '#1c1c2a', '#0c0c14'),
    'scarf': ('#ff5e4c', '#d4282e', '#8a1420', '#4a0a14'),
    'steel': ('#ffffff', '#bcc4d0', '#6a7484', '#343a48'),
    'plate': ('#ffffff', '#bcc4d0', '#6a7484', '#343a48'),
    'shirt': ('#6a6a7a', '#464656', '#30303c', '#16161e'),
    'pants': ('#5a5a6a', '#3a3a48', '#262630', '#14141c'),
    'lthr':  ('#74625e', '#463a3a', '#2c2222', '#140e0e'),
    'gold':  ('#fff2a8', '#e6b94a', '#a8782a', '#5a3c14'),
    'blade': ('#ffffff', '#e2eaf4', '#8a9ab0', '#2a3040'),
}
OUTLINE = '#0a0a12'

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
def rect(part, x0, y0, x1, y1): shape(part, lambda x, y: x0 <= x <= x1 and y0 <= y <= y1)
def poly(part, pts):
    def inside(x, y):
        c = False
        for (ax, ay), (bx, by) in zip(pts, pts[1:] + pts[:1]):
            if (ay > y) != (by > y) and x < ax + (y - ay) * (bx - ax) / (by - ay): c = not c
        return c
    shape(part, inside)
def segment(part, ax, ay, bx, by, r0, r1=None):  # a capsule, optionally tapering from r0 to r1
    r1 = r0 if r1 is None else r1
    def inside(x, y):
        dx, dy = bx - ax, by - ay
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
        return math.hypot(x - ax - t * dx, y - ay - t * dy) <= r0 + (r1 - r0) * t
    shape(part, inside)
def limb(part, pts, r0, r1=None):
    for a, b in zip(pts, pts[1:]): segment(part, *a, *b, r0, r1)

def draw():
    # the wind blows to the left: scarf tails, coat tail and hair all stream that way
    poly('scarf', [(28, 22), (15, 19), (6, 22), (16, 24.5), (28, 26)])
    poly('scarf', [(28, 25), (13, 28), (5, 34), (16, 31), (29, 28.5)])
    for spike in ([(27, 7), (16, 5), (25, 12)], [(26, 11), (14, 13), (26, 17)], [(26, 15), (19, 21), (28, 19)],
                  [(28, 5), (24, -1), (33, 4)], [(32, 4), (39, 0), (38, 7)]):
        poly('hair', spike)
    ellipse('hair', 32, 12, 8.5, 9)
    limb('pants', [(29, 51), (25, 71), (23, 80)], 3.2)
    limb('pants', [(35, 51), (39, 71), (41, 80)], 3.2)
    limb('lthr', [(24, 74), (22, 88)], 3.4)
    limb('lthr', [(40, 74), (42, 88)], 3.4)
    poly('lthr', [(16, 87), (25, 85.5), (26, 92.5), (15, 92.5)])
    poly('lthr', [(39, 85.5), (48, 87), (49, 92.5), (38, 92.5)])
    poly('coat', [(34, 46), (40, 46), (47, 79), (37, 75)])
    poly('coat', [(24, 46), (31, 46), (27, 77), (12, 84)])
    poly('coat', [(23, 27), (41, 27), (39, 50), (25, 50)])
    poly('shirt', [(30, 27), (34, 27), (34, 47), (30, 47)])
    rect('lthr', 25, 45.5, 39, 48.5)
    rect('steel', 30, 45, 34, 49)
    limb('coat', [(40, 30), (43.5, 42), (43, 49)], 2.8)
    limb('lthr', [(43.2, 46), (42.8, 53)], 2.6)
    ellipse('skin', 42.8, 55, 2.4, 2.3)
    for cy, rx, part in ((28.5, 6, 'steel'), (31.5, 5.2, 'plate'), (34, 4.2, 'steel')):   # one shoulder only
        ellipse(part, 41.5, cy, rx, 3.2)
    limb('coat', [(24, 30), (20, 41), (18, 47)], 2.8)
    limb('lthr', [(18.8, 45), (17.2, 53)], 2.6)
    segment('skin', 30, 20, 34, 26, 2.6)
    ellipse('scarf', 32, 24.5, 6.8, 3.2)
    ellipse('skin', 32, 14.5, 6, 7)
    poly('skin', [(26.5, 16), (37.5, 16), (34, 22.5), (30, 22.5)])
    poly('hair', [(24, 5), (40.5, 5), (40.5, 12), (38, 11), (35.5, 14), (33.5, 11), (30.5, 17.5), (28.5, 12),
                  (25.5, 16), (24, 13)])
    # the sword, held low and angled out to the left
    segment('blade', 15.6, 58, 4, 93, 2.5, .7)
    segment('gold', 12.4, 56.6, 19.2, 59, 1.2)
    segment('lthr', 17.6, 51, 16, 56.5, 1.3)
    ellipse('gold', 18.1, 49.6, 1.6, 1.6)
    ellipse('skin', 16.9, 54.6, 2.5, 2.4)

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
    # sharp eyes under the fringe: a slanted lash line, white, red iris with a glint
    for x in (28, 29, 30): put(x, 15, OUTLINE)
    put(27, 14, OUTLINE)
    put(28, 16, '#ffffff'); put(29, 16, '#c0283a'); put(30, 16, '#7a1420')
    for x in (34, 35, 36): put(x, 15, OUTLINE)
    put(37, 14, OUTLINE)
    put(36, 16, '#ffffff'); put(35, 16, '#c0283a'); put(34, 16, '#7a1420')
    put(29, 16, '#ff6a5a'); put(35, 16, '#ff6a5a')
    put(31, 20, '#b86a58'); put(32, 20, '#b86a58')
    for x in range(29, 36): put(x, 22, '#d4906e')   # shadow under the chin
    return px

def character(path, scale=6):
    draw(); px = details(shade())
    with open(path + '.pam', 'wb') as f:
        f.write(f'P7\nWIDTH {W}\nHEIGHT {H}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n'.encode())
        for row in px:
            for c in row:
                f.write(bytes([0, 0, 0, 0]) if c is None else bytes(int(c[i:i + 2], 16) for i in (1, 3, 5)) + b'\xff')
    subprocess.run(['magick', path + '.pam', '-filter', 'point', '-resize', f'{scale * 100}%', path + '.png'], check=True)
