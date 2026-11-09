# かいせつしょ（guide-data.js）に めいろの なかま（ブロック 3つ・Python 3つ）を いれる
# つかいかた：python3 tools/maze-variants/guide_add.py /tmp/lvdump.json
#   lvdump.json は 6つの ページの LEVELS（title・text・hint・limit・code）を ブラウザで とりだした もの
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..')) + os.sep
GF = ROOT + 'guide-data.js'
src = open(GF, encoding='utf-8').read()
HEAD = src.split('window.GUIDE = ', 1)[0]
G = json.loads(src.split('window.GUIDE = ', 1)[1].strip().rstrip(';'))
LV = json.load(open(sys.argv[1], encoding='utf-8'))

G['concepts'].setdefault('state', {'ja': 'じょうたい（もっている もの）', 'en': 'State'})
G['concepts'].setdefault('timing', {'ja': 'タイミング', 'en': 'Timing'})

def e(tags, goal, point, mistake):
    return {'tags': tags, 'goal': {'ja': goal[0], 'en': goal[1]}, 'point': {'ja': point[0], 'en': point[1]}, 'mistake': {'ja': mistake[0], 'en': mistake[1]}}

JR = [
 e(['seq'], ('やじるしを ならべて すすもう', 'Line up arrows to move'),
   ('やじるし 1つで 1マス。ダイヤまでの マスを かぞえて、その かずだけ つなげよう。', 'One arrow moves one square. Count the squares to the diamond and stack that many.'),
   ('やじるしが 2つだと とどかない、4つだと くさむらに ぶつかるよ。', 'With 2 arrows you fall short; with 4 you bump into the bushes.')),
 e(['seq', 'dir'], ('2しゅるいの やじるしを つかおう', 'Use two kinds of arrows'),
   ('みぎへ → したへ → みぎへ。いく じゅんばんに やじるしを ならべるよ。', 'Right → down → right. Put the arrows in the order you go.'),
   ('「したへ」の かずを まちがえると、くさむらに ぶつかるよ。', 'If you use the wrong number of “down” arrows, you bump into the bushes.')),
 e(['seq', 'pattern'], ('こうごの ならびを みつけよう', 'Find the alternating pattern'),
   ('みぎ・した・みぎ・した…と、おなじ ならびが つづいているね。', 'Right, down, right, down… the same pair keeps going.'),
   ('みぎを 2かい つづけると くさむらに ぶつかるよ。', 'Two “right” arrows in a row bump into the bushes.')),
 e(['seq', 'dir'], ('うえへ も つかおう', 'Use “up” too'),
   ('スタートは ひだりした。さきに うえへ 3つ、それから みぎへ 3つ。', 'You start at the bottom left. First up 3, then right 3.'),
   ('「みぎへ」から はじめると、すぐ くさむらに ぶつかるよ。', 'If you start with “right”, you bump into the bushes right away.')),
 e(['seq', 'dir'], ('4つの やじるしを ぜんぶ つかおう', 'Use all four arrows'),
   ('みぎ → した → ひだり。ぐるっと まわって ダイヤへ。', 'Right → down → left. Go around to the diamond.'),
   ('「ひだりへ」と「みぎへ」を まちがえやすいよ。たんけんかから みて ではなく、がめんの ひだり・みぎ。', '“Left” and “right” are easy to mix up. They mean left and right on the screen.')),
 e(['loop', 'pattern'], ('くりかえしで みじかく しよう', 'Make it shorter with repeat'),
   ('「みぎへ・したへ」の セットを 4かい。ブロック 3こで かけるね。', 'Repeat the “right, down” set 4 times. Just 3 blocks!'),
   ('くりかえしの かずが 3だと、ダイヤの てまえで とまるよ。', 'With 3 repeats you stop just before the diamond.')),
]
KEY = [
 e(['seq', 'state'], ('かぎを ひろって とびらを あけよう', 'Pick up the key and open the door'),
   ('「かぎを ひろう」で もちものが 1こに なり、「とびらを あける」で 0こに もどる。', '“Pick up key” makes your key count 1, and “open door” brings it back to 0.'),
   ('かぎの うえに いないのに ひろうと「ここには かぎが ないよ」。すすむ かずを たしかめよう。', 'Picking up when you are not on the key gives “There is no key here.” Check how far you move.')),
 e(['seq', 'state', 'decomp'], ('さきに かぎを とりに いこう', 'Get the key first'),
   ('ゴールの まえに より道。「かぎを とる」と「とびらへ もどる」に わけて かんがえよう。', 'Take a side trip before the goal. Think of it as “get the key” and “go back to the door”.'),
   ('かぎを もたずに とびらへ すすむと「とびらが あかないよ。かぎは どこかな？」。', 'Going to the door without a key gives “The door is locked. Where is the key?”')),
 e(['loop', 'pattern', 'state'], ('おなじ セットを くりかえそう', 'Repeat the same set'),
   ('かぎ → とびら が 2かい ならんでいる。4つの ブロックを まとめて 2かい。', 'Key → door appears twice. Repeat the 4 blocks 2 times.'),
   ('「とびらを あける」の あとの「まえに すすむ」を わすれると、つぎの かぎに とどかないよ。', 'If you forget “move forward” after “open door”, you never reach the next key.')),
 e(['if', 'until', 'state', 'algo'], ('しらべながら じぶんで きめよう', 'Check and decide by yourself'),
   ('かぎを みつけたら ひろう、とびらが あったら あける、あとは まえ か みぎ。この 3つを まいかい しらべるよ。', 'Pick up a key when you find one, open a door when there is one, and then go forward or turn right. Check all three every time.'),
   ('「もし まえが とびら」より さきに「もし まえ が あいていたら」を おくと、とびらの まえで まわって しまうよ。', 'If “if front is open” comes before “if door in front”, you turn around at the door.')),
]
EN = [
 e(['seq', 'timing'], ('まって タイミングを あわせよう', 'Wait to time your move'),
   ('スライムは 1かいごとに 1マス。とおりすぎるまで「まつ」を 2かい。', 'The slime moves one square each turn. Wait 2 times until it passes.'),
   ('「まつ」が 1かいだと、ちょうど スライムに ぶつかるよ。', 'With only one “wait”, you walk right into the slime.')),
 e(['if', 'until', 'timing'], ('あぶなかったら まとう', 'Wait when it is dangerous'),
   ('「あぶない」は、まえに スライムが いる か、つぎに まえに くる とき。そう なら まつ、ちがえば すすむ。', '“Danger” means a slime is in front or will come there next. If so, wait; if not, move.'),
   ('「もし」を くりかえしの そとに おくと、さいしょの 1かいしか しらべないよ。', 'If the “if” is outside the loop, it checks only once.')),
 e(['if', 'nest', 'until', 'timing'], ('もしの なかに もし', 'An if inside an if'),
   ('まず あぶないか しらべる。あぶなく なければ、まえが あいているか しらべる。じゅんばんが だいじ。', 'First check for danger. If it is safe, check if the front is open. The order matters.'),
   ('「あぶない」を しらべないで すすむと、とちゅうで スライムに つかまるよ。', 'If you move without checking for danger, a slime catches you on the way.')),
 e(['algo', 'until', 'timing'], ('おなじ プログラムで おおきな めいろ', 'The same program, a bigger maze'),
   ('ステージ3の プログラムが そのまま つかえる。いつでも つかえる やりかた（一般化）だね。', 'The Stage 3 program works as it is. That is a method that works anywhere (generalization).'),
   ('「まつ」を ぬくと、3びきの どれかに つかまるよ。', 'Without “wait”, one of the three slimes catches you.')),
]
PYJR = [
 e(['seq', 'py'], ('right() を かこう', 'Write right()'),
   ('Python は 1ぎょうに 1つの めいれい。right() を 3ぎょう かくと 3マス すすむ。', 'Python has one command per line. Three lines of right() move 3 squares.'),
   ('「()」を わすれて right だけに すると SyntaxError。', 'Writing just right without “()” causes a SyntaxError.')),
 e(['seq', 'dir', 'py'], ('down() も つかおう', 'Use down() too'),
   ('right() と down() を いく じゅんばんに かくよ。', 'Write right() and down() in the order you go.'),
   ('Down() のように おおもじに すると NameError。Python は おおもじと こもじを くべつするよ。', 'Down() with a capital letter causes a NameError. Python cares about capital letters.')),
 e(['seq', 'pattern', 'py'], ('こうごに かこう', 'Write them alternately'),
   ('right() と down() を 3かいずつ、こうごに。', 'right() and down(), 3 times each, one after the other.'),
   ('じゅんばんが いれかわると くさむらに ぶつかるよ。', 'If the order is swapped, you bump into the bushes.')),
 e(['seq', 'dir', 'py'], ('up() で うえへ', 'Go up with up()'),
   ('up() を 3ぎょう、それから right() を 3ぎょう。', 'Three lines of up(), then three lines of right().'),
   ('ぎょうの はじめに スペースを いれると IndentationError。for の なか いがいは じさげ しないよ。', 'A space at the start of a line causes an IndentationError. Only lines inside for are indented.')),
 e(['seq', 'dir', 'py'], ('left() も つかおう', 'Use left() too'),
   ('right() → down() → left()。4つの めいれいを ぜんぶ つかえたね。', 'right() → down() → left(). Now you have used all four commands.'),
   ('left と right を まちがえやすい。がめんの ひだり・みぎで かんがえよう。', 'left and right are easy to mix up. Think of the left and right of the screen.')),
 e(['loop', 'py'], ('for で くりかえそう', 'Repeat with for'),
   ('for i in range(4): の したの 2ぎょうを スペース 4つ じさげ。2ぎょうとも くりかえされるよ。', 'Indent the 2 lines under for i in range(4): by 4 spaces. Both lines repeat.'),
   ('down() の じさげを わすれると、くりかえすのは right() だけに なるよ。', 'If down() is not indented, only right() repeats.')),
]
PYKEY = [
 e(['seq', 'state', 'py'], ('pick_up() と open_door()', 'pick_up() and open_door()'),
   ('pick_up() で かぎが 1こ、open_door() で 0こ。もちものの かずが かわるね。', 'pick_up() makes 1 key and open_door() makes 0. Your item count changes.'),
   ('pickup() や open door() と かくと NameError や SyntaxError。「_」を わすれずに。', 'pickup() or open door() causes an error. Don’t forget the “_”.')),
 e(['seq', 'state', 'decomp', 'py'], ('より道の じゅんばんを かこう', 'Write the side trip in order'),
   ('かぎまで いく → pick_up() → turn_right() を 2かい → とびらへ。ながい てじゅんも 1ぎょうずつ。', 'Go to the key → pick_up() → turn_right() twice → to the door. Write a long plan one line at a time.'),
   ('pick_up() の まえに open_door() を かくと「かぎを もっていないよ」。', 'open_door() before pick_up() gives “You have no key.”')),
 e(['loop', 'pattern', 'py'], ('for の なかに 4ぎょう', 'Four lines inside for'),
   ('for の なかの 4ぎょうは ぜんぶ スペース 4つ じさげ。さいごの 2ぎょうは じさげ しない。', 'All 4 lines inside for are indented by 4 spaces. The last 2 lines are not.'),
   ('turn_right() まで じさげ すると、2かい まわって もどって しまうよ。', 'If turn_right() is indented too, you turn twice and go back.')),
 e(['if', 'until', 'state', 'algo', 'py'], ('key_here() と door_ahead() で しらべよう', 'Check with key_here() and door_ahead()'),
   ('if を 2つ ならべて、さいごに if … else。while の なかは まいかい しらべなおすよ。', 'Two ifs in a row, then if … else. Inside while, everything is checked again each time.'),
   ('key_here の あとの「()」を わすれると SyntaxError。しらべる ことばにも () を つけるよ。', 'Forgetting “()” after key_here causes a SyntaxError. Checks also need ().')),
]
PYEN = [
 e(['seq', 'timing', 'py'], ('wait() で まとう', 'Wait with wait()'),
   ('wait() は 1かい まつ めいれい。スライムは その あいだに 1マス うごくよ。', 'wait() waits one turn. The slime moves one square meanwhile.'),
   ('wait(2) のように () の なかに かずを かくと TypeError。2かい まつなら wait() を 2ぎょう。', 'wait(2) causes a TypeError. To wait twice, write wait() on 2 lines.')),
 e(['if', 'until', 'timing', 'py'], ('if danger_ahead(): で しらべよう', 'Check with if danger_ahead():'),
   ('danger_ahead() は あぶない とき True。if … else で まつ か すすむ かを きめる。', 'danger_ahead() is True when it is dangerous. if … else decides between waiting and moving.'),
   ('else: の「:」を わすれると SyntaxError。', 'Forgetting the “:” after else causes a SyntaxError.')),
 e(['if', 'nest', 'until', 'timing', 'py'], ('elif で 3つに わけよう', 'Split into three with elif'),
   ('if（あぶない）→ elif（まえが あいている）→ else（みぎを むく）。うえから じゅんに しらべるよ。', 'if (danger) → elif (front is open) → else (turn right). They are checked from the top.'),
   ('elif を if に すると、まった あとに すすんで つかまる ことが あるよ。', 'If you change elif to if, you may move right after waiting and get caught.')),
 e(['algo', 'until', 'timing', 'py'], ('おなじ コードで おおきな めいろ', 'The same code, a bigger maze'),
   ('ステージ3の コードを そのまま。どんな めいろでも つかえる やりかただね。', 'Use the Stage 3 code as it is. It works in any maze.'),
   ("is_open('front') の ' を わすれると ValueError や SyntaxError。", "Forgetting the quotes in is_open('front') causes an error.")),
]

def app(key, file, icon, name, intro, lv, extra, vkey, python=False, img=None):
    items = []
    for i, (l, x) in enumerate(zip(lv, extra), 1):
        it = {'n': i, 'tags': x['tags'], 'limit': l['limit'],
              'img': None if python else {'ja': f'images/answers/{img}{i}.png', 'en': f'images/answers/en/{img}{i}.png'}}
        if python: it['code'] = l['code']
        it['video'] = {'ja': f'videos/ja/{vkey}-{i:02d}.mp4', 'en': f'videos/en/{vkey}-{i:02d}.mp4'}
        it.update({'title': l['title'], 'text': l['text'], 'hint': l['hint'], 'goal': x['goal'], 'point': x['point'], 'mistake': x['mistake']})
        items.append(it)
    return {'key': key, 'file': file, 'icon': icon, 'name': {'ja': name[0], 'en': name[1]}, 'intro': {'ja': intro[0], 'en': intro[1]}, 'items': items}

NEW_BLOCK = [
 app('mazejr', 'maze-junior.html', '🧭', ('やじるしの めいろ', 'Arrow Maze'),
     ('ていがくねん むけ。うえ・した・ひだり・みぎ の やじるしで、たんけんかを ダイヤまで うごかします。「むき」を かんがえずに、じゅんばんを まなびます。',
      'For younger kids. Move the explorer to the diamond with up, down, left and right arrows. Learn about order without thinking about directions.'),
     LV['maze-junior.html'], JR, 'mazejr', img='mazejr'),
 app('mazekey', 'maze-key.html', '🗝', ('かぎと とびらの めいろ', 'Keys & Doors Maze'),
     ('かぎを ひろって とびらを あけながら すすみます。「いま なにを もっているか」（じょうたい）を おぼえて かんがえる れんしゅうです。',
      'Pick up keys and open doors as you go. Practice remembering what you are carrying (state).'),
     LV['maze-key.html'], KEY, 'mazekey', img='mazekey'),
 app('mazeenemy', 'maze-enemy.html', '👾', ('てきを よける めいろ', 'Dodge the Slime Maze'),
     ('きまった みちを いったり きたり する スライムを、「まつ」で よけて すすみます。タイミングと「もし」を まなびます。',
      'Dodge slimes that move back and forth by waiting. Learn about timing and “if”.'),
     LV['maze-enemy.html'], EN, 'mazeenemy', img='mazeenemy'),
]
NEW_PY = [
 app('pymazejr', 'python-maze-junior.html', '🐍', ('Pythonで やじるし めいろ', 'Python Arrow Maze'),
     ('やじるしの めいろを Python で。up()・down()・left()・right() の 4つの めいれいと for を つかいます。',
      'The Arrow Maze in Python. Use the four commands up(), down(), left(), right() and for.'),
     LV['python-maze-junior.html'], PYJR, 'pymazejr', python=True),
 app('pymazekey', 'python-maze-key.html', '🐍', ('Pythonで かぎと とびら', 'Python Keys & Doors'),
     ('かぎと とびらの めいろを Python で。pick_up()・open_door() と、key_here()・door_ahead() で しらべる if を つかいます。',
      'Keys & Doors in Python. Use pick_up(), open_door() and if with key_here() and door_ahead().'),
     LV['python-maze-key.html'], PYKEY, 'pymazekey', python=True),
 app('pymazeenemy', 'python-maze-enemy.html', '🐍', ('Pythonで てきを よける', 'Python Slime Maze'),
     ('てきを よける めいろを Python で。wait() と danger_ahead()、if・elif・else を つかいます。',
      'Dodge the Slime Maze in Python. Use wait(), danger_ahead() and if, elif, else.'),
     LV['python-maze-enemy.html'], PYEN, 'pymazeenemy', python=True),
]
NEWKEYS = {a['key'] for a in NEW_BLOCK + NEW_PY}
apps = [a for a in G['apps'] if a['key'] not in NEWKEYS]   # なんども うごかしても おなじに なるように
out = []
for a in apps:
    out.append(a)
    if a['key'] == 'maze': out.extend(NEW_BLOCK)
    if a['key'] == 'pycraft': out.extend(NEW_PY)
G['apps'] = out
open(GF, 'w', encoding='utf-8').write(HEAD + 'window.GUIDE = ' + json.dumps(G, ensure_ascii=False, indent=1) + ';\n')
print('apps', [a['key'] for a in G['apps']], 'items', sum(len(a['items']) for a in G['apps']))
