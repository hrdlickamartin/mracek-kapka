import os
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

KAPACEK = '''
<defs><radialGradient cx="45%" cy="35%" r="70%" id="telo"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#FEFCFC"/><stop offset="1" stop-color="#D9E2F1"/></radialGradient></defs>
<g>
<circle cx="-89" cy="34" r="40" fill="#C9D6EA"/><circle cx="-59" cy="2" r="54" fill="#C9D6EA"/><circle cx="-19" cy="-32" r="62" fill="#C9D6EA"/><circle cx="35" cy="-34" r="58" fill="#C9D6EA"/><circle cx="81" cy="0" r="52" fill="#C9D6EA"/><circle cx="103" cy="36" r="38" fill="#C9D6EA"/><circle cx="-37" cy="40" r="56" fill="#C9D6EA"/><circle cx="33" cy="40" r="58" fill="#C9D6EA"/>
<circle cx="-92" cy="28" r="40" fill="url(#telo)"/><circle cx="-62" cy="-4" r="54" fill="url(#telo)"/><circle cx="-22" cy="-38" r="62" fill="url(#telo)"/><circle cx="32" cy="-40" r="58" fill="url(#telo)"/><circle cx="78" cy="-6" r="52" fill="url(#telo)"/><circle cx="100" cy="30" r="38" fill="url(#telo)"/><circle cx="-40" cy="34" r="56" fill="url(#telo)"/><circle cx="30" cy="34" r="58" fill="url(#telo)"/>
<circle cx="-36" cy="-58" r="18" fill="#FFFFFF" opacity="0.85"/><circle cx="-60" cy="-24" r="9" fill="#FFFFFF" opacity="0.7"/>
</g>
<ellipse cx="-54" cy="28" rx="16" ry="9" fill="#FCA19E" opacity="0.75"/><ellipse cx="54" cy="28" rx="16" ry="9" fill="#FCA19E" opacity="0.75"/>
<g transform="translate(-32 6)"><ellipse rx="13" ry="16" fill="#23395B"/><circle cx="1" cy="3" r="8.5" fill="#2A8FE0"/><circle cx="1" cy="4" r="4.5" fill="#0E2547"/><circle cx="-4" cy="-6" r="4.6" fill="#FFFFFF"/><circle cx="5" cy="6" r="2.2" fill="#FFFFFF"/></g>
<g transform="translate(32 6)"><ellipse rx="13" ry="16" fill="#23395B"/><circle cx="1" cy="3" r="8.5" fill="#2A8FE0"/><circle cx="1" cy="4" r="4.5" fill="#0E2547"/><circle cx="-4" cy="-6" r="4.6" fill="#FFFFFF"/><circle cx="5" cy="6" r="2.2" fill="#FFFFFF"/></g>
<path d="M-16 29 Q0 31 16 29 Q14 50 0 50 Q-14 50 -16 29 Z" fill="#B8322D"/><ellipse cx="0" cy="44" rx="8" ry="4.5" fill="#F2827C"/><rect x="-9" y="29" width="7" height="5" rx="1.5" fill="#FFFFFF"/>
'''

DROPS = '''
<path d="M-60 120 C-60 120 -74 140 -74 150 A14 14 0 0 0 -46 150 C-46 140 -60 120 -60 120 Z" fill="#FFFFFF" opacity="0.9"/>
<path d="M0 132 C0 132 -14 152 -14 162 A14 14 0 0 0 14 162 C14 152 0 132 0 132 Z" fill="#FFFFFF" opacity="0.9"/>
<path d="M60 120 C60 120 46 140 46 150 A14 14 0 0 0 74 150 C74 140 60 120 60 120 Z" fill="#FFFFFF" opacity="0.9"/>
'''

SKY = '''
<defs><linearGradient id="nebe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6FF"/><stop offset="1" stop-color="#3BAEFD"/></linearGradient></defs>
<rect x="-256" y="-256" width="512" height="512" fill="url(#nebe)"/>
'''


def svg(background, scale, dy, drops):
    body = KAPACEK + (DROPS if drops else '')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="-256 -256 512 512">
{SKY if background else ''}<g transform="translate(0 {dy}) scale({scale})">{body}</g></svg>'''


VARIANTS = {
    'icon': (True, 1.15, -30, True),
    'adaptive-icon': (False, 1.0, 0, False),
    'splash-icon': (False, 1.6, 0, False),
}


def render(markup, out):
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, 'ikona.html')
        with open(page, 'w') as f:
            f.write(f'<!doctype html><html><body style="margin:0;background:transparent">{markup}</body></html>')
        shot = os.path.join(tmp, 'shot.png')
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--default-background-color=00000000', '--window-size=1024,1024', f'--screenshot={shot}', f'file://{page}'], check=True, capture_output=True)
        Image.open(shot).convert('RGBA').crop((0, 0, 1024, 1024)).save(out)


def main():
    for name, (background, scale, dy, drops) in VARIANTS.items():
        out = os.path.join(ROOT, 'assets', f'{name}.png')
        render(svg(background, scale, dy, drops), out)
        if background:
            Image.open(out).convert('RGB').save(out)
        print(os.path.relpath(out, ROOT))
    icon = Image.open(os.path.join(ROOT, 'assets', 'icon.png'))
    icons = os.path.join(ROOT, 'public', 'icons')
    os.makedirs(icons, exist_ok=True)
    for size, name in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')]:
        out = os.path.join(icons, name)
        icon.resize((size, size), Image.LANCZOS).save(out, optimize=True)
        print(os.path.relpath(out, ROOT))


if __name__ == '__main__':
    sys.exit(main())
