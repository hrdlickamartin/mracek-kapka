import json
import os
import subprocess
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SPEC = os.path.join(os.path.dirname(__file__), 'animals.json')
OUT = os.path.join(ROOT, 'assets', 'animals')
TS = os.path.join(ROOT, 'src', 'render', 'animalSprites.ts')
MEDIA = os.path.expanduser('~/.claude/skills/generate-media/scripts/media.mjs')
MAX_SIZE = 360


def spec():
    with open(SPEC, encoding='utf-8') as f:
        return json.load(f)


def generate(name, target):
    s = spec()
    prompt = s['promptTemplate'].replace('{desc}', s['animals'][name])
    cfg = s['settings']
    subprocess.run(['node', MEDIA, 'openai-image', '--model', s['model'], '--background', cfg['background'], '--quality', cfg['quality'],
                    '--size', cfg['size'], '--image', os.path.join(ROOT, cfg['reference']), '--prompt', prompt, '--out', target], check=True)


def import_png(name, source):
    im = Image.open(source).convert('RGBA')
    alpha = im.getchannel('A').point(lambda v: 255 if v > 8 else 0)
    im = im.crop(alpha.getbbox())
    im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    canvas = Image.new('RGBA', (im.width + 8, im.height + 8), (0, 0, 0, 0))
    canvas.alpha_composite(im, (4, 4))
    canvas.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG).save(os.path.join(OUT, f'{name}.png'), optimize=True)


def build():
    names = sorted(spec()['animals'])
    lines = []
    for n in names:
        path = os.path.join(OUT, f'{n}.png')
        if not os.path.exists(path):
            sys.exit(f'chybí assets/animals/{n}.png')
        w, h = Image.open(path).size
        lines.append(f"  '{n}': {{ src: require('../../assets/animals/{n}.png'), aspect: {w / h:.3f} }},")
    ts = ("import type { ImageSourcePropType } from 'react-native';\nimport type { AnimalKind } from '../game/types';\n\n"
          "export const ANIMAL_SPRITES: Record<AnimalKind, { src: ImageSourcePropType; aspect: number }> = {\n" + '\n'.join(lines) + '\n};\n')
    with open(TS, 'w', encoding='utf-8') as f:
        f.write(ts)
    print(f'{len(names)} zvířátek -> src/render/animalSprites.ts')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'build'
    os.makedirs(OUT, exist_ok=True)
    if cmd == 'generate':
        name = sys.argv[2]
        raw = os.path.join(OUT, f'{name}.raw.png')
        generate(name, raw)
        import_png(name, raw)
        os.remove(raw)
        build()
    elif cmd == 'import':
        import_png(sys.argv[2], sys.argv[3])
        build()
    else:
        build()
