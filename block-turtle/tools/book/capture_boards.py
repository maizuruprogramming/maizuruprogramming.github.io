"""本の「もんだい」ページに のせる 盤面の え（スタートの ようす）を アプリから とる。
開発環境用：Blockly を スタブに かえた ブラウザで 各ページを ひらき、キャンバスを PNG に する。
つかいかた: python3 tools/book/capture_boards.py  → tools/book/boards/{draw,space,craft,pyspace,pycraft}-N.png
"""
import base64, sys
from pathlib import Path
sys.path.insert(0, '/tmp'); sys.path.insert(0, '/tmp/vid')
from harness import page, sync_playwright
import make_py_videos as MPV

OUT = Path(__file__).parent / 'boards'
DRAW_SHOT = """(i)=>{odaiSelect.value=i; selectChallenge(i);
  const c=document.createElement('canvas'); c.width=400; c.height=400; const x=c.getContext('2d');
  x.fillStyle='#fff'; x.fillRect(0,0,400,400); for (const id of ['guide','paper','turtle']) x.drawImage(document.getElementById(id),0,0);
  return c.toDataURL('image/png');}"""
GRID_SHOT = "(i)=>{setLevel(i); draw(); return document.getElementById('board').toDataURL('image/png');}"
PY_SHOT = "(i)=>{setMode('python', true); setLevel(i); draw(); return document.getElementById('board').toDataURL('image/png');}"

def save(name, url):
    (OUT / name).write_bytes(base64.b64decode(url.split(',', 1)[1]))

with sync_playwright() as p:
    b = p.chromium.launch()
    pg, errs = page(b, 'index.html')
    for i in range(1, 10): save(f'draw-{i}.png', pg.evaluate(DRAW_SHOT, i))
    # ひょうしの え：⑤ はな と ⑨ ほしの うずまき を いろつきで かさねる
    save('draw-cover.png', pg.evaluate("""()=>{const c=document.createElement('canvas'); c.width=400; c.height=400; const x=c.getContext('2d');
      x.fillStyle='#fff'; x.fillRect(0,0,400,400);
      drawInstant(x, compile(CHALLENGES[9].answer), {color:'#fb8c00', width:2});
      drawInstant(x, compile(CHALLENGES[5].answer), {color:'#1e88e5', width:3});
      return c.toDataURL('image/png');}"""))
    for key, f in (('space', 'space.html'), ('craft', 'craft.html')):
        pg, errs = page(b, f)
        n = pg.evaluate("()=>LEVELS.filter(l=>l.mode!=='free').length")
        for i in range(n): save(f'{key}-{i + 1}.png', pg.evaluate(GRID_SHOT, i))
        print(key, n, errs[:1])
    for key, f in (('pyspace', 'python-space.html'), ('pycraft', 'python-craft.html')):
        pg, errs = MPV.page(b, f, 'ja')
        n = pg.evaluate("()=>LEVELS.length")
        for i in range(n): save(f'{key}-{i + 1}.png', pg.evaluate(PY_SHOT, i))
        print(key, n, errs[:1])
    b.close()
