"""おえかきの ほん"""
from content_common import UI, AUTHOR, howto, ASSESS, usage  # noqa: F401

FILE = 'draw-book'
TITLE = ('おえかきで まなぶ プログラミング', 'Learn Programming with Turtle Drawing')
SUBTITLE = ('ブロックから Python まで ― カメで かく 18の おだい', 'From blocks to Python — 18 drawing challenges with a turtle')
COVER_TAG = ('こども と 先生の ための', 'For kids and teachers')
PART1 = ('だい1ぶ　こどもの ための おえかきの ほん', 'Part 1　The drawing book for kids')
PART2 = ('だい2ぶ　先生・保護者の ための 指導編', 'Part 2　Guide for teachers and parents')
BOARD_LABEL = 'model'
COVER_IMG = 'draw-cover'

HOWTO = howto('ブロックでおえかき', 'Block Drawing',
              '<p class="note">おえかきでは、うすい はいいろの「おてほん」と おなじ かたちが かけたら せいかい です。</p>',
              '<p class="note">In Drawing, you are correct when your picture matches the light gray “model”.</p>')

APPS_TABLE = [
    (('ブロックでおえかき', 'Block Drawing'), 'index.html', 9, ('小3〜（算数の 角・正多角形）', 'Grade 3+ (angles, polygons)')),
    (('Pythonで おえかき', 'Python Drawing'), 'python-draw.html', 9, ('小5〜中学', 'Grade 5 – junior high')),
]

CH1_TITLE = ('カメに めいれいして えを かこう', 'Draw by giving commands to a turtle')
CH1 = (
    '''<h2>カメに めいれいして えを かこう</h2>
<p>この アプリでは、カメ（タートル）に めいれいを だして せんを かきます。カメは ペンを もっていて、すすんだ ところに せんが のこります。</p>
<table class="t"><tr><th>めいれい</th><th>カメの うごき</th></tr>
<tr><td>まえに ○ ほ すすむ</td><td>むいている ほうへ ○ほ すすむ（せんが かける）</td></tr>
<tr><td>みぎに ○ ど まわる</td><td>その ばで みぎに ○ど まわる（すすまない）</td></tr>
<tr><td>○ かい くりかえす</td><td>なかの めいれいを ○かい くりかえす</td></tr>
<tr><td>i を ○ から ○ まで ○ ずつ かぞえる</td><td>i の かずを かえながら くりかえす（へんすう）</td></tr></table>
<h3>「まわる かくど」の ひみつ</h3>
<p>カメが ぐるっと 1しゅう まわると <b>360ど</b>。正方形を かくとき、カメは 4かい まがって もとの むきに もどるので、1かいに まわる かくどは 360 ÷ 4 ＝ <b>90ど</b>。六角形なら 360 ÷ 6 ＝ 60ど です。</p>
<p class="note">「まわる かくど」は、かたちの なかの かど（ないかく）では ありません。カメが <b>すすむ むきを かえる かくど</b> です。じぶんの からだで まわって たしかめて みよう。</p>
<h3>うまく いかない ときは</h3>
<ul><li>おてほんと くらべて、どこから ずれたかを みよう。</li><li>くりかえしの かいすう と まわる かくど の かけざんが 360（または 720）に なって いるか たしかめよう。</li><li>まちがいを みつけて なおす ことを <b>デバッグ</b> と いいます。</li></ul>''',
    '''<h2>Draw by giving commands to a turtle</h2>
<p>In this app you give commands to a turtle. The turtle holds a pen, and it leaves a line wherever it moves.</p>
<table class="t"><tr><th>Command</th><th>What the turtle does</th></tr>
<tr><td>move forward ○ steps</td><td>Moves ○ steps the way it is facing (draws a line)</td></tr>
<tr><td>turn right ○ degrees</td><td>Turns right ○ degrees on the spot (does not move)</td></tr>
<tr><td>repeat ○ times</td><td>Repeats the commands inside ○ times</td></tr>
<tr><td>count with i from ○ to ○ by ○</td><td>Repeats while changing the number i (a variable)</td></tr></table>
<h3>The secret of the turn angle</h3>
<p>When the turtle turns all the way around, it turns <b>360 degrees</b>. To draw a square, the turtle turns 4 times and faces the same way again, so each turn is 360 ÷ 4 = <b>90 degrees</b>. For a hexagon, 360 ÷ 6 = 60 degrees.</p>
<p class="note">The turn angle is not the corner inside the shape. It is how much the turtle <b>changes the direction it walks</b>. Try turning your own body to check.</p>
<h3>When it doesn’t work</h3>
<ul><li>Compare with the model and find where it starts to go wrong.</li><li>Check that (repeat times) × (turn angle) is 360 (or 720).</li><li>Finding and fixing mistakes is called <b>debugging</b>.</li></ul>''')

CHAPTERS = [
    {'key': 'draw', 'boards': 'draw', 'icon': '🐢',
     'title': ('ブロックで おえかき', 'Block Drawing'),
     'lead': ('ブロックを つなげて、六角形・ほし・まる から、うずまきや ゆきの けっしょう まで かきます。<b>くりかえし → いれこ → へんすう → てじゅんを わける</b> と すすみます。',
              'Snap blocks together to draw hexagons, stars and circles, then spirals and snowflakes. You will go from <b>loops → nested loops → variables → breaking a task into parts</b>.'),
     'blocks': ('まえに ○ほ すすむ ／ うしろに ○ほ さがる ／ みぎ・ひだりに ○ど まわる ／ ○かい くりかえす ／ i を ○から ○まで ○ずつ かぞえる ／ けいさん（＋ − × ÷）／ ペンのいろ',
                'move forward / move back / turn right, left ○ degrees / repeat ○ times / count with i from ○ to ○ by ○ / math (+ − × ÷) / pen color'),
     'column': ('かどの かずと まわる かくど',
                '<p>正多角形は「おなじ ながさ すすむ → おなじ かくど まわる」の くりかえし。まわる かくどは いつも <b>360 ÷ かどの かず</b>。ほし（☆）は 2しゅう まわるので 720 ÷ 5 ＝ 144ど です。かどの かずを ふやして いくと、だんだん まる に ちかづくよ。プログラムなら、かずを かえるだけで すぐに たしかめられるね。</p>',
                'Corners and turn angles',
                '<p>A regular polygon is “move the same length → turn the same angle”, repeated. The turn angle is always <b>360 ÷ number of corners</b>. A star turns around twice, so 720 ÷ 5 = 144 degrees. As you add more corners, the shape gets closer to a circle. With a program, you can check this right away just by changing a number.</p>')},
    {'key': 'pydraw', 'boards': 'draw', 'icon': '🐍', 'py': True,
     'title': ('Python で おえかき', 'Drawing in Python'),
     'lead': ('おなじ おだいを <b>Python（パイソン）</b>で かきます。「まえに 80ほ すすむ」は <code>forward(80)</code>、「みぎに 60ど まわる」は <code>right(60)</code>。「6かい くりかえす」は <code>for i in range(6):</code> です。',
              'Draw the same challenges in <b>Python</b>. “move forward 80 steps” is <code>forward(80)</code>, “turn right 60 degrees” is <code>right(60)</code>, and “repeat 6 times” is <code>for i in range(6):</code>.'),
     'blocks': ('forward(80) ／ right(60) ／ left(45) ／ for i in range(6): ／ for i in range(10, 201, 10): ／ 360 / n',
                'forward(80) / right(60) / left(45) / for i in range(6): / for i in range(10, 201, 10): / 360 / n'),
     'column': ('range の よみかた',
                '<p><code>range(6)</code> は 0, 1, 2, 3, 4, 5 の 6こ。<code>range(10, 201, 10)</code> は 10 から はじめて 10ずつ ふやし、201 の てまえ（200）まで。さいごの かずは ふくまれない のが Python の きまり です。<code>360 / n</code> の「/」は わりざん です。</p>',
                'How to read range',
                '<p><code>range(6)</code> gives 0, 1, 2, 3, 4, 5 (six numbers). <code>range(10, 201, 10)</code> starts at 10, adds 10 each time, and stops before 201 (at 200). In Python, the last number is not included. In <code>360 / n</code>, “/” means division.</p>')},
]
SAME_NOTE = ('ブロックの おだい{n} と おなじ かたち', 'Same shape as block challenge {n}')

OUTRO = (
    '''<h2>おわりに</h2>
<p>さいごまで よく がんばりました！ この ほんで つかった かんがえかたを ふりかえって みよう。</p>
<table class="sum"><tr><th>かんがえかた</th><th>どこで でてきた？</th></tr>
<tr><td>くりかえし</td><td>おなじ「すすむ・まわる」を まとめる（①〜③）</td></tr>
<tr><td>かくど</td><td>360 ÷ かどの かず、ほしは 720 ÷ 5（①〜③）</td></tr>
<tr><td>いれこ</td><td>くりかえしの なかに くりかえし（④⑤）</td></tr>
<tr><td>へんすう</td><td>i の かずを かえながら くりかえす（⑥⑦⑨）</td></tr>
<tr><td>てじゅんを わける</td><td>えだ 1本 → 6かい（⑧）</td></tr>
<tr><td>Python</td><td>おなじ ことを ことば（コード）で かく</td></tr></table>
<p>じゆうに かこう（おだい なし）で、じぶんだけの もようも つくって みよう！ つぎは「ブロックで めいろ」「うちゅうで ほしあつめ」にも ちょうせん して みよう。</p>''',
    '''<h2>Well done!</h2>
<p>You worked hard to the end! Let’s look back at the ideas you used in this book.</p>
<table class="sum"><tr><th>Idea</th><th>Where did it appear?</th></tr>
<tr><td>Loops</td><td>Pack “move, turn” together (① – ③)</td></tr>
<tr><td>Angles</td><td>360 ÷ corners; a star is 720 ÷ 5 (① – ③)</td></tr>
<tr><td>Nested loops</td><td>A loop inside a loop (④ ⑤)</td></tr>
<tr><td>Variables</td><td>Repeat while changing i (⑥ ⑦ ⑨)</td></tr>
<tr><td>Breaking into parts</td><td>One branch → six times (⑧)</td></tr>
<tr><td>Python</td><td>Write the same thing in words (code)</td></tr></table>
<p>Try Free drawing to make your own patterns! Next, try “Block Maze” and “Space Star Hunt”.</p>''')

TEACHER = [
    (('指導編について', 'About this guide'),
     '''<p>本書は「ブロックでおえかき」（9題）と「Pythonで おえかき」（9題、同じお題）をまとめたものです。第1部は児童・生徒が自分で読み進められるよう、ひらがな・わかち書きで書いています。</p>
<p>小学校算数科では、第5学年「正多角形と円」でプログラミングを用いて正多角形をかく活動が例示されています。本教材の①〜③はこの学習にそのまま使え、④以降は反復の入れ子・変数・分解へと発展します。中学校では技術・家庭科（技術分野）の導入として、Python版で同じ図形をテキストで表す活動に使えます。</p>
<h3>本教材のねらい</h3>
<ul><li>図形の性質（辺の長さ・回る角度）を、命令の順序と反復で表す。</li>
<li>回る角度を「360÷辺の数」と筋道立てて考え、説明する。</li>
<li>変数を使い、少しずつ変化する図形（うずまき等）を表す。</li></ul>''',
     '''<p>This book covers “Block Drawing” (9 challenges) and “Python Drawing” (the same 9). Part 1 is written in simple language for students.</p>
<p>In Japanese elementary mathematics, drawing regular polygons with programming is an example activity in Grade 5 (“Regular polygons and circles”). Challenges ①–③ fit that lesson directly; ④ onward extends to nested loops, variables and decomposition. In junior high, the Python version can introduce text-based programming with the same shapes.</p>
<h3>Aims</h3>
<ul><li>Express properties of shapes (side length, turn angle) with ordered commands and loops.</li>
<li>Reason that the turn angle is “360 ÷ number of sides” and explain it.</li>
<li>Use variables to draw shapes that change step by step (spirals, etc.).</li></ul>'''),
    (('学習の全体像', 'Overview of the challenges'), '{MAP}', '{MAP}'),
    (('進め方と指導のポイント', 'Suggested order and teaching points'),
     '''<table class="t"><tr><th>対象</th><th>扱うお題</th><th>時数の目安</th><th>中心となる考え方</th></tr>
<tr><td>小3〜4</td><td>①〜③</td><td>1〜2時間</td><td>反復、角度</td></tr>
<tr><td>小5（算数）</td><td>①〜③（＋④⑤）</td><td>2時間</td><td>正多角形の性質、360÷辺の数</td></tr>
<tr><td>小5〜6</td><td>④〜⑨</td><td>2〜3時間</td><td>入れ子、変数、計算、分解</td></tr>
<tr><td>小6〜中学</td><td>Python版 ①〜⑨</td><td>2〜4時間</td><td>for・range、変数、文法</td></tr></table>
<h3>つまずきと支援</h3>
<ul><li><b>内角と外角の混同：</b>正三角形で60°回してしまう。→ 児童に教室で実際に歩かせ、「進む向きを変える角度」を体で確かめさせる。</li>
<li><b>回数と角度の不一致：</b>回数×角度が360（星は720）になっているかを確かめさせる。</li>
<li><b>入れ子の位置：</b>「しかくを かいた あと」に回る命令を、内側のくり返しの外に置くことを言葉で確認する。</li>
<li><b>変数：</b>⑥では「i が 10, 20, 30…と変わる」ことを表に書かせてから組ませる。</li>
<li><b>Python：</b>括弧・コロン・字下げの3つのルールを掲示する。<code>range</code> の終わりの数は含まれないことに注意させる。</li></ul>
<h3>1単位時間（45分）の流れの例（①〜③）</h3>
<table class="t"><tr><th>時間</th><th>学習活動</th><th>支援・留意点</th></tr>
<tr><td>導入 5分</td><td>正多角形の性質を振り返り、めあてを確認する。</td><td>正三角形・正方形・正六角形を提示する。</td></tr>
<tr><td>展開 30分</td><td>正方形・正三角形をかき、正六角形の角度を予想して確かめる。表に整理してきまりを見つける。</td><td>予想→実行→修正の順で。ワークシート②の表を使う。</td></tr>
<tr><td>まとめ 10分</td><td>「360÷辺の数」をまとめ、振り返りを書く。</td><td>2〜3人のプログラムを比べる。</td></tr></table>''',
     '''<table class="t"><tr><th>Students</th><th>Challenges</th><th>Lessons</th><th>Key ideas</th></tr>
<tr><td>Grades 3–4</td><td>① – ③</td><td>1–2</td><td>Loops, angles</td></tr>
<tr><td>Grade 5 (math)</td><td>① – ③ (+ ④ ⑤)</td><td>2</td><td>Regular polygons, 360 ÷ sides</td></tr>
<tr><td>Grades 5–6</td><td>④ – ⑨</td><td>2–3</td><td>Nesting, variables, math, decomposition</td></tr>
<tr><td>Grade 6 – junior high</td><td>Python ① – ⑨</td><td>2–4</td><td>for/range, variables, syntax</td></tr></table>
<h3>Common difficulties and support</h3>
<ul><li><b>Inside angle vs. turn angle:</b> turning 60° for a triangle. → Have students walk the shape and feel “the angle that changes the direction”.</li>
<li><b>Times and angle don’t match:</b> check that times × angle = 360 (720 for the star).</li>
<li><b>Where to put the turn in nested loops:</b> confirm in words that “after each square” means outside the inner loop.</li>
<li><b>Variables:</b> for ⑥, have students write in a table how i changes (10, 20, 30…) before building.</li>
<li><b>Python:</b> post the three rules (brackets, colon, indent). Note that the end number of <code>range</code> is not included.</li></ul>
<h3>Example 45-minute lesson (① – ③)</h3>
<table class="t"><tr><th>Time</th><th>Activity</th><th>Support</th></tr>
<tr><td>Intro 5 min</td><td>Review regular polygons; share the goal.</td><td>Show a triangle, square and hexagon.</td></tr>
<tr><td>Main 30 min</td><td>Draw a square and triangle; predict and check the hexagon’s angle; find the rule in a table.</td><td>Predict → run → fix. Use the Worksheet 2 table.</td></tr>
<tr><td>Wrap-up 10 min</td><td>Summarize “360 ÷ sides”; write a reflection.</td><td>Compare 2–3 programs.</td></tr></table>'''),
    ASSESS,
    usage('01 ブロックでおえかき、05 Pythonで おえかき', '01 Block Drawing, 05 Python Drawing', '②おえかき（角度の表）、⑦Python', '2 Drawing (angle table), 7 Python'),
]
