"""はたけの ほん"""
from content_common import UI, AUTHOR, howto, ASSESS, usage  # noqa: F401

FILE = 'farm-book'
TITLE = ('はたけで まなぶ プログラミング', 'Learn Programming on the Farm')
SUBTITLE = ('ブロックから Python まで ― はたけ 14ステージ', 'From blocks to Python — 14 farm stages')
COVER_TAG = ('こども と 先生の ための', 'For kids and teachers')
PART1 = ('だい1ぶ　こどもの ための はたけの ほん', 'Part 1　The farm book for kids')
PART2 = ('だい2ぶ　先生・保護者の ための 指導編', 'Part 2　Guide for teachers and parents')
BOARD_LABEL = 'start'
COVER_IMG = 'farm-6'

HOWTO = howto('はたけで そだてよう', 'Block Farm')

APPS_TABLE = [
    (('はたけで そだてよう', 'Block Farm'), 'farm.html', 7, ('小3〜', 'Grade 3+')),
    (('Pythonで はたけ', 'Python Farm'), 'python-farm.html', 7, ('小5〜中学', 'Grade 5 – junior high')),
]

CH1_TITLE = ('たねを まいて、そだてて、とる', 'Plant, grow and harvest')
CH1 = (
    '''<h2>たねを まいて、そだてて、とる</h2>
<p>のうかの ロボットを うごかして、はたけの しごとを します。つちの マスに 🌱 たねを まき、💧 みずを やると めが でます。🍅 みが なっている マスでは、みを とって かごに いれます。</p>
<table class="t"><tr><th>めいれい</th><th>うごき</th></tr>
<tr><td>まえに すすむ</td><td>むいている ほうへ 1マス すすむ（くさの うえも あるける。はたけの そとには でられない）</td></tr>
<tr><td>みぎを むく ／ ひだりを むく</td><td>その ばで むきを かえる（すすまない）</td></tr>
<tr><td>🌱 たねを まく</td><td>つちの マスに たねを まく</td></tr>
<tr><td>💧 みずを やる</td><td>たねに やると めが でる。たねが ない ところでは しっぱい</td></tr>
<tr><td>🍅 みを とる</td><td>みが なっている マスで とって、かごに いれる</td></tr>
<tr><td>もし ここに 🍅 みが なっていたら</td><td>みが ある ときだけ なかの めいれいを する（「でなければ」も つかえる）</td></tr>
<tr><td>⭐ じぶんの ブロック</td><td>ブロックの まとまりに なまえを つけて、なんども つかう</td></tr>
<tr><td>🔢 とれた かず</td><td>とった かずを おぼえて おく「へんすう」。5こに なったら とめる</td></tr></table>
<h3>この アプリの だいじな かんがえかた</h3>
<p>1つめは「<b>じゅんばん</b>」。みずを さきに やっても めは でません。2つめは「<b>なまえを つけて まとめる</b>」。おなじ てじゅんを なんども くむ かわりに、じぶんの ブロックに します。3つめは「<b>かぞえて とめる</b>」。かごに はいる かずには きまりが あります。</p>
<h3>うまく いかない ときは</h3>
<ul><li>ロボットが どこで とまったか、どの マスが のこって いるかを みよう。</li><li>ワークシート⑨に、1マス すすむ たびの「とれた かず」を かいて みよう。</li></ul>''',
    '''<h2>Plant, grow and harvest</h2>
<p>Move the farm robot and do the farm work. Plant a 🌱 seed on a soil square, and 💧 water it to make a sprout come up. Where a 🍅 is ripe, harvest it into the basket.</p>
<table class="t"><tr><th>Command</th><th>What it does</th></tr>
<tr><td>move forward</td><td>Moves one square the way it is facing (you can walk on grass, but not off the farm)</td></tr>
<tr><td>turn right / turn left</td><td>Changes direction on the spot (does not move)</td></tr>
<tr><td>🌱 plant a seed</td><td>Plants a seed on a soil square</td></tr>
<tr><td>💧 water</td><td>Watering a seed makes a sprout come up. Fails where there is no seed</td></tr>
<tr><td>🍅 harvest</td><td>Picks the ripe fruit on this square and puts it in the basket</td></tr>
<tr><td>if a 🍅 is ripe here</td><td>Runs the commands inside only when it is ripe (you can add “else”)</td></tr>
<tr><td>⭐ my block</td><td>Gives a group of blocks a name so you can use it again and again</td></tr>
<tr><td>🔢 harvested</td><td>A variable that remembers how many you picked. Stop at 5</td></tr></table>
<h3>The big ideas in this app</h3>
<p>First, <b>order</b>: watering first does not make a sprout. Second, <b>naming a group of steps</b>: instead of building the same steps again and again, make your own block. Third, <b>counting and stopping</b>: the basket only holds so many.</p>
<h3>When it doesn’t work</h3>
<ul><li>Look where the robot stopped and which squares are left.</li><li>On Worksheet 9, write what “harvested” is after each move.</li></ul>''')

CHAPTERS = [
    {'key': 'farm', 'boards': 'farm', 'icon': '🌱',
     'title': ('はたけで そだてよう', 'Block Farm'),
     'lead': ('はたけを そだてます。<b>じゅんばん → くりかえし → パターン → じぶんの ブロック → もし → へんすう</b> と すすみます。さいごの ステージは、みの ばしょが ちがう はたけ 20こで テストされます。',
              'Grow the farm. You will go from <b>order → loops → patterns → your own blocks → if → variables</b>. The last stage is tested on 20 farms where the ripe spots change.'),
     'blocks': ('まえに すすむ ／ みぎ・ひだりを むく ／ 🌱 たねを まく ／ 💧 みずを やる ／ 🍅 みを とる ／ ○かい くりかえす ／ もし ここに 🍅 みが なっていたら（でなければ） ／ ⭐ じぶんの ブロック「○○」を つくる・よぶ ／ 🔢 とれた かず を ○ に する・1 ふやす・○ より すくない あいだ くりかえす',
                'move forward / turn right, left / 🌱 plant a seed / 💧 water / 🍅 harvest / repeat ○ times / if a 🍅 is ripe here (else) / ⭐ make / use my block “○○” / 🔢 set harvested to ○, add 1, repeat while harvested is less than ○'),
     'column': ('なまえを つけて まとめる',
                '<p>ステージ4では「4かい くりかえす（すすむ・まく・みず）」を 2かい くみました。ステージ5は 3れつ。おなじ ものを 3かい くむと、ブロックが おおすぎます。そこで、この まとまりに「1れつ うえる」と なまえを つけて、じぶんの ブロックに します。なまえを みれば なにを するか わかるので、プログラムが よみやすく なります。りょうりの「したごしらえ」や、たいそうの「だい1」のように、まとまりに なまえを つけるのは みのまわりにも ある くふう です。</p>',
                'Name a group of steps',
                '<p>In stage 4 you built “repeat 4 (move, plant, water)” twice. Stage 5 has three rows; building the same thing three times takes too many blocks. So give this group a name, “plant a row”, and make it your own block. The name tells you what it does, so the program is easier to read. Naming a group of steps is something we do every day, like “prep” in a recipe.</p>')},
    {'key': 'pyfarm', 'boards': 'pyfarm', 'icon': '🐍', 'py': True,
     'title': ('Python で はたけ', 'The Farm in Python'),
     'lead': ('はたけを <b>Python</b>で かきます。<code>plant()</code>・<code>water()</code>・<code>harvest()</code>、しらべる ときは <code>if is_ripe():</code>。<code>def plant_row():</code> で じぶんの めいれいを つくり、へんすう <code>count</code> で かぞえます。',
              'Write the farm in <b>Python</b>: <code>plant()</code>, <code>water()</code>, <code>harvest()</code>; check with <code>if is_ripe():</code>. Make your own command with <code>def plant_row():</code> and count with the variable <code>count</code>.'),
     'blocks': ('forward() ／ turn_right() ／ turn_left() ／ plant() ／ water() ／ harvest() ／ for i in range(4): ／ if is_ripe(): ／ else: ／ def plant_row(): ／ count = 0 ／ count += 1 ／ while count &lt; 5:',
                'forward() / turn_right() / turn_left() / plant() / water() / harvest() / for i in range(4): / if is_ripe(): / else: / def plant_row(): / count = 0 / count += 1 / while count &lt; 5:'),
     'column': ('def と へんすうの きまり',
                '<p><code>def plant_row():</code> は「plant_row という めいれいを つくる」。なかみは スペース 4つ さげて かきます。def は つかう ところより <b>うえ</b>に かこう（したに かくと NameError）。<code>count = 0</code> は「count という はこに 0 を いれる」、<code>count += 1</code> は「1 ふやす」、<code>while count &lt; 5:</code> は「5 より すくない あいだ くりかえす」と よみます。</p>',
                'Rules for def and variables',
                '<p><code>def plant_row():</code> means “make a command called plant_row”. Indent its body by 4 spaces, and write def <b>above</b> the place you use it (below gives a NameError). Read <code>count = 0</code> as “put 0 in the box called count”, <code>count += 1</code> as “add 1”, and <code>while count &lt; 5:</code> as “repeat while it is less than 5”.</p>')},
]
SAME_NOTE = ('ブロック版の ステージ{n}と おなじ はたけ', 'Same farm as block stage {n}')

OUTRO = (
    '''<h2>おわりに</h2>
<p>さいごまで よく がんばりました！ この ほんで つかった かんがえかたを ふりかえって みよう。</p>
<table class="sum"><tr><th>かんがえかた</th><th>どこで でてきた？</th></tr>
<tr><td>じゅんばん</td><td>まく → みず の じゅん（ステージ1・2）</td></tr>
<tr><td>くりかえし・パターン</td><td>「すすむ → まく → みず」を まとめる、れつを かえる（ステージ3・4）</td></tr>
<tr><td>じぶんの ブロック（かんすう）</td><td>「1れつ うえる」を つくって 3かい つかう（ステージ5）</td></tr>
<tr><td>もし（じょうけん）</td><td>みが なっていたら とる、でなければ みず（ステージ6）</td></tr>
<tr><td>へんすう</td><td>とれた かずを かぞえて 5こで とめる（ステージ7）</td></tr>
<tr><td>Python</td><td>おなじ ことを ことば（コード）で かく。def と count</td></tr></table>
<p>ぜんぶの ステージを クリアしたら、「⚙ きのう」→「📜 しゅうりょうしょう」で しゅうりょうしょうが もらえます。</p>''',
    '''<h2>Well done!</h2>
<p>You worked hard to the end! Let’s look back at the ideas you used.</p>
<table class="sum"><tr><th>Idea</th><th>Where did it appear?</th></tr>
<tr><td>Order</td><td>Plant, then water (stages 1–2)</td></tr>
<tr><td>Loops & patterns</td><td>Pack “move → plant → water” together; change rows (stages 3–4)</td></tr>
<tr><td>Your own blocks (functions)</td><td>Make “plant a row” and use it 3 times (stage 5)</td></tr>
<tr><td>If (conditions)</td><td>Harvest if ripe, otherwise water (stage 6)</td></tr>
<tr><td>Variables</td><td>Count what you harvest and stop at 5 (stage 7)</td></tr>
<tr><td>Python</td><td>Write the same thing in words (code), with def and count</td></tr></table>
<p>When you clear every stage, get your certificate from “⚙ Settings” → “📜 Certificate”.</p>''')

TEACHER = [
    (('指導編について', 'About this guide'),
     '''<p>本書は「はたけで そだてよう」（7ステージ）と「Pythonで はたけ」（7ステージ）をまとめたものです。第1部は児童・生徒が自分で読み進められるよう、ひらがな・わかち書きで書いています。</p>
<p>本教材は、ほかのアプリでは扱っていない<b>関数（自分のブロック）</b>と<b>変数（数を覚えておく仕組み）</b>を、必要感のある場面で初めて扱います。ステージ5は自分のブロックを使わないとブロック数の目安（16個）を超え、ステージ7はかごに5個しか入らず、実のなる場所が違う畑20個でテストされるため、決まった回数のくり返しでは解けません。</p>
<h3>本教材のねらい</h3>
<ul><li>順序・反復・条件分岐に加え、手順のまとまりに名前を付けて使う（関数）ことができる。</li>
<li>数を覚えておいて、条件に合ったところで止める（変数）手順を考えることができる。</li>
<li>Python版で、def による関数の定義と呼び出し、代入（=、+=）と比べる式（&lt;）の書き方を知る。</li></ul>''',
     '''<p>This book covers “Block Farm” (7 stages) and “Python Farm” (7 stages). Part 1 is written in simple language for students.</p>
<p>This app is the first in the series to teach <b>functions (your own blocks)</b> and <b>variables (remembering a number)</b> where they are really needed. In stage 5, not using your own block goes over the block target (16). In stage 7 the basket holds only 5 and the program is tested on 20 farms with different ripe spots, so a fixed number of repeats does not work.</p>
<h3>Aims</h3>
<ul><li>Besides sequence, loops and conditions, name a group of steps and reuse it (functions).</li>
<li>Remember a number and stop when a condition is met (variables).</li>
<li>In Python, learn to define and call functions with def, and to write assignments (=, +=) and comparisons (&lt;).</li></ul>'''),
    (('学習の全体像', 'Overview of the stages'), '{MAP}', '{MAP}'),
    (('進め方と指導のポイント', 'Suggested order and teaching points'),
     '''<table class="t"><tr><th>対象</th><th>扱うステージ</th><th>時数の目安</th><th>中心となる考え方</th></tr>
<tr><td>小3〜4</td><td>1〜4</td><td>1〜2時間</td><td>順序、反復、パターン</td></tr>
<tr><td>小4〜6</td><td>5〜7</td><td>2時間</td><td>関数（自分のブロック）、条件分岐、変数</td></tr>
<tr><td>小6〜中学</td><td>Python版 1〜7</td><td>2〜3時間</td><td>def、if・else、代入と while</td></tr></table>
<h3>つまずきと支援</h3>
<ul><li><b>順序（ステージ2）：</b>水を先にやると「たねが まだ ないよ」で止まる。実際の栽培と結びつけ、順序に意味があることを確認する。</li>
<li><b>列の端で回る（ステージ4）：</b>畑の外側の草のマスに一度出てから回ることを、指でなぞって確かめさせる。</li>
<li><b>自分のブロック（ステージ5）：</b>前時のプログラムの同じかたまりを丸で囲ませ、「このかたまりに名前を付けたら？」と問う。「つくる」ブロックはどこにもつながず置くことを確認する。</li>
<li><b>条件分岐（ステージ6）：</b>「実がなっていたら取る、まだなら水」と言葉で言わせてから組ませる。</li>
<li><b>変数（ステージ7）：</b>ワークシート⑨の表に、1マスごとの「とれた かず」を記録させる。「7かい くりかえす」だけでは かごがあふれる畑があることを確かめる。</li>
<li><b>Python：</b>def は呼ぶ場所より上に書くこと、<code>count += 1</code> を if の中に書くこと（字下げ）を確認する。</li></ul>
<h3>1単位時間（45分）の流れの例（ステージ5）</h3>
<table class="t"><tr><th>時間</th><th>学習活動</th><th>支援・留意点</th></tr>
<tr><td>導入 5分</td><td>3列の畑を見て、前時の2列のプログラムを広げたときのブロック数を予想する。</td><td>目安（16個）を示す。</td></tr>
<tr><td>展開 30分</td><td>同じかたまりを見つけて囲み、自分のブロック「1れつ うえる」を作って3回使う。</td><td>ワークシート⑨の1に中身と使う回数を書かせる。</td></tr>
<tr><td>まとめ 10分</td><td>「よく使う手順に名前を付けると、短く分かりやすくなる」とまとめる。</td><td>レシピの「下ごしらえ」など身近な例を紹介する。</td></tr></table>''',
     '''<table class="t"><tr><th>Students</th><th>Stages</th><th>Lessons</th><th>Key ideas</th></tr>
<tr><td>Grades 3–4</td><td>1–4</td><td>1–2</td><td>Order, loops, patterns</td></tr>
<tr><td>Grades 4–6</td><td>5–7</td><td>2</td><td>Functions (your own blocks), conditions, variables</td></tr>
<tr><td>Grade 6 – junior high</td><td>Python 1–7</td><td>2–3</td><td>def, if/else, assignment and while</td></tr></table>
<h3>Common difficulties and support</h3>
<ul><li><b>Order (stage 2):</b> watering first stops with “There is no seed yet.” Link this to real gardening so the order makes sense.</li>
<li><b>Turning at the end of a row (stage 4):</b> have students trace stepping out onto the grass before turning.</li>
<li><b>Your own block (stage 5):</b> have students circle the repeated group in the previous program and ask, “What if we gave it a name?” Note that “make my block” is placed on its own, not connected.</li>
<li><b>Conditions (stage 6):</b> have students say “harvest if ripe, otherwise water” before building.</li>
<li><b>Variables (stage 7):</b> record “harvested” after each square on Worksheet 9, and check that “repeat 7” alone overfills the basket on some farms.</li>
<li><b>Python:</b> write def above where it is called, and put <code>count += 1</code> inside the if (indentation).</li></ul>
<h3>Example 45-minute lesson (stage 5)</h3>
<table class="t"><tr><th>Time</th><th>Activity</th><th>Support</th></tr>
<tr><td>Intro 5 min</td><td>Look at the three-row farm and predict how many blocks the two-row program would need.</td><td>Show the target (16).</td></tr>
<tr><td>Main 30 min</td><td>Find and circle the repeated group, make “plant a row” and use it three times.</td><td>Write the contents and the number of uses on Worksheet 9.</td></tr>
<tr><td>Wrap-up 10 min</td><td>Summarize: “Naming steps you use often makes programs short and clear.”</td><td>Everyday examples such as “prep” in a recipe.</td></tr></table>'''),
    ASSESS,
    usage('（はたけのスライドは準備中です）', '(Farm slides are in preparation)', '⑨はたけ（自分のブロックと数える変数）、⑦Python', '9 Farm (your own block and a counting variable), 7 Python'),
]
