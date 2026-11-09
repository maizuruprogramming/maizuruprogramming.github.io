"""うちゅうの ほん"""
from content_common import UI, AUTHOR, howto, ASSESS, usage  # noqa: F401

FILE = 'space-book'
TITLE = ('うちゅうで まなぶ プログラミング', 'Learn Programming in Space')
SUBTITLE = ('ブロックから Python まで ― ほしあつめ 13ステージ', 'From blocks to Python — 13 star-hunting stages')
COVER_TAG = ('こども と 先生の ための', 'For kids and teachers')
PART1 = ('だい1ぶ　こどもの ための うちゅうの ほん', 'Part 1　The space book for kids')
PART2 = ('だい2ぶ　先生・保護者の ための 指導編', 'Part 2　Guide for teachers and parents')
BOARD_LABEL = 'start'
COVER_IMG = 'space-6'

HOWTO = howto('うちゅうで ほしあつめ', 'Space Star Hunt')

APPS_TABLE = [
    (('うちゅうで ほしあつめ', 'Space Star Hunt'), 'space.html', 7, ('小3〜', 'Grade 3+')),
    (('Pythonで うちゅう', 'Python Space'), 'python-space.html', 6, ('小5〜中学', 'Grade 5 – junior high')),
]

CH1_TITLE = ('ほしを あつめて ロケットへ', 'Collect stars and go to the rocket')
CH1 = (
    '''<h2>ほしを あつめて ロケットへ</h2>
<p>うちゅうひこうしを うごかして、⭐ ほしを ぜんぶ ひろってから 🚀 ロケットに のりこみます。いわ には ぶつかって しまうので、みちを かんがえて すすもう。</p>
<table class="t"><tr><th>めいれい</th><th>うごき</th></tr>
<tr><td>まえに すすむ</td><td>むいている ほうへ 1マス すすむ</td></tr>
<tr><td>みぎを むく ／ ひだりを むく</td><td>その ばで むきを かえる（すすまない）</td></tr>
<tr><td>⭐ ほしを ひろう</td><td>いま いる マスの ほしを ひろう（ほしが ない ところでは しっぱい）</td></tr>
<tr><td>もし ここに ⭐ ほしが あったら</td><td>ほしが ある ときだけ なかの めいれいを する</td></tr>
<tr><td>🚀 ミッション クリアまで くりかえす</td><td>ほしを ぜんぶ あつめて ロケットに つくまで くりかえす</td></tr></table>
<h3>この アプリの だいじな かんがえかた</h3>
<p>「その ばを <b>しらべてから</b> うごく」こと。ほしが ある ばしょが わからなくても、まいかい しらべれば あつめられます。じどうドアや センサーライトも、しらべてから うごく きかい です。</p>
<h3>うまく いかない ときは</h3>
<ul><li>どこで とまったか、ほしが のこって いないか みよう。</li><li>ワークシートに、1つ うごく たびに「あつめた ほしの かず」を かいて みよう。</li></ul>''',
    '''<h2>Collect stars and go to the rocket</h2>
<p>Move the astronaut, pick up every ⭐ star, then board the 🚀 rocket. You bump into rocks, so plan your path.</p>
<table class="t"><tr><th>Command</th><th>What it does</th></tr>
<tr><td>move forward</td><td>Moves one square the way it is facing</td></tr>
<tr><td>turn right / turn left</td><td>Changes direction on the spot (does not move)</td></tr>
<tr><td>⭐ pick up star</td><td>Picks up the star on this square (fails if there is none)</td></tr>
<tr><td>if there is a ⭐ star here</td><td>Runs the commands inside only when there is a star</td></tr>
<tr><td>🚀 repeat until mission complete</td><td>Repeats until all stars are collected and you reach the rocket</td></tr></table>
<h3>The big idea in this app</h3>
<p><b>Check first, then act.</b> Even if you don’t know where the stars are, you can collect them by checking every time. Automatic doors and sensor lights also check before they act.</p>
<h3>When it doesn’t work</h3>
<ul><li>Look where it stopped, and whether any stars are left.</li><li>On the worksheet, write the number of stars collected after each move.</li></ul>''')

CHAPTERS = [
    {'key': 'space', 'boards': 'space', 'icon': '🚀',
     'title': ('うちゅうで ほしあつめ', 'Space Star Hunt'),
     'lead': ('ほしを ひろって ロケットへ。<b>じゅんばん → くりかえし → パターン → もし → どんな うちゅうでも</b> と すすみます。さいごの ステージは ランダムな うちゅう 30こで テストされます。',
              'Collect stars and go to the rocket. You will go from <b>order → loops → patterns → if → any space</b>. The last stage is tested on 30 random worlds.'),
     'blocks': ('まえに すすむ ／ みぎ・ひだりを むく ／ ⭐ ほしを ひろう ／ ○かい くりかえす ／ もし ここに ⭐ ほしが あったら ／ もし ○ が あいていたら ／ 🚀 ミッション クリアまで くりかえす',
                'move forward / turn right, left / ⭐ pick up star / repeat ○ times / if there is a ⭐ star here / if ○ is open / 🚀 repeat until mission complete'),
     'column': ('しらべてから うごく',
                '<p>ステージ5では、ほしが ある マスと ない マスが まざって います。ばしょを おぼえて「2マスめと 4マスめで ひろう」と かくと、ほしの ばしょが かわったら つかえません。「もし ほしが あったら ひろう」と かけば、どんな ならびでも だいじょうぶ。これが「じょうけん ぶんき」の ちから です。</p>',
                'Check first, then act',
                '<p>In stage 5, some squares have stars and some don’t. If you memorize “pick up on squares 2 and 4”, it breaks when the stars move. If you write “if there is a star, pick it up”, it works for any layout. That is the power of conditions.</p>')},
    {'key': 'pyspace', 'boards': 'pyspace', 'icon': '🐍', 'py': True,
     'title': ('Python で うちゅう', 'Space in Python'),
     'lead': ('ほしあつめを <b>Python</b>で かきます。<code>forward()</code>・<code>turn_right()</code>・<code>pick_up()</code>、しらべる ときは <code>if has_star():</code>、さいごまで くりかえす ときは <code>while not mission_done():</code> を つかいます。',
              'Write star hunting in <b>Python</b>: <code>forward()</code>, <code>turn_right()</code>, <code>pick_up()</code>; check with <code>if has_star():</code>, and repeat to the end with <code>while not mission_done():</code>.'),
     'blocks': ('forward() ／ turn_right() ／ turn_left() ／ pick_up() ／ for i in range(4): ／ if has_star(): ／ while not mission_done():',
                'forward() / turn_right() / turn_left() / pick_up() / for i in range(4): / if has_star(): / while not mission_done():'),
     'column': ('while not の よみかた',
                '<p><code>while not mission_done():</code> は「ミッションが おわって いない あいだ、くりかえす」。<code>not</code> は「〜ではない」と いう いみ です。なかみは スペース 4つ さげて かこう。</p>',
                'How to read while not',
                '<p><code>while not mission_done():</code> means “repeat while the mission is not done”. <code>not</code> means “is not”. Indent the lines inside by 4 spaces.</p>')},
]
SAME_NOTE = None

OUTRO = (
    '''<h2>おわりに</h2>
<p>さいごまで よく がんばりました！ この ほんで つかった かんがえかたを ふりかえって みよう。</p>
<table class="sum"><tr><th>かんがえかた</th><th>どこで でてきた？</th></tr>
<tr><td>じゅんばん</td><td>すすむ・まがる・ひろう を ならべる（ステージ1・2）</td></tr>
<tr><td>くりかえし・パターン</td><td>「すすむ → ひろう」を まとめる（ステージ3・4）</td></tr>
<tr><td>もし（じょうけん）</td><td>ほしが ある ときだけ ひろう（ステージ5）</td></tr>
<tr><td>〜まで くりかえす</td><td>ミッション クリアまで（ステージ6・7）</td></tr>
<tr><td>Python</td><td>おなじ ことを ことば（コード）で かく</td></tr></table>
<p>ぜんぶの ステージを クリアしたら、「⚙ きのう」→「📜 しゅうりょうしょう」で しゅうりょうしょうが もらえます。</p>''',
    '''<h2>Well done!</h2>
<p>You worked hard to the end! Let’s look back at the ideas you used.</p>
<table class="sum"><tr><th>Idea</th><th>Where did it appear?</th></tr>
<tr><td>Order</td><td>Line up move, turn and pick up (stages 1–2)</td></tr>
<tr><td>Loops & patterns</td><td>Pack “move → pick up” together (stages 3–4)</td></tr>
<tr><td>If (conditions)</td><td>Pick up only when there is a star (stage 5)</td></tr>
<tr><td>Repeat until</td><td>Until the mission is complete (stages 6–7)</td></tr>
<tr><td>Python</td><td>Write the same thing in words (code)</td></tr></table>
<p>When you clear every stage, get your certificate from “⚙ Settings” → “📜 Certificate”.</p>''')

TEACHER = [
    (('指導編について', 'About this guide'),
     '''<p>本書は「うちゅうで ほしあつめ」（7ステージ）と「Pythonで うちゅう」（6ステージ）をまとめたものです。第1部は児童・生徒が自分で読み進められるよう、ひらがな・わかち書きで書いています。</p>
<p>本教材の中心は、その場の状況を「調べてから動く」条件分岐です。星のない場所で「ひろう」を実行すると失敗になるため、条件分岐を使う必然性が生まれます。最終ステージはランダムな宇宙30個でテストされ、どんな場面でも通用する手順（一般化）が求められます。</p>
<h3>本教材のねらい</h3>
<ul><li>順序・反復・条件分岐を組み合わせて、目的を達成する手順を作る。</li>
<li>状況を調べてから動くことのよさに気付き、説明する。</li>
<li>Python版で、if・while と関数呼び出しの書き方を知る。</li></ul>''',
     '''<p>This book covers “Space Star Hunt” (7 stages) and “Python Space” (6 stages). Part 1 is written in simple language for students.</p>
<p>The core idea is a condition: “check the situation, then act”. Picking up where there is no star fails, which makes conditions necessary. The final stage is tested on 30 random worlds, so students need a general method.</p>
<h3>Aims</h3>
<ul><li>Combine sequence, loops and conditions to reach a goal.</li>
<li>Notice and explain the value of checking before acting.</li>
<li>In Python, learn how to write if, while and function calls.</li></ul>'''),
    (('学習の全体像', 'Overview of the stages'), '{MAP}', '{MAP}'),
    (('進め方と指導のポイント', 'Suggested order and teaching points'),
     '''<table class="t"><tr><th>対象</th><th>扱うステージ</th><th>時数の目安</th><th>中心となる考え方</th></tr>
<tr><td>小3〜4</td><td>1〜4</td><td>1〜2時間</td><td>順序、反復、パターン</td></tr>
<tr><td>小4〜6</td><td>5〜7</td><td>2時間</td><td>条件分岐、〜まで繰り返す、一般化</td></tr>
<tr><td>小6〜中学</td><td>Python版 1〜6</td><td>2〜3時間</td><td>if・while、関数の呼び出し</td></tr></table>
<h3>つまずきと支援</h3>
<ul><li><b>星のない場所で拾う：</b>ステージ5で、場所を覚えた手順は配置が変わると使えないことを示し、「調べさせる」発想を引き出す。</li>
<li><b>くり返しと条件の入れ子：</b>1マス分の動き（すすむ→もし星があったら拾う）を言葉で言わせてから組ませる。</li>
<li><b>パターンの発見（ステージ4）：</b>階段を指でなぞらせ、くり返す「1セット」を囲ませる。</li>
<li><b>Python：</b><code>while not</code> の意味（〜でない間）と、字下げで範囲が決まることを確認する。</li></ul>
<h3>1単位時間（45分）の流れの例（ステージ5）</h3>
<table class="t"><tr><th>時間</th><th>学習活動</th><th>支援・留意点</th></tr>
<tr><td>導入 5分</td><td>星がある所とない所があることに気付き、めあてを確認する。</td><td>前時の「すすむ→ひろう」を想起させる。</td></tr>
<tr><td>展開 30分</td><td>場所に合わせた手順を作り、配置を変えると使えないことを確かめる。「もし」で作り直す。</td><td>ワークシート⑤に星の数を記録させる。</td></tr>
<tr><td>まとめ 10分</td><td>条件分岐のよさをまとめ、身の回りの例を話し合う。</td><td>自動ドア・センサーライトを紹介する。</td></tr></table>''',
     '''<table class="t"><tr><th>Students</th><th>Stages</th><th>Lessons</th><th>Key ideas</th></tr>
<tr><td>Grades 3–4</td><td>1–4</td><td>1–2</td><td>Order, loops, patterns</td></tr>
<tr><td>Grades 4–6</td><td>5–7</td><td>2</td><td>Conditions, repeat until, generalization</td></tr>
<tr><td>Grade 6 – junior high</td><td>Python 1–6</td><td>2–3</td><td>if/while, function calls</td></tr></table>
<h3>Common difficulties and support</h3>
<ul><li><b>Picking up where there is no star:</b> in stage 5, show that a memorized route breaks when the layout changes, and draw out the idea of “checking”.</li>
<li><b>Nesting a condition in a loop:</b> have students say one square’s action in words (move → if star, pick up) before building.</li>
<li><b>Finding the pattern (stage 4):</b> trace the stairs and circle the repeating “set”.</li>
<li><b>Python:</b> confirm what <code>while not</code> means and that indentation decides what is inside.</li></ul>
<h3>Example 45-minute lesson (stage 5)</h3>
<table class="t"><tr><th>Time</th><th>Activity</th><th>Support</th></tr>
<tr><td>Intro 5 min</td><td>Notice that some squares have stars and some don’t; share the goal.</td><td>Recall “move → pick up”.</td></tr>
<tr><td>Main 30 min</td><td>Build a route for this layout; see it break when the layout changes; rebuild with “if”.</td><td>Record the star count on Worksheet 5.</td></tr>
<tr><td>Wrap-up 10 min</td><td>Summarize the value of conditions; talk about real-life examples.</td><td>Automatic doors, sensor lights.</td></tr></table>'''),
    ASSESS,
    usage('03 うちゅうで ほしあつめ、07 Pythonで うちゅう', '03 Space Star Hunt, 07 Python Space', '⑤うちゅう・こわす・おく（順番と数の表）、⑦Python', '5 Space / Break & Build (order and count table), 7 Python'),
]
