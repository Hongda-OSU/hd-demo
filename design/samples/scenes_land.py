from px import *

def aurora():                                   # landscape-2: aurora over snowy peaks, a lit cabin
    rng = random.Random(11); im = Img(320, 200)
    vgrad(im, 0, 150, ramp('#04081a', '#0a1634', '#112a52', '#1a4366', '#25586e'), 1.1)
    stars(im, 220, 110, rng, big=6)
    ar = ramp('#c8ffe9', '#5df5b8', '#23b886', '#147a63')
    for x in range(320):
        top = 34 + 14 * math.sin(x * .028) + 7 * math.sin(x * .071 + 1.3) + 4 * math.sin(x * .17)
        L = 30 + 10 * math.sin(x * .05 + 2)
        for d in range(int(L)):
            t = d / L
            if bayer(x, int(top + d), 1 - t * 1.05):
                im.put(x, top + d, dither(ar, t, x, int(top + d)))
        if bayer(x, int(top), .5): im.put(x, top - 1, '#a98bff')
    far = [118 - 34 * abs(((x * .021 + .3) % 2) - 1) - 14 * abs(((x * .053 + .7) % 2) - 1) - 3 * math.sin(x * .3) for x in range(320)]
    fill_below(im, far, None, 175, lambda x, y, d: '#e6eeff' if d < 4 + 3 * math.sin(x * .3) else ('#3a5280' if bayer(x, y, .3) else '#2b3f68'))
    near = [150 - 18 * abs(((x * .017 + 1.1) % 2) - 1) - 8 * abs(((x * .061) % 2) - 1) for x in range(320)]
    fill_below(im, near, None, 178, lambda x, y, d: '#c3d4f0' if d < 3 else '#17223f')
    vgrad(im, 172, 200, ramp('#d6e2f6', '#a9bde0', '#8aa2cc'), 1)
    for tx in (14, 40, 62, 270, 292, 312, 250):  # pines
        h = rng.randint(22, 34)
        for i in range(h):
            w = (i * 7) // h
            for dx in range(-w, w + 1): im.put(tx + dx, 182 - h + i, '#0b1428' if (i + dx) % 5 else '#1a2a44')
        rect(im, tx, 182, tx, 185, '#0b1428')
    rect(im, 196, 166, 222, 180, '#3a2418'); rect(im, 196, 180, 222, 181, '#2a190f')
    for i in range(8): rect(im, 194 + i, 166 - i, 224 - i, 166 - i, '#e6eeff' if i < 2 else '#5a3826')
    rect(im, 203, 170, 208, 175, '#ffcf6b'); rect(im, 214, 172, 218, 180, '#24150c')
    glow(im, 205, 178, 18, '#ffcf6b', .5)
    rect(im, 216, 150, 218, 160, '#2a190f')
    for i in range(5): im.put(217 + i % 2, 148 - i * 3, '#9fb3d6')
    im.save('landscape-2', 5)

def desert():                                   # landscape-3: ruins on the dunes under two moons
    rng = random.Random(5); im = Img(320, 200)
    vgrad(im, 0, 200, ramp('#151d3a', '#2d3a62', '#5f5c86', '#a9708a', '#e2937a', '#f6bd84', '#f6bd84'), 1.0)
    stars(im, 120, 70, rng)
    disc(im, 236, 52, 22, lambda x, y: '#efe1c3' if (x - 230) ** 2 + (y - 46) ** 2 > 60 or bayer(x, y, .2) else '#d8c6a2')
    for cx, cy, r in ((228, 58, 3), (244, 46, 2), (240, 62, 2)):
        disc(im, cx, cy, r, lambda x, y: '#cdb993')
    glow(im, 236, 52, 40, '#f6e7c8', .35)
    disc(im, 276, 30, 8, lambda x, y: '#bcd3ee' if x < 279 else '#8fa9cc')
    d1 = ridge(320, 132, [(.012, 10), (.031, 5)], 7)
    fill_below(im, d1, None, None, lambda x, y, d: '#d79a63' if d < 2 else ('#c2844f' if bayer(x, y, .4) else '#b4773f'))
    cols = [(52, 34), (66, 28), (80, 36), (94, 14), (108, 31)]
    for cx, h in cols:
        base = int(d1[cx]) + 2
        rect(im, cx, base - h, cx + 6, base, '#6e452c'); rect(im, cx + 5, base - h, cx + 6, base, '#4a2d1c')
        rect(im, cx - 1, base - h - 2, cx + 7, base - h, '#7e5236')
    b = int(d1[80]) + 2
    rect(im, 52, b - 40, 114, b - 36, '#7e5236')                      # lintel
    for x in range(100, 116): im.put(x, b - 41 + (x - 100) // 3, dither(ramp('#f6bd84', '#e2937a'), .5, x, b))  # broken end
    d2 = ridge(320, 160, [(.009, 12), (.027, 6), (.06, 2)], 8)
    fill_below(im, d2, None, None, lambda x, y, d: '#c98a55' if d < 2 else ('#9c6136' if bayer(x, y, .35) else '#8a5330'))
    d3 = ridge(320, 184, [(.015, 7), (.04, 3)], 9)
    fill_below(im, d3, None, None, lambda x, y, d: '#a96c3e' if d < 2 else ('#6e3f22' if bayer(x, y, .3) else '#5c331b'))
    for _ in range(40):                          # wind-blown sand specks
        x, y = rng.randrange(320), rng.randrange(150, 200); im.put(x, y, '#e8b27a')
    im.save('landscape-3', 5)

if __name__ == '__main__':
    aurora(); desert(); print('ok')
