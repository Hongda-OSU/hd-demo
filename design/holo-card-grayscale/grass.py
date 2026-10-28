# card.png and frog.png: the holo card's layout in grass colours, split in two
# layers like the demo's own -- the card without its creature, and the creature
# alone on a transparent ground, in the same place. The sprout frog is original.
# 126x176 grid, scaled x5 to 630x880 -- a real card's 63:88, like the group's
# other cards. Font and text helpers come from design/holo-card/card.py.
import math
from px import Img, ramp, dither, disc, rect
from card import text, width

W, H = 126, 176
PAL = {'K': '#1a2a14', 'G': '#5cc04a', 'g': '#2e8a3a', 'L': '#d8f0a0', 'W': '#ffffff',
       'p': '#ff9aa2', 'S': '#2e9a3a', 's': '#1e5a1a'}
# A sprout frog: bulging eyes, a wide grin, a pale belly and a leaf on its head.
half = ['............', '.....SSS....', '....SSSSS...', '.....SSSSS.s', '.........S.s', '...........s',
        '..KKKK.....s', '.KWWWWK.KKKK', '.KWKKWKKGGGG', '.KWKKWKGGGGG', '.KWWWWKGGGGG', '..KKKKGGGGGG',
        '.KGGGGGGGGGG', 'KGGGGGGGGGGG', 'KGpGGGGGGGGG', 'KGGGGKKKKKKK', 'KgGGGGLLLLLL', '.KgGGLLLLLLL',
        '.KgGLLLLLLLL', '..KgGLLLLLLL', '..KgGGLLLLLL', '.KGGKKgGGGGG', '.KKK..KKKKKK', '............']
FROG = [h + h[::-1] for h in half]
assert len(FROG) == 24 and all(len(r) == 24 for r in FROG)

def leaf_symbol(im, cx, cy, r):
    disc(im, cx, cy, r, lambda x, y: '#3a9a2a')
    disc(im, cx - r * .15, cy + r * .1, r * .5, lambda x, y: '#c8f08a')

def card():
    im = Img(W, H, '#3a8a3a')
    for x in range(W): im.put(x, 0, '#9ae07a'); im.put(x, H - 1, '#9ae07a')
    for y in range(H): im.put(0, y, '#9ae07a'); im.put(W - 1, y, '#9ae07a')
    body = ramp('#e8f8cc', '#cdeea2', '#aedc7c', '#8cc862')
    for y in range(6, H - 6):
        for x in range(6, 120): im.put(x, y, dither(body, (y - 6) / (H - 12), x, y))

    text(im, 11, 10, 'FERNTOAD', '#1a2a14', 1)
    text(im, 92 - width('60', 2) - width('HP') - 2, 8, 'HP', '#c0302a')
    text(im, 92 - width('60', 2), 8, '60', '#c0302a', 2)
    leaf_symbol(im, 106.5, 12.5, 5)

    rect(im, 11, 20, 114, 98, '#7a8a6a'); rect(im, 12, 21, 113, 97, '#e4ecd8'); rect(im, 13, 22, 112, 96, '#a2b090')
    sky = ramp('#f6ffe0', '#d2f29a', '#94d862', '#3e9c4c')
    cx, cy = 62.5, 55
    for y in range(23, 96):
        for x in range(14, 112):
            a = math.atan2(y - cy, x - cx); ray = int((a + math.pi) / (2 * math.pi) * 20) % 2
            im.put(x, y, dither(sky, math.hypot(x - cx, (y - cy) * 1.15) / 62 + (.08 if ray else 0), x, y))

    rect(im, 16, 101, 109, 105, '#9ccc6a'); text(im, 19, 101, 'SEED TOAD', '#2a5a20')
    text(im, 106 - width('LV 10'), 101, 'LV 10', '#2a5a20')

    leaf_symbol(im, 18.5, 116.5, 4)
    text(im, 28, 114, 'VINE WHIP', '#1a2a14')
    text(im, 113 - width('20', 2), 112, '20', '#1a2a14', 2)
    for x in range(12, 114, 2): im.put(x, 126, '#3a8a3a')
    leaf_symbol(im, 18.5, 138.5, 4); leaf_symbol(im, 28.5, 138.5, 4)
    text(im, 37, 136, 'SOLAR SEED', '#1a2a14')
    text(im, 113 - width('50', 2), 134, '50', '#1a2a14', 2)

    rect(im, 11, 150, 114, 150, '#3a8a3a')
    text(im, 13, 153, 'WEAK', '#2a4a20'); disc(im, 34.5, 155.5, 3, lambda x, y: '#e0402a')
    text(im, 76, 153, 'RETREAT', '#2a4a20'); disc(im, 108.5, 155.5, 3, lambda x, y: '#ececf0')
    rect(im, 11, 161, 114, 166, '#f2fbe2')
    for y in (163, 165):
        for x in range(14, 110 if y == 163 else 70): im.put(x, y, '#a6c88a')
    return im

def frog():  # the creature layer: a grid of colours, None where the card shows through
    px = [[None] * W for _ in range(H)]
    for y, row in enumerate(FROG):
        for x, c in enumerate(row):
            if c == '.': continue
            for dy in range(3):
                for dx in range(3): px[24 + y * 3 + dy][27 + x * 3 + dx] = PAL[c]
    return px
