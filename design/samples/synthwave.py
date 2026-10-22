# landscape-1: 320x200 synthwave sunset over a city, ordered-dithered gradients -> synthwave.ppm
import math, random
random.seed(7)
W, H, HOR = 320, 200, 128
def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
def dither(ramp, t, x, y):
    t = max(0.0, min(0.9999, t)) * (len(ramp) - 1)
    i, f = int(t), t - int(t)
    return ramp[i + 1] if f * 16 > BAYER[y % 4][x % 4] + 0.5 else ramp[i]
img = [[(0, 0, 0)] * W for _ in range(H)]
sky = [hx(c) for c in ('#140826', '#2b0f45', '#561a5e', '#93285f', '#d9465f', '#f7845a', '#ffc46b')]
for y in range(HOR):
    for x in range(W):
        img[y][x] = dither(sky, (y / HOR) ** 1.25, x, y)
for _ in range(260):                                     # stars
    x, y = random.randrange(W), random.randrange(70)
    img[y][x] = hx('#ffe9f5') if random.random() < .7 else hx('#9fe3ff')
sun = [hx(c) for c in ('#ffe27a', '#ffb36b', '#ff7a7a', '#ff4f8f')]
cx, cy, R = 160, 98, 44
for y in range(cy - R, HOR):
    for x in range(cx - R, cx + R + 1):
        if (x - cx) ** 2 + (y - cy) ** 2 <= R * R:
            d = y - cy
            if d > -4 and (d + 4) % max(2, 9 - (d + 4) // 5) < 1 + (d + 4) // 9:
                continue                                 # the striped lower half
            img[y][x] = dither(sun, (y - (cy - R)) / (2 * R), x, y)
def ridge(base, amp, freqs, seed):
    r = random.Random(seed)
    ph = [r.random() * 6.28 for _ in freqs]
    return [base - sum(a * math.sin(x * f + p) for (f, a), p in zip(freqs, ph)) * amp for x in range(W)]
for top, col in ((ridge(108, 1, [(.021, 9), (.057, 4), (.13, 1.5)], 1), '#3b1652'),
                 (ridge(117, 1, [(.017, 7), (.071, 3), (.19, 1.2)], 2), '#26103d')):
    c = hx(col)
    for x in range(W):
        for y in range(int(top[x]), HOR):
            img[y][x] = c
x = 0
while x < W:                                             # skyline with lit windows
    w = random.randint(9, 22); h = random.randint(14, 52)
    if abs(x + w / 2 - cx) < 30: h = random.randint(8, 18)
    for yy in range(HOR - h, HOR):
        for xx in range(x, min(W, x + w)):
            img[yy][xx] = hx('#0f0619')
    for wy in range(HOR - h + 3, HOR - 2, 4):
        for wx in range(x + 2, min(W, x + w) - 2, 3):
            if random.random() < .33:
                img[wy][wx] = hx('#ffcf6b') if random.random() < .75 else hx('#6bd8ff')
    if random.random() < .25 and h > 30:                 # rooftop antenna light
        img[HOR - h - 3][x + w // 2] = hx('#ff4f8f')
        for yy in range(HOR - h - 2, HOR - h): img[yy][x + w // 2] = hx('#0f0619')
    x += w + random.randint(0, 2)
water = [hx(c) for c in ('#1b0c33', '#0d0619')]
for y in range(HOR, H):
    for x in range(W):
        img[y][x] = dither(water, (y - HOR) / (H - HOR), x, y)
    if (y - HOR) % 3 == 1:                               # sun reflection, breaking up with depth
        spread = R - (y - HOR) // 2
        for x in range(cx - spread, cx + spread):
            if random.random() < .55 - (y - HOR) / 160:
                img[y][x] = sun[min(3, (y - HOR) // 18)]
    if random.random() < .5:                             # window glints on the water
        gx = random.randrange(W)
        if abs(gx - cx) > R:
            img[y][gx] = hx('#ffcf6b') if random.random() < .7 else hx('#6bd8ff')
with open('synthwave.ppm', 'wb') as f:
    f.write(f'P6 {W} {H} 255\n'.encode())
    f.write(bytes(v for row in img for px in row for v in px))
print('ok')
