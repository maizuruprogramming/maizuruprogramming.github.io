# こたえ ／ Answer Key（先生・保護者向け / for teachers and parents）

- [日本語の こたえ](#日本語の-こたえ)
- [English answers](#english-answers)

---

# 日本語の こたえ

このファイルには、3つのアプリの解答をまとめています。
どの解答も、左が組むブロック、右が実行した結果の画像です。

- 🐢 **ブロックでおえかき**（index.html）：おだい ①〜⑨
- ⛏ **ブロックでめいろ**（maze.html）：ステージ 1〜8
- 🚀 **うちゅうで ほしあつめ**（space.html）：ステージ 1〜7

## 📖 先生モード（こたえをブロックで読み込む）

URL の最後に `?sensei` を付けて開くと、ヘッダーに「📖 こたえ」ボタンが出ます。

```
https://<ユーザー名>.github.io/<リポジトリ名>/index.html?sensei
https://<ユーザー名>.github.io/<リポジトリ名>/maze.html?sensei
https://<ユーザー名>.github.io/<リポジトリ名>/space.html?sensei
```

ボタンを押すと、選んでいるおだい（ステージ）の解答ブロックが読み込まれます。「▶ じっこう」で動きを確かめられるので、授業での解説に使えます。
読み込むと、そのおだい（ステージ）で組んでいたブロックは解答に置きかわります。

---

# 🐢 ブロックでおえかき

アプリの「おだい」を選ぶと、お手本がうすい灰色で表示されます。
「▶ じっこう」でかき終わると、お手本と線の位置をくらべて自動で判定します。
判定するのは線の形と位置だけです。色や太さは自由に変えてかまいません。
カメはまんなかから上を向いてスタートします。

| # | おだい | 学べること |
|---|---|---|
| ① | 六角形 | くりかえし、外角 = 360 ÷ 角の数 |
| ② | ほし | 2周（720°）まわる図形 |
| ③ | まる | 小さな直線で円を近似する |
| ④ | まど | 入れ子のくりかえし |
| ⑤ | はな | 入れ子のくりかえし + 回転対称 |
| ⑥ | しかくいうずまき | 変数（カウンター）を長さに使う |
| ⑦ | ならんだ多角形 | 変数 + 計算ブロック（360 ÷ n） |
| ⑧ | ゆきのけっしょう | 手順の分解、「もとの場所にもどる」考え方 |
| ⑨ | ほしのうずまき | 変数 × 計算 + 回転 |

---

### ① 六角形 ★
![① 六角形 ★ のこたえ](images/answers/odai1.png)

### ② ほし ★★
![② ほし ★★ のこたえ](images/answers/odai2.png)
5回で2周（720°）するので、1回あたり 720 ÷ 5 = 144° まわります。

### ③ まる ★★
![③ まる ★★ のこたえ](images/answers/odai3.png)

### ④ まど ★★★
![④ まど ★★★ のこたえ](images/answers/odai4.png)

### ⑤ はな ★★★
![⑤ はな ★★★ のこたえ](images/answers/odai5.png)

### ⑥ しかくい うずまき ★★★★
![⑥ しかくい うずまき ★★★★ のこたえ](images/answers/odai6.png)

### ⑦ ならんだ たかくけい ★★★★
![⑦ ならんだ たかくけい ★★★★ のこたえ](images/answers/odai7.png)
変数 n は「へんすう」カテゴリの「へんすうを作る」で作ります。

### ⑧ ゆきの けっしょう ★★★★★
![⑧ ゆきの けっしょう ★★★★★ のこたえ](images/answers/odai8.png)
1本の枝をかいたら、向きも位置も元にもどすのがポイントです。

### ⑨ ほしの うずまき ★★★★★
![⑨ ほしの うずまき ★★★★★ のこたえ](images/answers/odai9.png)
ループの中に「ペンのいろを ランダム にする」を入れると、カラフルになります。

---

### おだいを増やすには

`index.html` の `CHALLENGES` に1つ追加します。

```js
{ title: '⑩ ○○ ★★★',
  text: '子どもに見せる説明',
  hint: 'ヒント',
  answer: 'for(let k=0;k<3;k++){forward(100);turn(120);}' }
```

`answer` にはお手本をかくプログラムを書きます。使える命令は次のとおりです。

- `forward(ほ)`：マイナスの値で後ろにさがる
- `turn(ど)`：マイナスの値で左にまわる
- `pen(true/false)`：ペンをおろす／あげる
- `home()`：まんなかにもどる

解答ブロックを付けるときは、`ANSWER_BLOCKS` にも同じ順番で追加します。

---

# ⛏ ブロックでめいろ

たんけんか（キャラクター）は、ヘルメットのライトが照らしている方向が「まえ」です。
ステージ4〜7の「めやす」は、使うブロックの数です（数字の入力欄は数えません）。

| ステージ | 学べること | 解答のブロック数 |
|---|---|---|
| 1 まっすぐ すすもう | 順番に並べる（順次） | 4 |
| 2 まがってみよう | 向きの考え方 | 5 |
| 3 ながい みち | 長い手順を組み立てる | 12 |
| 4 くりかえしを つかおう | くりかえし | 5（めやす 5） |
| 5 かいだんを のぼろう | パターンを見つける | 5（めやす 5） |
| 6 もし〜なら | 条件分岐、条件つきのくりかえし | 4（めやす 4） |
| 7 みぎ？ ひだり？ | 条件分岐の入れ子 | 6（めやす 6） |
| 8 どんな めいろでも | 一般化（アルゴリズム） | 7 |

### ステージ1　まっすぐ すすもう
![ステージ1　まっすぐ すすもう のこたえ](images/answers/maze1.png)

### ステージ2　まがってみよう
![ステージ2　まがってみよう のこたえ](images/answers/maze2.png)
「むく」ではマスを動かず、向きだけが変わります。

### ステージ3　ながい みち
![ステージ3　ながい みち のこたえ](images/answers/maze3.png)
ブロックは全部で12個です。「長くて大変だった」という気づきが、次のステージのくりかえしにつながります。

### ステージ4　くりかえしを つかおう
![ステージ4　くりかえしを つかおう のこたえ](images/answers/maze4.png)

### ステージ5　かいだんを のぼろう
![ステージ5　かいだんを のぼろう のこたえ](images/answers/maze5.png)
4回目の途中でゴールに着き、そこでプログラムが止まります。くりかえす回数を5にしても正解になります。

### ステージ6　もし〜なら
![ステージ6　もし〜なら のこたえ](images/answers/maze6.png)
うずまきの道は右にしか曲がらないので、「前がだめなら右」だけで進めます。

### ステージ7　みぎ？ ひだり？
![ステージ7　みぎ？ ひだり？ のこたえ](images/answers/maze7.png)
ステージ6のプログラムのままだと、右に曲がった先で行き止まりになります。そのまま同じところを回り続けて、「うごきが おおすぎるよ」と出て止まります。

### ステージ8　どんな めいろでも ゴール！（右手法）
![ステージ8　どんな めいろでも ゴール！（右手法） のこたえ](images/answers/maze8.png)
右手を壁につけたまま歩く「右手法」です。スタートとゴールがどちらも外側の壁に接しているので、この迷路では必ずゴールに着きます。
ランダムな迷路900個で試して、すべてゴールできることを確かめています。

「みぎ」と「ひだり」を全部入れかえた「左手法」でも正解になります。ステージ7のプログラムは、迷路によっては同じところを回り続けてしまいます。なぜ失敗するのかを話し合うのもおすすめです。

### じゆうモード
ステージ8と同じプログラムで、どの迷路でもゴールできます。

---

# 🚀 うちゅうで ほしあつめ

宇宙飛行士（たんけんか）が、星 ⭐ を全部拾ってからロケット 🚀 に乗り込むとクリアです。
- 星を全部集める前にロケットのマスを通っても、クリアにはなりません。そのまま進めます
- 星のないマスで「ほしを ひろう」を使うと、失敗になります（「ここには ほしが ないよ！」）

| ステージ | 学べること | 解答のブロック数 |
|---|---|---|
| 1 ほしを ひろおう | 順次＋「ひろう」という動作 | 5 |
| 2 まがって あつめよう | 向きと順番 | 8 |
| 3 くりかえしで あつめよう | くりかえし | 4（めやす 4） |
| 4 ほしの かいだん | パターンを見つけてくりかえす | 6（めやす 6） |
| 5 もし ほしが あったら | 条件分岐（その場を調べる） | 4（めやす 4） |
| 6 ミッション クリアまで | 条件つきのくりかえし＋条件分岐 | 6（めやす 6） |
| 7 どんな うちゅうでも！ | 一般化（右手法＋調べて拾う） | 9 |

### ステージ1　ほしを ひろおう
![ステージ1 のこたえ](images/answers/space1.png)

### ステージ2　まがって あつめよう
![ステージ2 のこたえ](images/answers/space2.png)

### ステージ3　くりかえしで あつめよう
![ステージ3 のこたえ](images/answers/space3.png)
3回目に拾ったあと、もう1マス進むとロケットに着きます。

### ステージ4　ほしの かいだん
![ステージ4 のこたえ](images/answers/space4.png)
4回目のくりかえしの途中でロケットに着き、その時点でクリアになります。

### ステージ5　もし ほしが あったら
![ステージ5 のこたえ](images/answers/space5.png)
「もし」を使わずに「すすむ → ひろう」をくりかえすと、星のないマスで失敗します。
このステージで、「調べてから行動する」ことの大切さに気づけます。

### ステージ6　ミッション クリアまで
![ステージ6 のこたえ](images/answers/space6.png)
くりかえすたびに、まず足元の星を調べてから進みます。うずまきの道は右にしか曲がらないので、「前がだめなら右」で進めます。

### ステージ7　どんな うちゅうでも！
![ステージ7 のこたえ](images/answers/space7.png)
迷路のステージ8で使った「右手法」に、「もし ほしが あったら ひろう」を足したプログラムです。
星を集め終わる前にロケットを通り過ぎても、壁に沿って歩き続けるので、最後は星を全部拾ってロケットに戻ってきます。
テストに使うランダムな宇宙は、星が右手法で通る道の上に置かれるように作っています。この解答で、ランダムな宇宙1000個がすべてクリアできることを確かめています。

ステージ6のプログラムのままだと、同じところを回り続けて「うごきが おおすぎるよ」で止まります。

### じゆうモード
ステージ7と同じプログラムで、どの宇宙でもクリアできます。


---

# English answers

This section has the answers for the three apps. In every image, the blocks are on the left and the result is on the right.
These images show the English block labels. To see the same blocks in the app, switch the language with **⚙ Settings → 🌐**.

- 🐢 **Block Drawing** (index.html): challenges ①–⑨
- ⛏ **Block Maze** (maze.html): stages 1–8
- 🚀 **Space Star Hunt** (space.html): stages 1–7

## 📖 Teacher mode (load the answer blocks)

Add `?sensei` to the end of the URL. A "📖 Answer" button appears in the header.

```
https://<user>.github.io/<repository>/index.html?sensei&lang=en
https://<user>.github.io/<repository>/maze.html?sensei&lang=en
https://<user>.github.io/<repository>/space.html?sensei&lang=en
```

Press the button to load the answer blocks for the selected challenge or stage. Then press "▶ Run" to show how it works in class.
Loading an answer replaces the blocks the student had built for that challenge or stage.

---

# 🐢 Block Drawing

When you choose a challenge, a light gray model drawing appears.
After "▶ Run" finishes, the app compares your lines with the model and checks the answer automatically.
Only the shape and position of the lines are checked. Colors and pen sizes can be anything.
The turtle starts in the center, facing up.

| # | Challenge | What students learn |
|---|---|---|
| ① | Hexagon | Repeat; exterior angle = 360 ÷ number of corners |
| ② | Star | A shape that turns around twice (720°) |
| ③ | Circle | Making a circle from many short lines |
| ④ | Window | A loop inside a loop (nested loops) |
| ⑤ | Flower | Nested loops + rotation symmetry |
| ⑥ | Square spiral | Using a variable (counter) as a length |
| ⑦ | Polygons in a row | Variable + math block (360 ÷ n) |
| ⑧ | Snowflake | Breaking a task into steps; "coming back to the start" |
| ⑨ | Star spiral | Variable × math + turning |

### ① Hexagon ★
![① Hexagon answer](images/answers/en/odai1.png)

### ② Star ★★
![② Star answer](images/answers/en/odai2.png)
The turtle turns around twice (720°) in 5 repeats, so each turn is 720 ÷ 5 = 144°.

### ③ Circle ★★
![③ Circle answer](images/answers/en/odai3.png)

### ④ Window ★★★
![④ Window answer](images/answers/en/odai4.png)

### ⑤ Flower ★★★
![⑤ Flower answer](images/answers/en/odai5.png)

### ⑥ Square spiral ★★★★
![⑥ Square spiral answer](images/answers/en/odai6.png)

### ⑦ Polygons in a row ★★★★
![⑦ Polygons in a row answer](images/answers/en/odai7.png)
Make the variable n with "Create variable…" in the Variables category.

### ⑧ Snowflake ★★★★★
![⑧ Snowflake answer](images/answers/en/odai8.png)
The key is to put both the position and the direction back after drawing each branch.

### ⑨ Star spiral ★★★★★
![⑨ Star spiral answer](images/answers/en/odai9.png)
Put "set pen color to random" inside the loop to make it colorful.

---

# ⛏ Block Maze

"Forward" is the way the explorer's helmet light is shining.
In stages 4–7, the "target" is the number of blocks used (number inputs are not counted).

| Stage | What students learn | Blocks in the answer |
|---|---|---|
| 1 Go straight | Putting steps in order (sequence) | 4 |
| 2 Let's turn | Thinking about direction | 5 |
| 3 A long path | Building a long sequence | 12 |
| 4 Use a loop | Loops | 5 (target 5) |
| 5 Climb the stairs | Finding a pattern | 5 (target 5) |
| 6 If… | Conditions; repeat until | 4 (target 4) |
| 7 Right? Left? | Nested conditions | 6 (target 6) |
| 8 Any maze! | Generalizing (an algorithm) | 7 |

### Stage 1: Go straight
![Stage 1 answer](images/answers/en/maze1.png)

### Stage 2: Let's turn
![Stage 2 answer](images/answers/en/maze2.png)
"Turn" changes only the direction. The explorer stays on the same square.

### Stage 3: A long path
![Stage 3 answer](images/answers/en/maze3.png)
This takes 12 blocks. Noticing "this is long and tiring" leads to loops in the next stage.

### Stage 4: Use a loop
![Stage 4 answer](images/answers/en/maze4.png)

### Stage 5: Climb the stairs
![Stage 5 answer](images/answers/en/maze5.png)
The explorer reaches the goal in the middle of the 4th repeat, and the program stops there. Repeating 5 times is also correct.

### Stage 6: If…
![Stage 6 answer](images/answers/en/maze6.png)
The spiral path only turns right, so "if the front is blocked, turn right" is enough.

### Stage 7: Right? Left?
![Stage 7 answer](images/answers/en/maze7.png)
With the Stage 6 program, the explorer reaches a dead end after turning right. It keeps going around in the same place and stops with "Too many moves".

### Stage 8: Any maze! (the right-hand rule)
![Stage 8 answer](images/answers/en/maze8.png)
This is the "right-hand rule": walk with your right hand touching the wall. In these mazes, the start and the goal both touch the outer wall, so it always reaches the goal.
We checked it on 900 random mazes, and it reached the goal every time.

Swapping every "right" and "left" (the left-hand rule) also works. The Stage 7 program can get stuck going around in circles in some mazes. Talking about why it fails is a good class discussion.

### Free mode
The Stage 8 program reaches the goal in any maze.

---

# 🚀 Space Star Hunt

The astronaut must pick up every star ⭐ and then board the rocket 🚀.
- Passing over the rocket before collecting all the stars does not end the mission. The astronaut keeps going
- Using "pick up star" on a square with no star is a mistake ("There is no star here!")

| Stage | What students learn | Blocks in the answer |
|---|---|---|
| 1 Pick up a star | Sequence + the "pick up" action | 5 |
| 2 Turn and collect | Direction and order | 8 |
| 3 Collect with a loop | Loops | 4 (target 4) |
| 4 Star stairs | Finding a pattern to repeat | 6 (target 6) |
| 5 If there is a star | Conditions (checking the current square) | 4 (target 4) |
| 6 Until mission complete | Repeat until + conditions | 6 (target 6) |
| 7 Any space! | Generalizing (right-hand rule + check and pick up) | 9 |

### Stage 1: Pick up a star
![Stage 1 answer](images/answers/en/space1.png)

### Stage 2: Turn and collect
![Stage 2 answer](images/answers/en/space2.png)

### Stage 3: Collect with a loop
![Stage 3 answer](images/answers/en/space3.png)
After the 3rd pick-up, one more step reaches the rocket.

### Stage 4: Star stairs
![Stage 4 answer](images/answers/en/space4.png)
The astronaut reaches the rocket in the middle of the 4th repeat, and the mission is complete at that moment.

### Stage 5: If there is a star
![Stage 5 answer](images/answers/en/space5.png)
Without "if", repeating "move → pick up" fails on a square with no star.
This stage shows why it is important to check first and then act.

### Stage 6: Until mission complete
![Stage 6 answer](images/answers/en/space6.png)
Each time through the loop, the astronaut first checks for a star, then moves. The spiral only turns right, so "if the front is blocked, turn right" is enough.

### Stage 7: Any space!
![Stage 7 answer](images/answers/en/space7.png)
This is the right-hand rule from Maze Stage 8, plus "if there is a star here, pick it up".
Even if the astronaut passes the rocket before getting every star, it keeps following the walls. In the end it picks up all the stars and comes back to the rocket.
The random spaces used for the test always put the stars on squares that the right-hand rule walks over. We checked this answer on 1,000 random spaces, and it cleared every one.

With the Stage 6 program, the astronaut keeps going around in the same place and stops with "Too many moves".

### Free mode
The Stage 7 program clears any space.
