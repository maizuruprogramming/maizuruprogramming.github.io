"""「システムの紹介」スライドから しょうかい どうがを つくる（字幕＋効果音、ナレーションなし）。
つかいかた: python3 tools/slides/intro_video.py ja|en スライド.pptx の PDF  → videos/{ja,en}/intro.mp4
字幕は 各スライドの 発表者ノート（python-pptx で よむ）。
"""
import os, subprocess, sys, shutil, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
sys.path.insert(0, '/tmp/vid')
import make_videos as MV  # 効果音・wav（解説動画と おなじ もの）

ROOT = Path(__file__).resolve().parents[2]
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
W, H, CAP = 1280, 720, 110


def wrap(draw, text, font, width):
    lines, cur = [], ''
    tokens = list(text) if re.search(r'[぀-鿿]', text) else re.split(r'(\s+)', text)
    for t in tokens:
        if draw.textlength(cur + t, font=font) > width and cur.strip():
            lines.append(cur.strip()); cur = t.lstrip()
        else:
            cur += t
    if cur.strip(): lines.append(cur.strip())
    return lines


def main(lang, pptx, pdf):
    work = Path(f'/tmp/introvid_{lang}'); shutil.rmtree(work, ignore_errors=True); work.mkdir()
    subprocess.run(['pdftoppm', '-png', '-scale-to-x', '1600', '-scale-to-y', '900', pdf, str(work / 's')], check=True)
    slides = sorted(work.glob('s-*.png'))
    notes = [(sl.notes_slide.notes_text_frame.text if sl.has_notes_slide else '') for sl in Presentation(pptx).slides]
    assert len(notes) == len(slides), (len(notes), len(slides))
    shots, sounds, t = [], [], 0.0
    for i, (img, note) in enumerate(zip(slides, notes)):
        canvas = Image.new('RGB', (W, H), (30, 36, 48))
        sw = int((H - CAP - 20) * 16 / 9); sh = H - CAP - 20
        im = Image.open(img).convert('RGB').resize((sw, sh), Image.LANCZOS)
        canvas.paste(im, ((W - sw) // 2, 10))
        d = ImageDraw.Draw(canvas)
        fs = 28
        while True:
            font = ImageFont.truetype(FONT, fs)
            lines = wrap(d, note, font, W - 120)
            if len(lines) * (fs + 8) <= CAP - 14 or fs <= 20: break
            fs -= 1
        y0 = H - CAP + (CAP - len(lines) * (fs + 8)) // 2 - 4
        for k, ln in enumerate(lines):
            tw = d.textlength(ln, font=font)
            d.text(((W - tw) / 2, y0 + k * (fs + 8)), ln, font=font, fill=(255, 255, 255))
        p = work / f'f{i:02d}.jpg'; canvas.save(p, quality=92)
        dur = max(5.0, min(11.0, len(note) / 7.5 if lang == 'ja' else len(note.split()) / 2.4)) + 0.8
        sounds.append((t, 'title' if i == 0 else ('end' if i == len(slides) - 1 else 'tick')))
        shots.append((p, dur)); t += dur
    lst = work / 'list.txt'
    with open(lst, 'w') as fp:
        for p, dur in shots: fp.write(f"file '{p}'\nduration {dur:.3f}\n")
        fp.write(f"file '{shots[-1][0]}'\n")
    MV.write_wav(str(work / 'a.wav'), MV.mix(sounds, t))
    out = ROOT / 'videos' / lang / 'intro.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-vf', 'fps=30,format=yuv420p',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', '30', str(work / 'v.mp4')], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(work / 'v.mp4'), '-i', str(work / 'a.wav'), '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', str(out)], check=True)
    print(out, round(t, 1), 's')


if __name__ == '__main__':
    main(*sys.argv[1:4])
