# card.png: a pixel-art monster card in the classic trading-card layout -- yellow border,
# name and HP, framed art, two moves, weakness and retreat. The creature is original.
# 126x176 grid, scaled x5 to 630x880 -- the 63:88 ratio of a real card.
import math
from px import Img, ramp, dither, disc, rect

FONT = {
    'A': ['.#.', '#.#', '###', '#.#', '#.#'], 'B': ['##.', '#.#', '##.', '#.#', '##.'],
    'C': ['.##', '#..', '#..', '#..', '.##'], 'D': ['##.', '#.#', '#.#', '#.#', '##.'],
    'E': ['###', '#..', '##.', '#..', '###'], 'F': ['###', '#..', '##.', '#..', '#..'],
    'H': ['#.#', '#.#', '###', '#.#', '#.#'], 'I': ['###', '.#.', '.#.', '.#.', '###'],
    'K': ['#.#', '#.#', '##.', '#.#', '#.#'], 'L': ['#..', '#..', '#..', '#..', '###'],
    'M': ['#...#', '##.##', '#.#.#', '#...#', '#...#'], 'N': ['#..#', '##.#', '#.##', '#..#', '#..#'],
    'O': ['.#.', '#.#', '#.#', '#.#', '.#.'], 'P': ['##.', '#.#', '##.', '#..', '#..'],
    'R': ['##.', '#.#', '##.', '#.#', '#.#'], 'S': ['.##', '#..', '.#.', '..#', '##.'],
    'T': ['###', '.#.', '.#.', '.#.', '.#.'], 'U': ['#.#', '#.#', '#.#', '#.#', '###'],
    'V': ['#.#', '#.#', '#.#', '#.#', '.#.'], 'W': ['#...#', '#...#', '#.#.#', '##.##', '#...#'], 'X': ['#.#', '#.#', '.#.', '#.#', '#.#'],
    'Y': ['#.#', '#.#', '.#.', '.#.', '.#.'], ' ': ['.', '.', '.', '.', '.'], '+': ['...', '.#.', '###', '.#.', '...'],
    '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'],
    '2': ['##.', '..#', '.#.', '#..', '###'], '3': ['##.', '..#', '.#.', '..#', '##.'],
    '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '##.', '..#', '##.'],
    '6': ['.##', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'],
    '8': ['###', '#.#', '###', '#.#', '###'], '9': ['###', '#.#', '###', '..#', '##.'],
}
def text(im, x, y, s, c, k=1):
    for ch in s:
        g = FONT[ch]
        for dy, row in enumerate(g):
            for dx, v in enumerate(row):
                if v == '#': rect(im, x + dx * k, y + dy * k, x + dx * k + k - 1, y + dy * k + k - 1, c)
        x += (len(g[0]) + 1) * k
def width(s, k=1): return sum(len(FONT[ch][0]) + 1 for ch in s) * k - k

PAL = {'K': '#2a1a14', 'O': '#ee7a2c', 'o': '#b9481d', 'Y': '#ffe4ae', 'W': '#ffffff',
       'R': '#e0402a', 'y': '#ffd23f', 'p': '#ff9aa2'}
# A fire fox kit: flame tuft between the ears, flame-tipped tail on its right.
half = ['............', '..........y.', '..K......yR.', '..KK....yRO.', '..KOK...ROR.', '..KpoK.KKKKK',
        '..KppoKOOOOO', '..KpoOOOOOOO', '..KoOOOOOOOO', '.KOOOOOOOOOO', '.KOOOKKOOOOO', '.KOOOKWOOOOO',
        '.KOYYKKOOOOO', '.KYYYYYYYYYK', '..KYYYYYYYKY', '...KKYYYYYYY', '....KOOOYYYY', '...KOOOOYYYY',
        '...KOOOOYYYY', '..KOOOOOYYYY', '..KOOKOOOYYY', '..KYYKOOOOOO', '..KKKKKKKKKK', '............']
FOX = [list(h + h[::-1]) for h in half]
for (y, x), c in {(14, 22): 'y', (15, 21): 'y', (15, 22): 'R', (15, 23): 'y', (16, 21): 'R', (16, 22): 'O',
                  (16, 23): 'R', (17, 21): 'O', (17, 22): 'R', (17, 23): 'O', (18, 22): 'o'}.items():
    FOX[y][x] = c
assert len(FOX) == 24 and all(len(r) == 24 for r in FOX)

def fire_symbol(im, cx, cy, r):
    disc(im, cx, cy, r, lambda x, y: '#d8402a')
    disc(im, cx, cy + r * .25, r * .5, lambda x, y: '#ffd23f')
    disc(im, cx, cy - r * .2, r * .3, lambda x, y: '#ffd23f')

def card():
    im = Img(126, 176, '#f4d03f')
    for x in range(126): im.put(x, 0, '#c9a227'); im.put(x, 175, '#c9a227')
    for y in range(176): im.put(0, y, '#c9a227'); im.put(125, y, '#c9a227')
    body = ramp('#fbe3b8', '#f8c48a', '#f2a062', '#e87a44')
    for y in range(6, 170):
        for x in range(6, 120): im.put(x, y, dither(body, (y - 6) / 164, x, y))

    text(im, 11, 10, 'FLAREKIT', '#2a1a14', 1)
    text(im, 92 - width('60', 2) - width('HP') - 2, 8, 'HP', '#c0302a')
    text(im, 92 - width('60', 2), 8, '60', '#c0302a', 2)
    fire_symbol(im, 106.5, 12.5, 5)

    rect(im, 11, 20, 114, 98, '#8a8a94'); rect(im, 12, 21, 113, 97, '#e4e4ea'); rect(im, 13, 22, 112, 96, '#a8a8b2')
    sky = ramp('#fff6d0', '#ffd98a', '#ffac5c', '#e8643a')
    cx, cy = 62.5, 55
    for y in range(23, 96):
        for x in range(14, 112):
            a = math.atan2(y - cy, x - cx); ray = int((a + math.pi) / (2 * math.pi) * 20) % 2
            im.put(x, y, dither(sky, math.hypot(x - cx, (y - cy) * 1.15) / 62 + (.08 if ray else 0), x, y))
    for y, row in enumerate(FOX):
        for x, c in enumerate(row):
            if c != '.': rect(im, 27 + x * 3, 24 + y * 3, 29 + x * 3, 26 + y * 3, PAL[c])

    rect(im, 16, 101, 109, 105, '#e9c27a'); text(im, 19, 101, 'FIRE FOX', '#7a4a20')
    text(im, 106 - width('LV 12'), 101, 'LV 12', '#7a4a20')

    fire_symbol(im, 18.5, 116.5, 4)
    text(im, 28, 114, 'EMBER', '#2a1a14')
    text(im, 113 - width('20', 2), 112, '20', '#2a1a14', 2)
    for x in range(12, 114, 2): im.put(x, 126, '#b9481d')
    fire_symbol(im, 18.5, 138.5, 4); fire_symbol(im, 28.5, 138.5, 4)
    text(im, 37, 136, 'FLAME TAIL', '#2a1a14')
    text(im, 113 - width('50', 2), 134, '50', '#2a1a14', 2)

    rect(im, 11, 150, 114, 150, '#b9481d')
    text(im, 13, 153, 'WEAK', '#5a3a20'); disc(im, 34.5, 155.5, 3, lambda x, y: '#3a8ad8')
    text(im, 76, 153, 'RETREAT', '#5a3a20'); disc(im, 108.5, 155.5, 3, lambda x, y: '#ececf0')
    rect(im, 11, 161, 114, 166, '#fff1d6')
    for y in (163, 165):
        for x in range(14, 110 if y == 163 else 70): im.put(x, y, '#c9a27a')
    return im
