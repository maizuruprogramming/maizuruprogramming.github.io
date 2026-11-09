"""めいろの ほん：ぶんしょう（にほんご ／ English）
ステージの もんだい・ヒント・こたえは guide-data.js から よみこむ。ここには それ いがいの ぶんしょうを おく。
"""

TITLE = ('めいろで まなぶ プログラミング', 'Learn Programming with Mazes')
SUBTITLE = ('ブロックから Python まで ― ぜんぶの めいろ 41ステージ', 'From blocks to Python — all 41 maze stages')
AUTHOR = ('舞鶴工業高等専門学校　井上泰仁', 'National Institute of Technology, Maizuru College — Yasuhito Inoue')
PART1 = ('だい1ぶ　こどもの ための めいろの ほん', 'Part 1　The maze book for kids')
PART2 = ('だい2ぶ　先生・保護者の ための 指導編', 'Part 2　Guide for teachers and parents')

UI = {
    'toc': ('もくじ', 'Contents'),
    'q': ('もんだい', 'Problem'), 'goal': ('めあて', 'Goal'), 'hint': ('💡 ヒント（こまったら みてね）', '💡 Hint (look if you get stuck)'),
    'limit': ('🎯 めやす：ブロック {n}こ いないで クリア', '🎯 Target: {n} blocks or fewer'), 'pylimit': ('', ''),
    'memo': ('✏ じぶんの かんがえを かいてみよう', '✏ Write your own idea'),
    'next': ('こたえは つぎの ページ →', 'The answer is on the next page →'),
    'answer': ('📖 こたえ', '📖 Answer'), 'point': ('✨ ポイント', '✨ Key point'), 'mistake': ('⚠ よく ある まちがい', '⚠ Common mistake'),
    'video': ('🎬 かいせつ どうが：', '🎬 Video: '),
    'sample': ('れい：めいろは じっこうする たびに かわるよ', 'Example: the maze changes every time you run'),
    'same': ('ブロックの {app} ステージ{n} と おなじ めいろ', 'Same maze as {app} stage {n}'),
    'board': ('めいろ', 'Maze'),
    'chapter': ('だい{n}しょう', 'Chapter {n}'),
    'column': ('コラム', 'Column'),
}

LEGEND = [
    ('S', ('スタート（たんけんか）。さんかくの ほうが「まえ」', 'Start (the explorer). The triangle shows "forward"')),
    ('G', ('ゴールの ダイヤ', 'The goal diamond')),
    ('#', ('いわ（とおれない）', 'Rock (you cannot pass)')),
    ('.', ('みち', 'Path')),
    ('K', ('かぎ', 'Key')),
    ('D', ('とびら（かぎで あく）', 'Door (opens with a key)')),
    ('E', ('スライム（いったり きたり する）', 'Slime (goes back and forth)')),
    ('e', ('スライムが とおる みち', 'The slime\'s track')),
]

# ── だい1ぶ ──────────────────────────────────────────────
HOWTO = (
    '''<h2>この ほんの つかいかた</h2>
<p>この ほんは、パソコンや タブレットの「ブロックで めいろ」の アプリと いっしょに つかう ほん です。たんけんかを ゴールの ダイヤ 💎 まで うごかす プログラムを、じぶんで かんがえて つくります。</p>
<div class="steps">
<div><b>1</b><span>ひだりの ページで <b>もんだい</b>と <b>めいろ</b>を よむ。</span></div>
<div><b>2</b><span>たんけんかに なった つもりで、ゆびで みちを なぞって かんがえる。</span></div>
<div><b>3</b><span>アプリで ブロックを くんで「▶ じっこう」。うまく いかなかったら、どこで とまったかを みて なおす。</span></div>
<div><b>4</b><span>こまったら <b>💡 ヒント</b>。できたら ページを めくって <b>📖 こたえ</b>と <b>✨ ポイント</b>を たしかめる。</span></div>
</div>
<p class="note">こたえは 1つ だけでは ありません。ほんと ちがう くみかたでも、ゴールに つけば せいかい です。まちがいは「ヒント」。なんども ためして みよう！</p>
<h3>この ほんに でてくる めいろ</h3>''',
    '''<h2>How to use this book</h2>
<p>Use this book together with the “Block Maze” apps on a computer or tablet. You will think about and build programs that move the explorer to the diamond 💎.</p>
<div class="steps">
<div><b>1</b><span>Read the <b>problem</b> and look at the <b>maze</b>.</span></div>
<div><b>2</b><span>Pretend you are the explorer. Trace the path with your finger.</span></div>
<div><b>3</b><span>Build the blocks in the app and press “▶ Run”. If it doesn’t work, see where it stopped and fix it.</span></div>
<div><b>4</b><span>Stuck? Look at the <b>💡 Hint</b>. When you are done, turn the page and check the <b>📖 Answer</b> and the <b>✨ Key point</b>.</span></div>
</div>
<p class="note">There is more than one right answer. If you reach the goal, your program is correct, even if it is different from the book. Mistakes are hints — try again and again!</p>
<h3>Mazes in this book</h3>''')

APPS_TABLE = [
    # (しょう, アプリ, ファイル, ステージかず, がくねん)
    (('やじるしの めいろ', 'Arrow Maze'), 'maze-junior.html', 6, ('小1〜', 'Grade 1+')),
    (('ブロックで めいろ', 'Block Maze'), 'maze.html', 8, ('小2〜', 'Grade 2+')),
    (('かぎと とびらの めいろ', 'Keys & Doors Maze'), 'maze-key.html', 4, ('小4〜', 'Grade 4+')),
    (('てきを よける めいろ', 'Dodge the Slime Maze'), 'maze-enemy.html', 4, ('小4〜', 'Grade 4+')),
    (('Python で めいろ（4つ）', 'Python mazes (4 apps)'), 'python.html ほか / and others', 19, ('小5〜中学', 'Grade 5 – junior high')),
]

CH1 = (
    '''<h2>プログラムって なに？</h2>
<p><b>プログラム</b>は、コンピューターへの「やること リスト」です。コンピューターは とても すなおで、かいてある とおりに、<b>うえから じゅんばんに</b> うごきます。かいていない ことは してくれません。</p>
<p>この ほんでは、たんけんかに めいれいを だして、めいろの ゴールまで つれて いきます。めいれいは「ブロック」を つなげて つくります。</p>
<div class="screen">
  <div class="sc-left"><div class="sc-cap">ブロックを えらぶ ところ</div><div class="blk g">まえに すすむ</div><div class="blk g">みぎを むく ↻</div><div class="blk g">ひだりを むく ↺</div><div class="blk o">4 かい くりかえす</div></div>
  <div class="sc-mid"><div class="sc-cap">ブロックを くむ ところ</div><div class="blk g">まえに すすむ</div><div class="blk g">まえに すすむ</div><div class="blk g">みぎを むく ↻</div><div class="blk g">まえに すすむ</div></div>
  <div class="sc-right"><div class="sc-cap">めいろ</div>{BOARD}<div class="btns"><span>▶ じっこう</span><span>↺ もとに もどす</span></div></div>
</div>
<p class="cap">がめんの ようす（イメージ）。ひだりから ブロックを ひっぱって きて、たてに つなげます。</p>
<h3>「まえ」は どっち？</h3>
<p>たんけんかの「まえ」は、たんけんかが むいている ほう です。この ほんの めいろでは、たんけんかの さんかく ▶ が むいている ほうが「まえ」です。「みぎを むく」は、たんけんかから みた みぎ です。めいろを まわして みたり、じぶんの からだで むきを かえて みると わかりやすいよ。</p>
<h3>うまく いかない ときは</h3>
<ul><li>たんけんかが どこで とまったか、どこで いわに ぶつかったかを みよう。</li><li>プログラムを うえから 1つずつ ゆびで たどって みよう。</li><li>まちがいを みつけて なおす ことを <b>デバッグ</b> と いいます。プログラマーも まいにち やって いる ことです。</li></ul>''',
    '''<h2>What is a program?</h2>
<p>A <b>program</b> is a “to-do list” for a computer. A computer does exactly what is written, <b>in order from top to bottom</b>. It does not do anything that is not written.</p>
<p>In this book you give commands to the explorer and lead them to the goal. You make the commands by snapping “blocks” together.</p>
<div class="screen">
  <div class="sc-left"><div class="sc-cap">Pick blocks here</div><div class="blk g">move forward</div><div class="blk g">turn right ↻</div><div class="blk g">turn left ↺</div><div class="blk o">repeat 4 times</div></div>
  <div class="sc-mid"><div class="sc-cap">Build here</div><div class="blk g">move forward</div><div class="blk g">move forward</div><div class="blk g">turn right ↻</div><div class="blk g">move forward</div></div>
  <div class="sc-right"><div class="sc-cap">Maze</div>{BOARD}<div class="btns"><span>▶ Run</span><span>↺ Reset</span></div></div>
</div>
<p class="cap">What the screen looks like (sketch). Drag blocks from the left and stack them.</p>
<h3>Which way is “forward”?</h3>
<p>“Forward” is the way the explorer is facing. In this book, the triangle ▶ on the explorer points “forward”. “Turn right” means the explorer’s right. Turning the book, or turning your own body, helps.</p>
<h3>When it doesn’t work</h3>
<ul><li>Look where the explorer stopped, or where it bumped into a rock.</li><li>Follow the program one block at a time with your finger.</li><li>Finding and fixing mistakes is called <b>debugging</b>. Programmers do it every day.</li></ul>''')

# しょう：(guide の キー, ページ, ステージの map の キー, タイトル, リード, つかう ブロック, コラム)
CHAPTERS = [
    {'key': 'mazejr', 'maps': 'junior', 'icon': '🧭',
     'title': ('やじるしの めいろ', 'The Arrow Maze'),
     'lead': ('うえ ⬆・した ⬇・ひだり ⬅・みぎ ➡ の やじるしで、たんけんかを うごかします。たんけんかの「むき」は かんがえなくて だいじょうぶ。やじるし 1つで 1マス すすみます。<b>じゅんばん</b>を まなぶ はじめの めいろ です。',
              'Move the explorer with up ⬆, down ⬇, left ⬅ and right ➡ arrows. You don’t need to think about which way the explorer faces. One arrow = one square. This first maze is about <b>order</b>.'),
     'blocks': ('うえへ ⬆ ／ したへ ⬇ ／ ひだりへ ⬅ ／ みぎへ ➡ ／ ○かい くりかえす（ステージ6）', 'up ⬆ / down ⬇ / left ⬅ / right ➡ / repeat ○ times (stage 6)'),
     'column': ('マスを かぞえよう',
                '<p>やじるしの めいろでは、<b>マスを かぞえる</b> ことが いちばん たいせつ。ゆびで 1マスずつ おさえながら「1、2、3」と かぞえて、その かずだけ やじるしを つなげよう。おなじ やじるしが ならんだら「くりかえす」で まとめられるよ。</p>',
                'Count the squares',
                '<p>In the arrow maze, <b>counting squares</b> is the most important thing. Touch each square with your finger and count “1, 2, 3”, then stack that many arrows. When the same arrow repeats, you can pack them into a “repeat” block.</p>')},
    {'key': 'maze', 'maps': 'maze', 'icon': '⛏',
     'title': ('ブロックで めいろ', 'The Block Maze'),
     'lead': ('こんどは たんけんかの <b>むき</b> が あります。「まえに すすむ」「みぎを むく」「ひだりを むく」で すすみます。<b>じゅんばん → くりかえし → もし → どんな めいろでも とける ほうほう</b> へと すすむ、この ほんの まんなかの しょう です。',
              'Now the explorer has a <b>direction</b>. Use “move forward”, “turn right” and “turn left”. This central chapter goes from <b>order → loops → if → a way to solve any maze</b>.'),
     'blocks': ('まえに すすむ ／ みぎを むく ／ ひだりを むく ／ ○かい くりかえす ／ ゴールに つくまで くりかえす ／ もし まえ（みぎ・ひだり）が あいていたら', 'move forward / turn right / turn left / repeat ○ times / repeat until goal / if front (right, left) is open'),
     'column': ('みぎての ほうそく',
                '<p>まっくらな めいろでも、<b>みぎてを かべに つけたまま</b> あるけば、いつかは かならず でぐちに つきます（かべが ぜんぶ つながって いる めいろの ばあい）。これを「みぎての ほうそく」と いいます。</p><p>プログラムに すると：<b>ゴールに つくまで くりかえす</b>　もし みぎが あいていたら みぎを むいて すすむ ／ そうでなく まえが あいていたら すすむ ／ どちらも だめなら ひだりを むく。ステージ8は、この かんがえかたで とけます。いつでも つかえる てじゅんの ことを <b>アルゴリズム</b> と いいます。</p>',
                'The right-hand rule',
                '<p>Even in a dark maze, if you walk <b>keeping your right hand on the wall</b>, you will always reach the exit (when all the walls are connected). This is the “right-hand rule”.</p><p>As a program: <b>repeat until goal</b> — if the right is open, turn right and move; else if the front is open, move; otherwise turn left. Stage 8 can be solved this way. A method that always works is called an <b>algorithm</b>.</p>')},
    {'key': 'mazekey', 'maps': 'key', 'icon': '🗝',
     'title': ('かぎと とびらの めいろ', 'The Keys & Doors Maze'),
     'lead': ('かぎ 🔑 を ひろって、とびら 🚪 を あけながら すすみます。「いま かぎを なんこ もっているか」を おぼえて おく ことが たいせつ。これを <b>じょうたい</b> と いいます。',
              'Pick up keys 🔑 and open doors 🚪 as you go. You must remember “how many keys am I carrying now?” This is called <b>state</b>.'),
     'blocks': ('まえに すすむ ／ みぎ・ひだりを むく ／ かぎを ひろう ／ とびらを あける ／ くりかえす ／ もし かぎが あったら ／ もし まえが とびらだったら', 'move forward / turn right, left / pick up key / open door / repeat / if key here / if door ahead'),
     'column': ('もちものを メモしよう',
                '<p>かぎを ひろうと もちものが 1こ ふえ、とびらを あけると 1こ へります。あたまの なかだけで かんがえると わすれて しまうので、ワークシートに「すすむ → かぎ 1こ → あける → かぎ 0こ」と かきながら すすめよう。コンピューターも、こうした「じょうたい」を <b>へんすう</b> に おぼえて います。</p>',
                'Write down what you carry',
                '<p>Picking up a key adds 1 to what you carry; opening a door takes 1 away. It is easy to forget if you only think in your head, so write it on the worksheet: “forward → 1 key → open → 0 keys”. Computers also remember this kind of “state” in <b>variables</b>.</p>')},
    {'key': 'mazeenemy', 'maps': 'enemy', 'icon': '👾',
     'title': ('てきを よける めいろ', 'The Dodge-the-Slime Maze'),
     'lead': ('スライム が きまった みちを いったり きたり して います。たんけんかが 1かい うごく（すすむ・むく・まつ）たびに、スライムも 1マス うごきます。「まつ」で <b>タイミング</b> を あわせて よけよう。',
              'Slimes go back and forth on fixed tracks. Every time the explorer acts (move, turn or wait), each slime moves one square. Use “wait” to get the <b>timing</b> right.'),
     'blocks': ('まえに すすむ ／ みぎ・ひだりを むく ／ まつ ／ ゴールに つくまで くりかえす ／ もし まえが あぶなかったら ／ もし まえが あいていたら', 'move forward / turn right, left / wait / repeat until goal / if danger ahead / if front is open'),
     'column': ('じかんも かんがえる',
                '<p>これまでの めいろは「どこを とおるか」だけを かんがえれば よかったね。てきの めいろでは「<b>いつ</b> とおるか」も だいじ。スライムの ばしょを 1ターンずつ ワークシートの ひょうに かいて みると、ぶつかる ターンが みえて くるよ。</p>',
                'Think about time, too',
                '<p>In the earlier mazes you only thought about “where to go”. With slimes, “<b>when</b> to go” matters too. Write the slime’s square for each turn in the worksheet table, and you will see the turn where you would bump into it.</p>')},
    {'key': 'python', 'maps': 'python', 'icon': '🐍', 'py': True,
     'title': ('Python で めいろ', 'Mazes in Python'),
     'lead': ('ブロックで くんだ プログラムは、<b>Python（パイソン）</b>という ことばでも かけます。「まえに すすむ」は <code>forward()</code>、「4かい くりかえす」は <code>for i in range(4):</code>。せかいじゅうの プログラマーが つかって いる、ほんものの プログラミング げんご です。',
              'Programs you build with blocks can also be written in <b>Python</b>. “move forward” is <code>forward()</code>, “repeat 4 times” is <code>for i in range(4):</code>. Python is a real language used by programmers all over the world.'),
     'blocks': ("forward() ／ turn_right() ／ turn_left() ／ for i in range(4): ／ while not at_goal(): ／ if is_open('front'): … else:", "forward() / turn_right() / turn_left() / for i in range(4): / while not at_goal(): / if is_open('front'): … else:"),
     'sub': [('pymazejr', 'junior'), ('pymazekey', 'key'), ('pymazeenemy', 'enemy')],
     'column': ('Python の 3つの ルール',
                '<p>① めいれいの あとには かならず <code>()</code>。② <code>for</code>・<code>while</code>・<code>if</code> の ぎょうの さいごには <code>:</code>（コロン）。③ くりかえす なかみは <b>スペース 4つ</b> さげて かく（じさげ／インデント）。エラーが でたら、まず この 3つを たしかめよう。おおもじと こもじも くべつ されるよ。</p>',
                'Three Python rules',
                '<p>① Every command ends with <code>()</code>. ② Lines starting with <code>for</code>, <code>while</code> or <code>if</code> end with <code>:</code> (a colon). ③ The lines inside are indented by <b>4 spaces</b>. If you get an error, check these three first. Capital and small letters are different, too.</p>')},
]

PY_SUB_TITLES = {
    'pymazejr': ('Python で やじるしの めいろ', 'Python Arrow Maze'),
    'pymazekey': ('Python で かぎと とびら', 'Python Keys & Doors'),
    'pymazeenemy': ('Python で てきを よける', 'Python Slime Maze'),
}

OUTRO = (
    '''<h2>おわりに</h2>
<p>さいごまで よく がんばりました！ この ほんで つかった かんがえかたを ふりかえって みよう。</p>
<table class="sum"><tr><th>かんがえかた</th><th>どこで でてきた？</th></tr>
<tr><td>じゅんばん</td><td>めいれいは うえから じゅんばんに うごく（どの めいろでも）</td></tr>
<tr><td>くりかえし</td><td>おなじ うごきを まとめる（めいろ ステージ4・5）</td></tr>
<tr><td>もし（じょうけん）</td><td>まえを みて きめる（めいろ ステージ6〜8、かぎ、てき）</td></tr>
<tr><td>じょうたい</td><td>もっている かぎの かず（かぎと とびら）</td></tr>
<tr><td>タイミング</td><td>「まつ」で よける（てき）</td></tr>
<tr><td>アルゴリズム</td><td>どんな めいろでも とける てじゅん（めいろ ステージ8）</td></tr>
<tr><td>Python</td><td>おなじ ことを ことば（コード）で かく</td></tr></table>
<p>ぜんぶの ステージを クリアしたら、アプリの「⚙ きのう」→「📜 しゅうりょうしょう」で しゅうりょうしょうが もらえます。つぎは「ブロックで おえかき」「うちゅうで ほしあつめ」「こわして つくる ぼうけん」にも ちょうせん して みよう！</p>''',
    '''<h2>Well done!</h2>
<p>You worked hard to the end! Let’s look back at the ideas you used in this book.</p>
<table class="sum"><tr><th>Idea</th><th>Where did it appear?</th></tr>
<tr><td>Order</td><td>Commands run from top to bottom (every maze)</td></tr>
<tr><td>Loops</td><td>Pack the same moves together (Block Maze stages 4–5)</td></tr>
<tr><td>If (conditions)</td><td>Look ahead and decide (Block Maze stages 6–8, keys, slimes)</td></tr>
<tr><td>State</td><td>How many keys you carry (Keys & Doors)</td></tr>
<tr><td>Timing</td><td>Dodge with “wait” (Slime maze)</td></tr>
<tr><td>Algorithm</td><td>Steps that solve any maze (Block Maze stage 8)</td></tr>
<tr><td>Python</td><td>Write the same thing in words (code)</td></tr></table>
<p>When you clear every stage, get your certificate from “⚙ Settings” → “📜 Certificate” in the app. Next, try “Block Drawing”, “Space Star Hunt” and “Break & Build Quest”!</p>''')

# ── だい2ぶ（指導編）──────────────────────────────────────
TEACHER = [
    (('指導編について', 'About this guide'),
     '''<p>第1部は、児童・生徒が自分で読み進められるよう、ひらがな・わかち書きで書いています。第2部は、授業を計画・実施する先生や、家庭で見守る保護者の方に向けた解説です。</p>
<p>本教材は、ブラウザで動くブロックプログラミング教材（無料・GitHub Pages で公開）のうち、迷路に関する8つのアプリ（ブロック4、Python 4、計41ステージ）をまとめたものです。小学校学習指導要領（平成29年告示）で示された、プログラミングを体験しながら論理的思考力（いわゆる「プログラミング的思考」）を身に付ける学習活動や、中学校技術・家庭科（技術分野）の導入として使うことを想定しています。</p>
<h3>本教材のねらい</h3>
<ul><li>目的を達成するための手順を、順序・反復・条件分岐の組み合わせとして考える。</li>
<li>うまくいかない原因を、実行結果から見つけて直す（試行錯誤・デバッグ）。</li>
<li>同じ課題を、ブロックと Python（テキスト言語）の両方で表し、表現の対応に気付く。</li></ul>''',
     '''<p>Part 1 is written in simple language so that students can read it on their own. Part 2 is for teachers who plan and run lessons, and for parents who support learning at home.</p>
<p>This book collects the eight maze apps (4 block, 4 Python; 41 stages in total) of a free, browser-based block programming curriculum published on GitHub Pages. It is designed for elementary programming education focused on logical thinking (“computational thinking”), and as an introduction to programming in junior high school technology classes.</p>
<h3>Aims</h3>
<ul><li>Think of the steps to reach a goal as a combination of sequence, loops and conditions.</li>
<li>Find and fix the cause of a problem from the result of running the program (trial and error, debugging).</li>
<li>Express the same task in both blocks and Python (a text language) and notice how they correspond.</li></ul>'''),

    (('学習の全体像', 'Overview of the stages'),
     '{MAP}',
     '{MAP}'),

    (('進め方と時数の例', 'Suggested order and lesson count'),
     '''<p>学年や経験に応じて、次のように組み合わせてください。1ステージにかかる時間は数分〜20分程度です。</p>
<table class="t"><tr><th>対象</th><th>扱うアプリ</th><th>時数の目安</th><th>中心となる考え方</th></tr>
<tr><td>小1〜2</td><td>やじるしの めいろ 1〜6</td><td>1〜2時間</td><td>順序、数える</td></tr>
<tr><td>小2〜3</td><td>ブロックで めいろ 1〜5</td><td>2時間</td><td>順序、向き、反復</td></tr>
<tr><td>小4〜6</td><td>ブロックで めいろ 6〜8、かぎと とびら、てきを よける</td><td>3〜4時間</td><td>条件分岐、状態、タイミング、一般化</td></tr>
<tr><td>小5〜中学</td><td>Python で めいろ（4アプリ）</td><td>3〜5時間</td><td>ブロックとコードの対応、文法、エラーの読み方</td></tr></table>
<p>同じ学級でも進度に差が出やすい教材です。早く終わった児童には、ブロック数の制限に挑戦させる、友達にヒントを出す役を任せる、Python 版で同じ迷路を解かせる、などの発展が有効です。</p>
<h3>1単位時間（45分）の流れの例</h3>
<table class="t"><tr><th>時間</th><th>学習活動</th><th>教師の支援・留意点</th></tr>
<tr><td>導入 5分</td><td>前時の振り返り。本時のめあてを確認（ワークシート①）。</td><td>本書の「めあて」をそのまま板書してもよい。</td></tr>
<tr><td>展開1 5分</td><td>迷路を見て、手順を予想する（ワークシート③〜⑦）。</td><td>いきなり操作させず、まず道を指でなぞらせる。</td></tr>
<tr><td>展開2 20分</td><td>アプリで試す。うまくいかなければ原因を見つけて直す。</td><td>答えを教えず「どこで止まった？」と問う。ペアで相談を認める。</td></tr>
<tr><td>共有 10分</td><td>異なる解き方を紹介し合い、短く書く工夫を考える。</td><td>大型提示装置で2〜3人のプログラムを比べる。</td></tr>
<tr><td>まとめ 5分</td><td>振り返りを書く（ワークシート①）。</td><td>「わかったこと」と「次にやりたいこと」を分けて書かせる。</td></tr></table>''',
     '''<p>Combine the apps according to grade and experience. Each stage takes from a few minutes to about 20 minutes.</p>
<table class="t"><tr><th>Students</th><th>Apps</th><th>Lessons</th><th>Key ideas</th></tr>
<tr><td>Grades 1–2</td><td>Arrow Maze 1–6</td><td>1–2</td><td>Order, counting</td></tr>
<tr><td>Grades 2–3</td><td>Block Maze 1–5</td><td>2</td><td>Order, direction, loops</td></tr>
<tr><td>Grades 4–6</td><td>Block Maze 6–8, Keys & Doors, Slime</td><td>3–4</td><td>Conditions, state, timing, generalization</td></tr>
<tr><td>Grade 5 – junior high</td><td>Python mazes (4 apps)</td><td>3–5</td><td>Blocks ↔ code, syntax, reading errors</td></tr></table>
<p>Students progress at different speeds. For fast finishers: try the block limit, act as a “hint giver” for friends, or solve the same maze in the Python version.</p>
<h3>Example flow of a 45-minute lesson</h3>
<table class="t"><tr><th>Time</th><th>Activity</th><th>Teacher support</th></tr>
<tr><td>Intro 5 min</td><td>Review the last lesson; share today’s goal (Worksheet 1).</td><td>You can write the book’s “Goal” on the board as it is.</td></tr>
<tr><td>Plan 5 min</td><td>Look at the maze and predict the steps (Worksheets 3–7).</td><td>Have students trace the path with a finger before touching the device.</td></tr>
<tr><td>Try 20 min</td><td>Try in the app; find and fix the cause if it fails.</td><td>Don’t give the answer; ask “Where did it stop?” Allow pair talk.</td></tr>
<tr><td>Share 10 min</td><td>Show different solutions; think about shorter programs.</td><td>Compare 2–3 programs on the big screen.</td></tr>
<tr><td>Reflect 5 min</td><td>Write a reflection (Worksheet 1).</td><td>Separate “what I learned” and “what I want to try next”.</td></tr></table>'''),

    (('アプリごとの指導のポイント', 'Teaching points for each app'),
     '''<h3>🧭 やじるしの めいろ（低学年）</h3>
<ul><li><b>ねらい：</b>向きを考えずに、矢印を並べる「順序」だけに集中させる。</li>
<li><b>つまずき：</b>マスの数え間違い（スタートのマスを数えてしまう）。→「たんけんかが今いるマスは数えない」と、指で1マスずつ押さえて数えさせる。</li>
<li><b>発問例：</b>「やじるしが 1つ足りないと、どこで止まるかな？」</li></ul>
<h3>⛏ ブロックで めいろ</h3>
<ul><li><b>ねらい：</b>順序 → 反復 → 条件分岐 → 一般化（アルゴリズム）へと段階的に進む。</li>
<li><b>つまずき：</b>①「右を向く」で前に進むと思う（向きを変えるだけ）。②左右の取り違え（画面上の右と、たんけんかから見た右）。③ステージ8で、特定の迷路だけに合う手順を作ってしまう。</li>
<li><b>支援：</b>②は本やタブレットを回す、児童が体で向きを変える、が有効。③は「どんな迷路でも通じる約束」を言葉で表してからブロックにする（右手の法則）。</li></ul>
<h3>🗝 かぎと とびらの めいろ</h3>
<ul><li><b>ねらい：</b>「今いくつ持っているか」という状態を記録しながら考える（変数の素地）。</li>
<li><b>つまずき：</b>鍵の上にいないのに拾う、鍵を持たずに扉へ進む、鍵の数を数え忘れる。</li>
<li><b>支援：</b>ワークシート⑥の表に、1手ごとの持ち物の数を書かせる。画面上部の持ち物表示にも注目させる。</li></ul>
<h3>👾 てきを よける めいろ</h3>
<ul><li><b>ねらい：</b>「どこを通るか」に加えて「いつ通るか」を考える。条件「前が危なかったら」で一般化する。</li>
<li><b>つまずき：</b>「まつ」の回数の不足・過多。向きを変えるだけでもスライムが動くことを見落とす。</li>
<li><b>支援：</b>1ターンずつ実行を区切って見せ、スライムの位置を表に書かせる。</li></ul>
<h3>🐍 Python で めいろ</h3>
<ul><li><b>ねらい：</b>ブロックとコードの対応に気付き、テキストでも同じ考え方が使えることを知る。</li>
<li><b>つまずき：</b><code>()</code> や <code>:</code> の書き忘れ（SyntaxError）、字下げの誤り（IndentationError）、大文字・つづりの誤り（NameError）。</li>
<li><b>支援：</b>エラーは「失敗」ではなく「ヒント」と伝え、ワークシート⑦のエラー記録欄に書かせる。ブロックモードで組み、下に出る Python を見比べてから書き換えるのも有効。</li></ul>''',
     '''<h3>🧭 Arrow Maze (lower grades)</h3>
<ul><li><b>Aim:</b> focus only on “order” by lining up arrows, without thinking about direction.</li>
<li><b>Common difficulty:</b> miscounting squares (counting the start square). → “Don’t count the square the explorer is on.” Have students touch and count one square at a time.</li>
<li><b>Question to ask:</b> “If you have one arrow too few, where will it stop?”</li></ul>
<h3>⛏ Block Maze</h3>
<ul><li><b>Aim:</b> move step by step from sequence → loops → conditions → generalization (algorithm).</li>
<li><b>Common difficulties:</b> ① thinking “turn right” also moves forward (it only turns); ② confusing left and right (screen right vs. the explorer’s right); ③ in stage 8, making steps that work only for one maze.</li>
<li><b>Support:</b> for ②, rotate the book or tablet, or have students turn their bodies. For ③, have students say a rule that works for any maze before building it (the right-hand rule).</li></ul>
<h3>🗝 Keys & Doors</h3>
<ul><li><b>Aim:</b> think while keeping track of state (“how many am I carrying now?”) — a basis for variables.</li>
<li><b>Common difficulties:</b> picking up when not on a key, walking to a door without a key, losing count of keys.</li>
<li><b>Support:</b> have students write the number of keys after each move in the Worksheet 6 table, and watch the item display on screen.</li></ul>
<h3>👾 Dodge the Slime</h3>
<ul><li><b>Aim:</b> think about “when” as well as “where”, then generalize with “if danger ahead”.</li>
<li><b>Common difficulties:</b> too few or too many “wait”s; missing that slimes also move when you only turn.</li>
<li><b>Support:</b> show the run one turn at a time and have students record the slime’s position in a table.</li></ul>
<h3>🐍 Python mazes</h3>
<ul><li><b>Aim:</b> notice how blocks and code correspond, and that the same thinking works in text.</li>
<li><b>Common difficulties:</b> missing <code>()</code> or <code>:</code> (SyntaxError), wrong indentation (IndentationError), capital letters or spelling (NameError).</li>
<li><b>Support:</b> present errors as hints, not failures, and have students log them on Worksheet 7. Building in block mode and comparing with the Python shown below also helps.</li></ul>'''),

    (('評価の観点（例）', 'Assessment (example)'),
     '''<table class="t"><tr><th>観点</th><th>おおむね満足できる姿（B）</th><th>十分満足できる姿（A）の例</th></tr>
<tr><td>知識・技能</td><td>ブロック（コード）を正しく並べ、迷路をクリアできる。</td><td>反復や条件分岐を使い、短いプログラムでクリアできる。</td></tr>
<tr><td>思考・判断・表現</td><td>実行結果から誤りの場所を見つけ、直すことができる。</td><td>どんな迷路でも通じる手順を言葉で説明し、プログラムにできる。</td></tr>
<tr><td>主体的に学習に取り組む態度</td><td>うまくいかなくても、試し直して課題に取り組む。</td><td>友達と考えを伝え合い、よりよい方法を自分から探す。</td></tr></table>
<p>評価資料として、ワークシート（①振り返り、③〜⑦の手順・記録）、アプリのクリア状況（⑧チェックカード、修了証）を活用できます。</p>''',
     '''<table class="t"><tr><th>Area</th><th>Meets expectations (B)</th><th>Exceeds (A), e.g.</th></tr>
<tr><td>Knowledge & skills</td><td>Arranges blocks (code) correctly and clears the maze.</td><td>Uses loops and conditions to clear it with a short program.</td></tr>
<tr><td>Thinking, judgment & expression</td><td>Finds where the error is from the result and fixes it.</td><td>Explains a method that works for any maze and turns it into a program.</td></tr>
<tr><td>Attitude toward learning</td><td>Keeps trying even when it doesn’t work.</td><td>Shares ideas with friends and looks for better ways on their own.</td></tr></table>
<p>Use the worksheets (1 reflection; 3–7 steps and records) and the app progress (8 check card, certificate) as evidence.</p>'''),

    (('使い方と関連教材', 'Using the apps and related materials'),
     '''<h3>動作環境・運用</h3>
<ul><li>パソコン・タブレット・スマートフォンのブラウザで動きます。インストールは不要です（ブロックの部品をインターネットから読み込むため、オンラインで使います）。</li>
<li>画面の幅が狭い端末では、スマートフォン用の配置に自動で切り替わります。</li>
<li>クリアしたステージは、その端末のブラウザに保存されます。端末を共有する場合は、授業の最初にどこまで進んだかを確認してください。</li>
<li><b>先生モード：</b>アドレスの最後に <code>?sensei</code> を付けると「こたえ」ボタンが表示され、答えのブロックを読み込めます。</li>
<li>「⚙ きのう」から、日本語・英語の切り替え、夜モード、迷路の選択（めいろを えらぶ…）、修了証の表示ができます。</li></ul>
<h3>関連教材</h3>
<table class="t"><tr><th>教材</th><th>内容</th></tr>
<tr><td>かいせつしょ（guide.html）</td><td>全課題のめあて・つまずき・ヒント・答え。この本の元になったデータです。</td></tr>
<tr><td>ワークシート（PDF）</td><td>①めあて・ふりかえり、③めいろ、④やじるし、⑥かぎ・てき、⑦Python、⑧チェックカード ほか。</td></tr>
<tr><td>解説動画（videos.html）</td><td>各ステージの解き方を短い動画で紹介。</td></tr>
<tr><td>授業用スライド</td><td>02 ブロックでめいろ、06 Pythonでめいろ、09〜14 迷路のなかま（PowerPoint）。</td></tr>
<tr><td>解答集（ANSWERS.md）</td><td>全ステージの答えのブロック・コード。</td></tr></table>''',
     '''<h3>Requirements and tips</h3>
<ul><li>Works in the browser on computers, tablets and smartphones. No installation needed (it loads the block library from the internet, so use it online).</li>
<li>On narrow screens it switches to a phone layout automatically.</li>
<li>Cleared stages are saved in that device’s browser. If devices are shared, check progress at the start of each lesson.</li>
<li><b>Teacher mode:</b> add <code>?sensei</code> to the end of the address to show an “Answer” button that loads the answer blocks.</li>
<li>From “⚙ Settings” you can switch Japanese/English, use night mode, choose a maze (“Choose a maze…”) and show the certificate.</li></ul>
<h3>Related materials</h3>
<table class="t"><tr><th>Material</th><th>Contents</th></tr>
<tr><td>Guide (guide.html)</td><td>Goals, common mistakes, hints and answers for every task. This book is built from the same data.</td></tr>
<tr><td>Worksheets (PDF)</td><td>1 goal & reflection, 3 maze, 4 arrows, 6 keys & slime, 7 Python, 8 check card, and more.</td></tr>
<tr><td>Videos (videos.html)</td><td>Short videos showing how to solve each stage.</td></tr>
<tr><td>Lesson slides</td><td>02 Block Maze, 06 Python Maze, 09–14 maze variations (PowerPoint).</td></tr>
<tr><td>Answer list (ANSWERS.md)</td><td>Answer blocks and code for every stage.</td></tr></table>'''),
]
