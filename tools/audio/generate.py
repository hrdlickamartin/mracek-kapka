import math
import os
import random
import struct
import wave

RATE = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'audio')
random.seed(7)

PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]


def buf(seconds):
    return [0.0] * int(RATE * seconds)


def write(name, data, gain=0.8):
    peak = max(1e-6, max(abs(v) for v in data))
    scale = gain / peak if peak > gain else 1.0
    path = os.path.join(OUT, name + '.wav')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * scale)) * 32767)) for v in data))


def bell(data, start, freq, length, amp, decay=3.0, harmonics=((1, 1), (2, 0.35), (3, 0.12))):
    s0 = int(start * RATE)
    n = int(length * RATE)
    for i in range(n):
        j = s0 + i
        if j >= len(data):
            break
        t = i / RATE
        env = math.exp(-decay * t) * min(1, t * 200)
        v = sum(a * math.sin(2 * math.pi * freq * h * t) for h, a in harmonics)
        data[j] += amp * env * v


def glide(data, start, f0, f1, length, amp, vibrato=0.0):
    s0 = int(start * RATE)
    n = int(length * RATE)
    phase = 0.0
    for i in range(n):
        j = s0 + i
        if j >= len(data):
            break
        t = i / RATE
        p = i / n
        f = f0 + (f1 - f0) * p + vibrato * math.sin(2 * math.pi * 6 * t)
        phase += 2 * math.pi * f / RATE
        env = math.sin(math.pi * p) ** 0.7
        data[j] += amp * env * math.sin(phase)


def noise(data, start, length, amp, smooth=6, shape=lambda p: math.sin(math.pi * p)):
    s0 = int(start * RATE)
    n = int(length * RATE)
    last = 0.0
    for i in range(n):
        j = s0 + i
        if j >= len(data):
            break
        last += (random.uniform(-1, 1) - last) / smooth
        data[j] += amp * shape(i / n) * last


def tones():
    for i, f in enumerate(PENTA):
        d = buf(1.4)
        bell(d, 0, f, 1.4, 0.6, decay=2.6)
        write(f'tone_{i}', d, 0.7)


def effects():
    d = buf(0.16); glide(d, 0, 420, 900, 0.14, 0.7); write('blup', d)
    d = buf(0.45); glide(d, 0, 260, 170, 0.16, 0.7); glide(d, 0.22, 240, 160, 0.16, 0.6); write('hlt', d)
    d = buf(0.7); noise(d, 0, 0.7, 0.5, smooth=3); write('dest', d, 0.4)
    d = buf(0.18); glide(d, 0, 620, 1300, 0.12, 0.7); write('pop', d)
    d = buf(1.0)
    for k, f in enumerate([PENTA[0], PENTA[2], PENTA[3], PENTA[5]]):
        bell(d, k * 0.09, f, 0.8, 0.45)
    write('kvet', d)
    d = buf(0.6)
    for k in range(7):
        bell(d, k * 0.06, random.choice(PENTA[4:]) * 2, 0.3, 0.25, decay=10)
    write('jiskra', d, 0.5)
    d = buf(0.6); noise(d, 0, 0.6, 0.6, smooth=2, shape=lambda p: math.sin(math.pi * p) ** 2); write('vzum', d, 0.45)
    d = buf(0.45)
    for k in range(4):
        noise(d, k * 0.1, 0.08, 0.6, smooth=1.5)
    write('sustnuti', d, 0.45)
    d = buf(1.3); noise(d, 0, 1.3, 0.7, smooth=14); write('vitr', d, 0.5)
    d = buf(1.0); glide(d, 0, 520, 240, 0.95, 0.6, vibrato=10); write('zivani', d, 0.5)
    d = buf(0.36)
    for k, f in enumerate([760, 860, 980]):
        glide(d, k * 0.1, f, f * 1.15, 0.08, 0.6)
    write('hihi', d, 0.6)
    d = buf(0.4); glide(d, 0, 1200, 1700, 0.12, 0.55); glide(d, 0.18, 1250, 1750, 0.12, 0.55); write('zvire', d, 0.55)
    d = buf(0.3); noise(d, 0, 0.28, 0.8, smooth=1.8, shape=lambda p: math.exp(-6 * p)); write('cak', d, 0.5)
    d = buf(0.5); glide(d, 0, 420, 820, 0.45, 0.6, vibrato=14); write('juuu', d, 0.55)
    d = buf(2.0)
    for k, f in enumerate([PENTA[0], PENTA[2], PENTA[3], PENTA[5], PENTA[7]]):
        bell(d, k * 0.14, f, 1.4, 0.4)
    for f in [PENTA[0], PENTA[2], PENTA[3]]:
        bell(d, 0.8, f / 2, 1.2, 0.3, decay=1.5)
    write('slavnost', d, 0.7)


def cues():
    d = buf(0.7)
    bell(d, 0, PENTA[2], 0.5, 0.5, decay=5)
    bell(d, 0.18, PENTA[4], 0.5, 0.5, decay=5)
    write('napoveda', d, 0.55)
    d = buf(0.6); glide(d, 0, 700, 330, 0.5, 0.5, vibrato=6); write('prazdno', d, 0.45)
    d = buf(0.9)
    for k, f in enumerate([PENTA[3], PENTA[5], PENTA[6], PENTA[8]]):
        bell(d, k * 0.07, f, 0.6, 0.35, decay=6)
    write('objev', d, 0.6)


CHORDS = [[261.63, 329.63, 392.0], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]]
LOOP = 8.0


def music():
    pad = buf(LOOP)
    for c, chord in enumerate(CHORDS):
        start = int(c * 2.0 * RATE)
        n = int(2.0 * RATE)
        for i in range(n):
            t = i / RATE
            env = math.sin(math.pi * i / n) ** 0.5
            v = sum(math.sin(2 * math.pi * f * (start / RATE + t)) + 0.3 * math.sin(2 * math.pi * f * 2 * (start / RATE + t)) for f in chord)
            pad[start + i] += 0.12 * env * v
    write('music_pad', pad, 0.5)
    pluck = buf(LOOP)
    for c, chord in enumerate(CHORDS):
        notes = chord + [chord[1] * 2, chord[0] * 2]
        for k in range(8):
            t = c * 2.0 + k * 0.25
            bell(pluck, t, notes[k % len(notes)] * 2, 0.4, 0.3, decay=8)
    write('music_pluck', pluck, 0.5)
    bells = buf(LOOP)
    melody = [5, 4, 3, 4, 2, 3, 0, 1, 2, 4, 3, 2, 1, 2, 3, 0]
    for k, m in enumerate(melody):
        bell(bells, k * 0.5, PENTA[m], 0.5 if k < 15 else 0.45, 0.3, decay=4)
    write('music_bells', bells, 0.5)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    tones()
    effects()
    music()
    cues()
    print('hotovo:', len(os.listdir(OUT)), 'souborů')
