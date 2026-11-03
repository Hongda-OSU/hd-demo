# frame1.png ... frame20.png: a little ghost, the animated cursor's frames.
# Original creature on a transparent background, 25x25 grid scaled x2 to 50x50.
# Its wispy tail tapers to a point up and to the left, like an arrow cursor;
# that point stays put (it is the hotspot) while the tail waves, the head bobs
# and it blinks once a loop.
#
# Run from anywhere: python3 design/animated-cursor/ghost.py  (needs ImageMagick 7)
import math, os, subprocess

N, FRAMES, SCALE = 25, 20, 2
TIP = (2.0, 2.0)
HEAD = (15.0, 15.5)
R = 6.6
OUTLINE = (42, 47, 69)
BODY = (246, 248, 255)
SHADE = (196, 210, 240)
CHEEK = (255, 176, 196)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'src', 'demos', 'html', 'animated-cursor', 'images'))


def shape(f):
    """Head centre and a test for whether a point is inside the ghost."""
    phase = f * math.tau / FRAMES
    ax, ay = HEAD[0] - TIP[0], HEAD[1] - TIP[1]
    length = math.hypot(ax, ay)
    ux, uy = ax / length, ay / length
    nx, ny = -uy, ux
    # The head bobs across the tail's axis; the tip never moves.
    bob = 0.7 * math.sin(phase)
    hx, hy = HEAD[0] + nx * bob, HEAD[1] + ny * bob

    def inside(x, y):
        if math.hypot(x - hx, y - hy) <= R:
            return True
        px, py = x - TIP[0], y - TIP[1]
        t = (px * ux + py * uy) / length
        if not 0 <= t <= 1:
            return False
        # The tail's centre line waves, pinned at the tip, growing towards the head.
        wave = 2.8 * math.sin(t * 6 - phase * 2) * t * (1 - t) * 2 + bob * t
        perp = (px * nx + py * ny) - wave
        return abs(perp) <= R * (t ** 1.1) * 0.95

    return (hx, hy), inside


def frame(f):
    (hx, hy), inside = shape(f)
    px = [[None] * N for _ in range(N)]
    for y in range(N):
        for x in range(N):
            if inside(x + 0.5, y + 0.5):
                # Lit from the top left: the far side of the head falls into shade.
                d = (x + 0.5 - hx) * 0.7 + (y + 0.5 - hy) * 0.7
                px[y][x] = SHADE if d > R * 0.45 else BODY
    px[int(TIP[1])][int(TIP[0])] = BODY

    ex, ey = round(hx), round(hy)
    blink = f in (12, 13)
    for dx in (-2, 2):
        if blink:
            px[ey][ex + dx] = OUTLINE
        else:
            px[ey - 1][ex + dx] = OUTLINE
            px[ey][ex + dx] = OUTLINE
    for dx in (-3, 3):
        px[ey + 1][ex + dx] = CHEEK

    out = [row[:] for row in px]
    for y in range(N):
        for x in range(N):
            if px[y][x] is None and any(
                0 <= x + dx < N and 0 <= y + dy < N and px[y + dy][x + dx] is not None
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
            ):
                out[y][x] = OUTLINE
    return out


def save(px, path):
    body = bytes(v for row in px for c in row for v in ((*c, 255) if c else (0, 0, 0, 0)))
    head = f'P7\nWIDTH {N}\nHEIGHT {N}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n'.encode()
    subprocess.run(['magick', 'pam:-', '-filter', 'point', '-resize', f'{SCALE * 100}%', path],
                   input=head + body, check=True)


os.makedirs(OUT, exist_ok=True)
for f in range(FRAMES):
    save(frame(f), os.path.join(OUT, f'frame{f + 1}.png'))
print('wrote', FRAMES, 'frames to', OUT)
