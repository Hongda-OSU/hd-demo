# card.png: the holo card's layout in night colours -- a purple border and a dark
# body, for the rainbow sheen to sweep across. The ghost cat is original.
# 126x176 grid, scaled x5 to 630x880, like design/holo-card/card.py, whose
# font and text helpers it borrows.
import math
from px import Img, ramp, dither, disc, rect
from card import text, width

PAL = {'K': '#1a0e2a', 'P': '#8a4ad8', 'p': '#5a2a98', 'L': '#c8a0ff', 'E': '#ffe14a', 'W': '#ffffff'}
# A ghost cat: pointed ears, glowing eyes, a pale belly and a wisp for legs.
half = ['............', '............', '..K.........', '..KK........', '..KPK.......', '..KLPK..KKKK',
        '..KLLPKKPPPP', '..KLPPPPPPPP', '..KPPPPPPPPP', '.KPPPPPPPPPP', '.KPPPKKKPPPP', '.KPPKEEWKPPP',
        '.KPPKEEEKPPP', '.KPPPKKKPPPP', '.KpPPPPPPPPK', '..KpPPPPPPPP', '...KpPPPLLLL', '...KpPPLLLLL',
        '...KppPLLLLL', '....KpPPLLLL', '....KpPPPPPP', '.....KpPKPPK', '......KK.KK.', '............']
CAT = [h + h[::-1] for h in half]
assert len(CAT) == 24 and all(len(r) == 24 for r in CAT)

def ghost_symbol(im, cx, cy, r):
    disc(im, cx, cy, r, lambda x, y: '#7a3ab8')
    disc(im, cx, cy, r * .55, lambda x, y: '#e8d8ff')
    disc(im, cx, cy, r * .25, lambda x, y: '#2a1040')

def card():
    im = Img(126, 176, '#4a2a7a')
    for x in range(126): im.put(x, 0, '#c8a0ff'); im.put(x, 175, '#c8a0ff')
    for y in range(176): im.put(0, y, '#c8a0ff'); im.put(125, y, '#c8a0ff')
    body = ramp('#3e2468', '#331d5a', '#2a174c', '#20113c')
    for y in range(6, 170):
        for x in range(6, 120): im.put(x, y, dither(body, (y - 6) / 164, x, y))

    text(im, 11, 10, 'WISPURR', '#f0e6ff', 1)
    text(im, 92 - width('70', 2) - width('HP') - 2, 8, 'HP', '#ff8ad8')
    text(im, 92 - width('70', 2), 8, '70', '#ff8ad8', 2)
    ghost_symbol(im, 106.5, 12.5, 5)

    rect(im, 11, 20, 114, 98, '#6a5a88'); rect(im, 12, 21, 113, 97, '#c8bce0'); rect(im, 13, 22, 112, 96, '#8a7aa8')
    sky = ramp('#e8d8ff', '#a87ae8', '#5a34a8', '#1e1040')
    cx, cy = 62.5, 55
    for y in range(23, 96):
        for x in range(14, 112):
            a = math.atan2(y - cy, x - cx); ray = int((a + math.pi) / (2 * math.pi) * 20) % 2
            im.put(x, y, dither(sky, math.hypot(x - cx, (y - cy) * 1.15) / 62 + (.08 if ray else 0), x, y))
    for y, row in enumerate(CAT):
        for x, c in enumerate(row):
            if c != '.': rect(im, 27 + x * 3, 24 + y * 3, 29 + x * 3, 26 + y * 3, PAL[c])

    rect(im, 16, 101, 109, 105, '#5a3a8a'); text(im, 19, 101, 'SHADE CAT', '#e0ccff')
    text(im, 106 - width('LV 21'), 101, 'LV 21', '#e0ccff')

    ghost_symbol(im, 18.5, 116.5, 4)
    text(im, 28, 114, 'SHADOW PAW', '#f0e6ff')
    text(im, 113 - width('30', 2), 112, '30', '#f0e6ff', 2)
    for x in range(12, 114, 2): im.put(x, 126, '#8a5ad8')
    ghost_symbol(im, 18.5, 138.5, 4); ghost_symbol(im, 28.5, 138.5, 4)
    text(im, 37, 136, 'DARK MIST', '#f0e6ff')
    text(im, 113 - width('60', 2), 134, '60', '#f0e6ff', 2)

    rect(im, 11, 150, 114, 150, '#8a5ad8')
    text(im, 13, 153, 'WEAK', '#c8b0f0'); disc(im, 34.5, 155.5, 3, lambda x, y: '#2a2a34')
    text(im, 76, 153, 'RETREAT', '#c8b0f0'); disc(im, 108.5, 155.5, 3, lambda x, y: '#ececf0')
    rect(im, 11, 161, 114, 166, '#3a2460')
    for y in (163, 165):
        for x in range(14, 110 if y == 163 else 70): im.put(x, y, '#8a6ab8')
    return im
