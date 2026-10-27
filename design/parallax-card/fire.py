# fire.gif: a looping pixel flame on a transparent background, 25x25 grid.
# Each row of the flame sways and narrows towards a flickering tip; a hot core
# sits inside an orange body and a red rim.
import math, random

N, FRAMES = 25, 8
RIM, BODY, CORE, TIP = '#d8401c', '#ff8a2a', '#ffd84a', '#fff6c8'

def frame(f):
    t = 2 * math.pi * f / FRAMES
    rng = random.Random(f * 7 + 3)
    px = [[None] * N for _ in range(N)]
    top = 4 + 1.5 * math.sin(t)                       # where the tip reaches this frame
    for y in range(N):
        h = (y - top) / (N - 1 - top)                 # 0 at the tip, 1 at the base
        if h < 0: continue
        sway = 2.2 * (1 - h) ** 1.5 * math.sin(t + h * 3)
        half = 8.5 * math.sin(h * math.pi * .82) ** .8    # a teardrop: widest low, rounded base
        for x in range(N):
            d = abs(x + .5 - (N / 2 + sway)) / max(half, .01)
            d += .18 * (rng.random() - .5)            # ragged edges
            if d > 1: continue
            heat = math.hypot(d, (h - .78) * 2.2)        # hottest just above the base
            px[y][x] = TIP if heat < .3 else CORE if heat < .62 else BODY if d < .8 else RIM
    # sparks that rise and fade over the loop
    for sx, phase in ((7, 0), (16, .4), (11, .7)):
        p = (f / FRAMES + phase) % 1
        y = int(round(top - 1 - p * 5))
        x = sx + int(round(math.sin(t + phase * 6)))
        if 0 <= y < N and p < .8: px[y][x] = CORE if p < .4 else RIM
    return px

def frames(): return [frame(f) for f in range(FRAMES)]
