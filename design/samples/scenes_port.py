from px import *

def cyber():                                    # portrait-1: rainy neon street, puddle reflections
    rng = random.Random(21); im = Img(200, 300)
    vgrad(im, 0, 300, ramp('#07051a', '#140a2e', '#251040', '#3a1450'), 1.0)
    for i, (x0, w, h, c) in enumerate([(60, 26, 150, '#1a1236'), (88, 22, 120, '#150f2e'), (112, 30, 170, '#1d1440')]):
        rect(im, x0, 210 - h, x0 + w, 210, c)
        for wy in range(210 - h + 4, 206, 5):
            for wx in range(x0 + 3, x0 + w - 2, 4):
                if rng.random() < .3: im.put(wx, wy, rng.choice(['#ff5fb8', '#5fe9ff', '#ffd36b']))
    rect(im, 0, 0, 52, 214, '#0d0820'); rect(im, 148, 0, 199, 214, '#0f0924')
    for wy in range(6, 200, 7):                  # side walls' windows
        for wx in list(range(4, 48, 6)) + list(range(152, 196, 6)):
            if rng.random() < .25: rect(im, wx, wy, wx + 2, wy + 3, rng.choice(['#ffb35f', '#3a2a5e', '#5fe9ff']))
    def sign(x0, y0, x1, y1, c):
        rect(im, x0, y0, x1, y1, '#0a0618')
        for x in range(x0, x1 + 1): im.put(x, y0, c); im.put(x, y1, c)
        for y in range(y0, y1 + 1): im.put(x0, y, c); im.put(x1, y, c)
        glow(im, (x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0), c, .45)
    sign(36, 40, 50, 118, '#ff3fa4')
    for k, y in enumerate(range(48, 112, 16)):   # glyph blocks in the vertical sign
        rect(im, 40, y, 46, y + 1, '#ff8fd0'); rect(im, 42 + (k % 2) * 2, y + 2, 43 + (k % 2) * 2, y + 9, '#ff8fd0'); rect(im, 39, y + 8, 47, y + 9, '#ff8fd0')
    sign(150, 70, 190, 88, '#3fe6ff')
    for k, x in enumerate(range(155, 186, 8)): rect(im, x, 75, x + 4, 76, '#b0f6ff'); rect(im, x + (k % 3), 77, x + (k % 3) + 1, 83, '#b0f6ff')
    sign(150, 150, 172, 164, '#ffd36b')
    vgrad(im, 214, 300, ramp('#120a24', '#0a0616'), 1)
    for y in range(214, 300):                    # wet street: mirrored, broken-up reflections
        my = 214 - (y - 214) * 2
        if my < 0: break
        for x in range(200):
            if rng.random() < .8 and (y % 3 != 2):
                o = im.p[my][x]
                if sum(o) > 140:
                    im.p[y][x] = tuple(int(v * .75) for v in o)
    for x in range(0, 200, 2): im.put(x, 214, '#3a2a5e')
    ux, uy = 104, 232                             # a figure with an umbrella
    for i in range(14): rect(im, ux - i, uy - 14 + i // 2, ux + i, uy - 14 + i // 2, '#1b1530')
    rect(im, ux - 14, uy - 7, ux + 14, uy - 7, '#ff5fb8')
    rect(im, ux, uy - 7, ux, uy + 2, '#0d0a18'); rect(im, ux - 3, uy - 4, ux + 3, uy + 14, '#0d0a18')
    rect(im, ux - 3, uy + 15, ux - 2, uy + 22, '#0d0a18'); rect(im, ux + 2, uy + 15, ux + 3, uy + 22, '#0d0a18')
    for _ in range(160):                          # rain
        x, y = rng.randrange(200), rng.randrange(300)
        for k in range(3): im.put(x - k // 2, y + k, '#8090c0' if k < 2 else '#5a6494')
    im.save('portrait-1', 5)

def alley():                                    # portrait-2: lantern-lit Japanese alley at night
    rng = random.Random(31); im = Img(200, 300)
    vgrad(im, 0, 120, ramp('#0a0f2e', '#16204e', '#26326a'), 1)
    stars(im, 50, 70, rng)
    disc(im, 150, 32, 10, lambda x, y: '#f4ecd2' if (x - 147) ** 2 + (y - 30) ** 2 > 20 else '#e2d6b4')
    glow(im, 150, 32, 24, '#f4ecd2', .3)
    # left and right houses lean in toward the alley's far end
    for x in range(0, 70):
        rect(im, x, 30 + x // 3, x, 300, '#2a1812')
    for x in range(130, 200):
        rect(im, x, 30 + (199 - x) // 3, x, 300, '#24150f')
    for x in range(0, 74):                       # eaves
        for d in range(4): im.put(x, 26 + x // 3 + d, '#1a0e0a' if d < 3 else '#4a2c1e')
    for x in range(126, 200):
        for d in range(4): im.put(x, 26 + (199 - x) // 3 + d, '#1a0e0a' if d < 3 else '#4a2c1e')
    rect(im, 14, 150, 52, 220, '#3a2418')        # shoji door, warm light behind
    rect(im, 17, 153, 49, 217, '#ffd89a')
    for x in range(17, 50, 8): rect(im, x, 153, x, 217, '#8a5a36')
    for y in range(153, 218, 10): rect(im, 17, y, 49, y, '#8a5a36')
    glow(im, 33, 220, 34, '#ffc46b', .4)
    for x in range(70, 131):                     # far alley end and path
        rect(im, x, 52, x, 150, '#121a3a' if x % 9 else '#0d1430')
    for y in range(150, 300):
        half = 30 + (y - 150) * 70 // 150
        for x in range(100 - half, 100 + half):
            im.put(x, y, dither(ramp('#2e2a38', '#3a3444', '#26222e'), ((x * 7 + y * 3) % 23) / 23, x, y))
        if y % 9 == 0:
            for x in range(100 - half, 100 + half, 2): im.put(x, y, '#1c1924')
    for i, (lx, ly, r) in enumerate([(84, 60, 4), (116, 66, 4), (76, 82, 6), (124, 90, 6), (64, 112, 9), (138, 120, 9)]):
        rect(im, lx, ly - r - 6, lx, ly - r, '#120a08')
        glow(im, lx, ly, r * 4, '#ff7a4a', .45)
        disc(im, lx, ly, r, lambda x, y, lx=lx, ly=ly, r=r: '#ff9a6a' if x < lx - r / 3 and y < ly else ('#c8322a' if (y - ly) % 3 == 0 else '#e2453a'))
        rect(im, lx - r // 2, ly - r - 1, lx + r // 2, ly - r, '#120a08'); rect(im, lx - r // 2, ly + r, lx + r // 2, ly + r + 1, '#120a08')
    rect(im, 146, 186, 182, 258, '#dfe7f0'); rect(im, 149, 190, 179, 210, '#9fe7ff')   # vending machine
    for row in range(4):
        for col in range(5):
            rect(im, 151 + col * 6, 214 + row * 9, 154 + col * 6, 220 + row * 9, rng.choice(['#e2453a', '#3fa8ff', '#ffd36b', '#5fd68a', '#ffffff']))
    rect(im, 158, 250, 170, 254, '#2a2f3a'); rect(im, 146, 256, 182, 258, '#9aa6b5')
    glow(im, 164, 222, 46, '#bff3ff', .4)
    im.save('portrait-2', 5)

def forest():                                   # portrait-3: firefly forest under the moon
    rng = random.Random(41); im = Img(200, 300)
    vgrad(im, 0, 300, ramp('#061219', '#0a2230', '#0f3442', '#0b2a30', '#071a1c'), 1)
    disc(im, 132, 40, 12, lambda x, y: '#e9f5d8'); glow(im, 132, 40, 46, '#cfe8c0', .35)
    for k in range(260):                         # moonlight shafts
        x0 = 132 - k // 2
        for x in range(x0 - 6, x0 + 6):
            if bayer(x, 40 + k, .12): im.put(x, 40 + k, '#2a5a5a')
    for layer, (n, wmin, wmax, c) in enumerate([(14, 2, 4, '#12333a'), (9, 4, 8, '#0b2228'), (5, 10, 18, '#050f13')]):
        for _ in range(n):
            x = rng.randrange(-10, 200); w = rng.randint(wmin, wmax)
            if layer == 2 and 50 < x < 140: x = rng.choice([rng.randint(-8, 40), rng.randint(150, 196)])
            rect(im, x, 0, x + w, 300, c)
            if layer < 2: rect(im, x + w, 0, x + w, 300, '#1c4a4e' if layer == 0 else '#123236')
    for _ in range(26):                          # canopy blobs
        disc(im, rng.randrange(200), rng.randrange(-6, 30), rng.randint(10, 22), lambda x, y: '#04100f' if bayer(x, y, .8) else '#0a1f1c')
    for y in range(250, 300):                    # mossy ground with a path
        for x in range(200):
            p = abs(x - 100 - (y - 250) * .3) < 8 + (y - 250) * .6
            im.put(x, y, dither(ramp('#2a3a2e', '#1e2c23'), .5, x, y) if p else dither(ramp('#0f2a1c', '#0a1f15', '#08170f'), (y - 250) / 50, x, y))
    for _ in range(30):                          # ferns
        x, y = rng.randrange(200), rng.randrange(255, 300)
        for k in range(5): im.put(x + k, y - k // 2, '#1f4a2c'); im.put(x - k, y - k // 2, '#1f4a2c')
    for _ in range(46):                          # fireflies
        x, y = rng.randrange(8, 192), rng.randrange(90, 285)
        glow(im, x, y, 6, '#d8ff7a', .55); im.put(x, y, '#f4ffb0')
    im.save('portrait-3', 5)

if __name__ == '__main__':
    cyber(); alley(); forest(); print('ok')
