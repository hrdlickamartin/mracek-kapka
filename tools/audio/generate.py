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


def note(data, start, freq, length, amp, partials, attack=0.008):
    n = len(data)
    s0 = int(start * RATE)
    for i in range(int(length * RATE)):
        t = i / RATE
        env = min(1, t / attack)
        v = sum(a * math.exp(-d * t) * math.sin(2 * math.pi * freq * h * t) for h, a, d in partials)
        data[(s0 + i) % n] += amp * env * v


def string(data, start, freq, length, amp, seed, damping=0.996, attack=0.004):
    rng = random.Random(seed)
    period = max(2, int(RATE / freq))
    ring = [rng.uniform(-1, 1) for _ in range(period)]
    for _ in range(3):
        ring = [(ring[k] + ring[k - 1]) / 2 for k in range(period)]
    n = len(data)
    s0 = int(start * RATE)
    total = int(length * RATE)
    tail = int(0.05 * RATE)
    for i in range(total):
        k = i % period
        v = ring[k]
        ring[k] = damping * (v + ring[k - 1]) / 2
        env = min(1, i / (attack * RATE)) * min(1, (total - i) / tail)
        data[(s0 + i) % n] += amp * env * v


def flavor_notes(chord, k):
    notes = chord + [chord[1] * 2, chord[0] * 2]
    return notes[k % len(notes)]


def flavors():
    wood = ((1, 1, 7), (3.93, 0.12, 22), (9.2, 0.03, 40))
    d = buf(LOOP)
    steps = [0, 2, 1, 2, 4, 2, 1, None]
    for c, chord in enumerate(CHORDS):
        for k, s in enumerate(steps):
            if s is not None:
                note(d, c * 2.0 + k * 0.25, flavor_notes(chord, s) * 2, 0.6, 0.3 if k % 2 == 0 else 0.22, wood, attack=0.01)
    write('music_drevo', d, 0.5)

    tines = ((1, 1, 4.5), (2, 0.08, 9), (5.4, 0.05, 18))
    d = buf(LOOP)
    rhythm = [(0.0, 0), (0.375, 2), (0.75, 1), (1.0, 3), (1.375, 2), (1.625, 4)]
    for c, chord in enumerate(CHORDS):
        for t, s in rhythm:
            note(d, c * 2.0 + t, flavor_notes(chord, s) * 2, 0.9, 0.28, tines, attack=0.008)
    write('music_kalimba', d, 0.5)

    glock = ((1, 1, 5), (2, 0.15, 10), (4, 0.04, 18))
    d = buf(LOOP)
    for c, chord in enumerate(CHORDS):
        for k, s in enumerate([0, 1, 2, 1]):
            note(d, c * 2.0 + k * 0.5, flavor_notes(chord, s) * 4, 0.9, 0.24, glock, attack=0.008)
        note(d, c * 2.0 + 1.75, flavor_notes(chord, 2) * 4, 0.6, 0.13, glock, attack=0.008)
    write('music_celesta', d, 0.45)

    harp = ((1, 1, 2.2), (2, 0.35, 4), (3, 0.12, 7))
    d = buf(LOOP)
    arp = [0, 1, 2, 4, 3, 4, 2, 1]
    for c, chord in enumerate(CHORDS):
        for k, s in enumerate(arp):
            note(d, c * 2.0 + k * 0.25, flavor_notes(chord, s) * 2, 1.4, 0.16, harp, attack=0.012)
    write('music_harfa', d, 0.5)

    box = ((1, 1, 3), (2.0, 0.1, 7), (5.4, 0.03, 14))
    d = buf(LOOP)
    for c, chord in enumerate(CHORDS):
        for k, s in enumerate([4, 2, 3, 1]):
            note(d, c * 2.0 + k * 0.5, flavor_notes(chord, s) * 2, 1.4, 0.2, box, attack=0.01)
    write('music_skrinka', d, 0.32)

    d = buf(LOOP)
    strums = [(0.0, 0.5), (0.5, 0.36), (0.75, 0.28), (1.0, 0.46), (1.5, 0.36), (1.75, 0.28)]
    seed = 0
    for c, chord in enumerate(CHORDS):
        voicing = [chord[2], chord[0], chord[1], chord[0] * 2]
        for t, amp in strums:
            for v, f in enumerate(voicing):
                seed += 1
                string(d, c * 2.0 + t + v * 0.018, f * 2 if v == 0 else f, 0.5, amp, seed, damping=0.996)
    write('music_ukulele', d, 0.5)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    tones()
    effects()
    music()
    cues()
    flavors()
    print('hotovo:', len(os.listdir(OUT)), 'souborů')
