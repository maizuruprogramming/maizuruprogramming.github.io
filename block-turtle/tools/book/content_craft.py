"""こわす・おく の ほん"""
from content_common import UI, AUTHOR, howto, ASSESS, usage  # noqa: F401

FILE = 'craft-book'
TITLE = ('こわして つくって まなぶ プログラミング', 'Learn Programming by Breaking & Building')
SUBTITLE = ('ブロックから Python まで ― ぼうけん 14ステージ', 'From blocks to Python — 14 adventure stages')
COVER_TAG = ('こども と 先生の ための', 'For kids and teachers')
PART1 = ('だい1ぶ　こどもの ための ぼうけんの ほん', 'Part 1　The adventure book for kids')
PART2 = ('だい2ぶ　先生・保護者の ための 指導編', 'Part 2　Guide for teachers and parents')
BOARD_LABEL = 'start'
COVER_IMG = 'craft-6'

HOWTO = howto('こわして つくる ぼうけん', 'Break & Build Quest')

APPS_TABLE = [
    (('こわして つくる ぼうけん', 'Break & Build Quest'), 'craft.html', 7, ('小4〜', 'Grade 4+')),
    (('Pythonで こわす・おく', 'Python Break & Build'), 'python-craft.html', 7, ('小5〜中学', 'Grade 5 – junior high')),
]

CH1_TITLE = ('こわして もって おいて すすもう', 'Break, carry, place and go')
CH1 = (
    '''<h2>こわして もって おいて すすもう</h2>
<p>たんけんかを うごかして、たからばこ まで すすみます。みちを ふさぐ いしブロックは こわし、みず には ブロックを おいて はしを かけます。</p>
<table class="t"><tr><th>めいれい</th><th>うごき</th></tr>
<tr><td>まえに すすむ ／ みぎ・ひだりを むく</td><td>1マス すすむ ／ その ばで むきを かえる</td></tr>
<tr><td>⛏ まえの ブロックを こわす</td><td>まえの いしを こわす。<b>もっている ブロックが 1こ ふえる</b></td></tr>
<tr><td>🧱 まえに ブロックを おく</td><td>まえに ブロックを おく（みずに おくと はし）。<b>もっている ブロックが 1こ へる</b></td></tr>
<tr><td>もし まえが ○○ だったら</td><td>まえが いし・みず・みち の どれかを しらべて きめる</td></tr>
<tr><td>ゴールに つくまで くりかえす</td><td>たからばこに つくまで くりかえす</td></tr></table>
<h3>この アプリの だいじな かんがえかた</h3>
<p>「<b>もっている かず</b>」を おぼえて おく こと。ブロックを もって いないと、はしは かけられません。さきに こわして から おく、と いう じゅんばんが だいじ です。コンピューターは、こうした かずを <b>へんすう</b> に おぼえて います。</p>
<h3>うまく いかない ときは</h3>
<ul><li>がめんの「もっている ブロック」の かずを みよう。</li><li>ワークシートに、1つ うごく たびに もっている かずを かいて みよう。</li></ul>''',
    '''<h2>Break, carry, place and go</h2>
<p>Move the explorer to the treasure chest. Break the stone blocks in the way, and place blocks on water to build bridges.</p>
<table class="t"><tr><th>Command</th><th>What it does</th></tr>
<tr><td>move forward / turn right, left</td><td>Move one square / change direction on the spot</td></tr>
<tr><td>⛏ break the block in front</td><td>Breaks the stone in front. <b>You carry one more block.</b></td></tr>
<tr><td>🧱 place a block in front</td><td>Places a block in front (on water it becomes a bridge). <b>You carry one less block.</b></td></tr>
<tr><td>if the front is ○○</td><td>Checks whether the front is stone, water or an open path</td></tr>
<tr><td>repeat until goal</td><td>Repeats until you reach the chest</td></tr></table>
<h3>The big idea in this app</h3>
<p>Remember <b>how many you carry</b>. With no blocks, you cannot build a bridge, so “break first, then place” matters. Computers keep numbers like this in <b>variables</b>.</p>
<h3>When it doesn’t work</h3>
<ul><li>Look at “Blocks you have” on the screen.</li><li>On the worksheet, write how many you carry after each move.</li></ul>''')

CHAPTERS = [
    {'key': 'craft', 'boards': 'craft', 'icon': '🧱',
     'title': ('こわして つくる ぼうけん', 'Break & Build Quest'),
     'lead': ('いしを こわして もち、みずに おいて はしを かけます。<b>じゅんばん → くりかえし → もっている かず → もし → 2つの もし</b> と すすみます。',
              'Break stone, carry it, and place it on water to build bridges. You will go from <b>order → loops → counting what you carry → if → two ifs</b>.'),
     'blocks': ('まえに すすむ ／ みぎ・ひだりを むく ／ ⛏ こわす ／ 🧱 おく ／ ○かい くりかえす ／ もし まえが ○○ だったら（そうでなければ）／ ゴールに つくまで くりかえす',
                'move forward / turn right, left / ⛏ break / 🧱 place / repeat ○ times / if the front is ○○ (else) / repeat until goal'),
     'column': ('ふえる・へる を かぞえよう',
                '<p>こわすと ＋1、おくと −1。ステージ6のように いしと みずが まざって いる ときは、「いま なんこ もっているか」を かぞえながら すすむと、たりなく なる ところが わかります。かぞえる ことは、プログラムを よむ ときの だいじな わざ です。</p>',
                'Count up and down',
                '<p>Breaking is +1, placing is −1. When stone and water are mixed, as in stage 6, counting “how many do I have now?” as you go shows where you would run out. Counting is an important skill for reading programs.</p>')},
    {'key': 'pycraft', 'boards': 'pycraft', 'icon': '🐍', 'py': True,
     'title': ('Python で こわす・おく', 'Break & Build in Python'),
     'lead': ('ぼうけんを <b>Python</b>で かきます。<code>mine()</code> で こわし、<code>place()</code> で おく。<code>if front_is(\'stone\'):</code> で しらべ、<code>elif</code> で 3つ いじょうに わけます。',
              'Write the adventure in <b>Python</b>: <code>mine()</code> breaks and <code>place()</code> places. Check with <code>if front_is(\'stone\'):</code> and split into three or more cases with <code>elif</code>.'),
     'blocks': ("forward() ／ turn_right() ／ mine() ／ place() ／ for i in range(3): ／ if front_is('stone'): ／ elif front_is('water'): ／ while not at_goal():",
                "forward() / turn_right() / mine() / place() / for i in range(3): / if front_is('stone'): / elif front_is('water'): / while not at_goal():"),
     'column': ('elif の つかいかた',
                "<p><code>if</code> → <code>elif</code> → <code>else</code> は、うえから じゅんばんに しらべて、さいしょに あてはまった ところ だけを する しくみ です。「いしなら こわす、そうでなくて みずなら おく、どちらでもなければ すすむ」の ように、3つ いじょうに わけられます。<code>'stone'</code> の ' も わすれずに。</p>",
                'How to use elif',
                "<p><code>if</code> → <code>elif</code> → <code>else</code> checks from the top and runs only the first one that matches. Like “if stone, break; else if water, place; otherwise move”, you can split into three or more cases. Don’t forget the quotes in <code>'stone'</code>.</p>")},
]
SAME_NOTE = None

OUTRO = (
    '''<h2>おわりに</h2>
<p>さいごまで よく がんばりました！ この ほんで つかった かんがえかたを ふりかえって みよう。</p>
<table class="sum"><tr><th>かんがえかた</th><th>どこで でてきた？</th></tr>
<tr><td>じゅんばん</td><td>こわす → もつ → おく（ステージ1・2）</td></tr>
<tr><td>くりかえし</td><td>「こわす → すすむ」を まとめる（ステージ3・4）</td></tr>
<tr><td>もっている かず</td><td>ふえる・へる を かぞえる（ステージ2・4・6）</td></tr>
<tr><td>もし（じょうけん）</td><td>いしの ときだけ こわす、みずには おく（ステージ5・6）</td></tr>
<tr><td>〜まで くりかえす</td><td>しらべながら ゴールまで（ステージ7）</td></tr>
<tr><td>Python</td><td>if・elif・else で わける</td></tr></table>
<p>ぜんぶの ステージを クリアしたら、「⚙ きのう」→「📜 しゅうりょうしょう」で しゅうりょうしょうが もらえます。</p>''',
    '''<h2>Well done!</h2>
<p>You worked hard to the end! Let’s look back at the ideas you used.</p>
<table class="sum"><tr><th>Idea</th><th>Where did it appear?</th></tr>
<tr><td>Order</td><td>Break → carry → place (stages 1–2)</td></tr>
<tr><td>Loops</td><td>Pack “break → move” together (stages 3–4)</td></tr>
<tr><td>Counting what you carry</td><td>Up and down (stages 2, 4, 6)</td></tr>
<tr><td>If (conditions)</td><td>Break only stone, place on water (stages 5–6)</td></tr>
<tr><td>Repeat until</td><td>Check as you go to the goal (stage 7)</td></tr>
<tr><td>Python</td><td>Split cases with if / elif / else</td></tr></table>
<p>When you clear every stage, get your certificate from “⚙ Settings” → “📜 Certificate”.</p>''')

TEACHER = [
    (('指導編について', 'About this guide'),
     '''<p>本書は「こわして つくる ぼうけん」（7ステージ）と「Pythonで こわす・おく」（7ステージ）をまとめたものです。第1部は児童・生徒が自分で読み進められるよう、ひらがな・わかち書きで書いています。</p>
<p>本教材では、石を壊すとブロックが1個増え、水に置くと1個減ります。持っている数（状態）が後の命令に影響するため、手順の順序に必然性が生まれ、変数の考え方の素地となります。後半では、石・水・道の場合分け（条件分岐）を組み合わせます。</p>
<h3>本教材のねらい</h3>
<ul><li>持っている数の増減を考えながら、手順の順序を組み立てる。</li>
<li>複数の条件で行動を分けるプログラムを作る。</li>
<li>Python版で、if・elif・else による多分岐を知る。</li></ul>''',
     '''<p>This book covers “Break & Build Quest” (7 stages) and “Python Break & Build” (7 stages). Part 1 is written in simple language for students.</p>
<p>Breaking stone adds one block; placing on water takes one away. Because the count (state) affects later commands, order really matters, which builds a basis for variables. Later stages combine cases (stone, water, path) with conditions.</p>
<h3>Aims</h3>
<ul><li>Plan the order of steps while thinking about how the count changes.</li>
<li>Build programs that choose actions under several conditions.</li>
<li>In Python, learn multi-way branching with if / elif / else.</li></ul>'''),
    (('学習の全体像', 'Overview of the stages'), '{MAP}', '{MAP}'),
    (('進め方と指導のポイント', 'Suggested order and teaching points'),
     '''<table class="t"><tr><th>対象</th><th>扱うステージ</th><th>時数の目安</th><th>中心となる考え方</th></tr>
<tr><td>小4〜5</td><td>1〜4</td><td>1〜2時間</td><td>順序、反復、数の増減</td></tr>
<tr><td>小5〜6</td><td>5〜7</td><td>2時間</td><td>条件分岐（2つの条件）、〜まで繰り返す</td></tr>
<tr><td>小6〜中学</td><td>Python版 1〜7</td><td>2〜3時間</td><td>if・elif・else、while</td></tr></table>
<h3>つまずきと支援</h3>
<ul><li><b>持たずに置く：</b>ステージ2で、先に壊さないと置けないことを、持っている数の表示で確認させる。</li>
<li><b>数の管理：</b>ワークシート⑤の表に、1手ごとの持っている数を書かせる。</li>
<li><b>2つの条件（ステージ6）：</b>「どんなときに、何をするか」を言葉で整理してからプログラムにさせる。</li>
<li><b>Python：</b><code>front_is('stone')</code> の引用符、<code>elif</code> の順番（上から調べる）に注意させる。</li></ul>
<h3>1単位時間（45分）の流れの例（ステージ4〜6）</h3>
<table class="t"><tr><th>時間</th><th>学習活動</th><th>支援・留意点</th></tr>
<tr><td>導入 5分</td><td>壊すと増え、置くと減ることを確認し、めあてを確かめる。</td><td>画面の持ち物表示に注目させる。</td></tr>
<tr><td>展開 30分</td><td>長い橋をかけ、石があるときだけ壊し、石と水で行動を分ける。</td><td>表に持っている数を記録させる。</td></tr>
<tr><td>まとめ 10分</td><td>持っている数と場合分けのよさをまとめる。</td><td>「変数」という言葉を紹介する。</td></tr></table>''',
     '''<table class="t"><tr><th>Students</th><th>Stages</th><th>Lessons</th><th>Key ideas</th></tr>
<tr><td>Grades 4–5</td><td>1–4</td><td>1–2</td><td>Order, loops, counting up and down</td></tr>
<tr><td>Grades 5–6</td><td>5–7</td><td>2</td><td>Conditions (two cases), repeat until</td></tr>
<tr><td>Grade 6 – junior high</td><td>Python 1–7</td><td>2–3</td><td>if / elif / else, while</td></tr></table>
<h3>Common difficulties and support</h3>
<ul><li><b>Placing with nothing to place:</b> in stage 2, use the on-screen count to show you must break first.</li>
<li><b>Keeping count:</b> have students write the count after each move in the Worksheet 5 table.</li>
<li><b>Two conditions (stage 6):</b> have students say “when, and what to do” in words before building.</li>
<li><b>Python:</b> watch the quotes in <code>front_is('stone')</code> and the order of <code>elif</code> (checked from the top).</li></ul>
<h3>Example 45-minute lesson (stages 4–6)</h3>
<table class="t"><tr><th>Time</th><th>Activity</th><th>Support</th></tr>
<tr><td>Intro 5 min</td><td>Confirm that breaking adds and placing takes away; share the goal.</td><td>Point to the on-screen count.</td></tr>
<tr><td>Main 30 min</td><td>Build a long bridge; break only stone; split actions for stone and water.</td><td>Record the count in a table.</td></tr>
<tr><td>Wrap-up 10 min</td><td>Summarize the value of counting and cases.</td><td>Introduce the word “variable”.</td></tr></table>'''),
    ASSESS,
    usage('04 こわして つくる ぼうけん、08 Pythonで こわす・おく', '04 Break & Build Quest, 08 Python Break & Build', '⑤うちゅう・こわす・おく（順番と数の表）、⑦Python', '5 Space / Break & Build (order and count table), 7 Python'),
]
