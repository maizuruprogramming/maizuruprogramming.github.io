/* かいせつしょ（guide.html）の データ：アプリの ステージ・おだいから じどうで つくった もの */
window.GUIDE = {
 "concepts": {
  "seq": {
   "ja": "じゅんばん（順次）",
   "en": "Sequence"
  },
  "dir": {
   "ja": "むき",
   "en": "Direction"
  },
  "loop": {
   "ja": "くりかえし（反復）",
   "en": "Loops"
  },
  "nest": {
   "ja": "いれこ",
   "en": "Nesting"
  },
  "pattern": {
   "ja": "パターン",
   "en": "Patterns"
  },
  "if": {
   "ja": "もし（条件分岐）",
   "en": "Conditions"
  },
  "until": {
   "ja": "〜まで くりかえす",
   "en": "Repeat until"
  },
  "var": {
   "ja": "へんすう（変数）",
   "en": "Variables"
  },
  "math": {
   "ja": "けいさん",
   "en": "Math"
  },
  "decomp": {
   "ja": "てじゅんを わける（分解）",
   "en": "Decomposition"
  },
  "algo": {
   "ja": "どんな ばあいでも（一般化）",
   "en": "Generalization"
  },
  "count": {
   "ja": "かずを かぞえる",
   "en": "Counting"
  },
  "angle": {
   "ja": "かくど",
   "en": "Angles"
  },
  "py": {
   "ja": "Pythonの かきかた（コロン・じさげ）",
   "en": "Python syntax (colon & indent)"
  },
  "state": {
   "ja": "じょうたい（もっている もの）",
   "en": "State"
  },
  "timing": {
   "ja": "タイミング",
   "en": "Timing"
  }
 },
 "apps": [
  {
   "key": "draw",
   "file": "index.html",
   "icon": "🐢",
   "name": {
    "ja": "ブロックでおえかき",
    "en": "Block Drawing"
   },
   "intro": {
    "ja": "カメ（タートル）を うごかして せんを かきます。お手本と おなじ 図形が かけたら せいかいです。角度・くりかえし・へんすうを まなびます。",
    "en": "Move the turtle to draw lines. Match the model drawing to get it right. Learn angles, loops, and variables."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "loop",
      "angle"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai1.png",
      "en": "images/answers/en/odai1.png"
     },
     "video": {
      "ja": "videos/ja/draw-01.mp4",
      "en": "videos/en/draw-01.mp4"
     },
     "title": {
      "ja": "① 六角形（ろっかくけい） ★",
      "en": "① Hexagon ★"
     },
     "text": {
      "ja": "1つの へんが 80ほの 六角形を かこう。",
      "en": "Draw a hexagon with sides of 80 steps."
     },
     "hint": {
      "ja": "6かい くりかえすよ。まわる かくどは 360 ÷ 6 = ？",
      "en": "Repeat 6 times. How many degrees to turn? 360 ÷ 6 = ?"
     },
     "goal": {
      "ja": "くりかえしで 正多角形を かこう",
      "en": "Draw a regular polygon with a loop"
     },
     "point": {
      "ja": "6かい くりかえして、1かいに 60ど まわる。360 ÷ 6 = 60 だね。",
      "en": "Repeat 6 times and turn 60° each time: 360 ÷ 6 = 60."
     },
     "mistake": {
      "ja": "まわる かどを 120ど（内がわの かど）に してしまう。カメが まわるのは 外がわの かど だよ。",
      "en": "Turning 120° (the inside angle). The turtle turns the outside angle."
     }
    },
    {
     "n": 2,
     "tags": [
      "loop",
      "angle"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai2.png",
      "en": "images/answers/en/odai2.png"
     },
     "video": {
      "ja": "videos/ja/draw-02.mp4",
      "en": "videos/en/draw-02.mp4"
     },
     "title": {
      "ja": "② ほし ★★",
      "en": "② Star ★★"
     },
     "text": {
      "ja": "1つの せんが 150ほの ほしを かこう。",
      "en": "Draw a star with lines of 150 steps."
     },
     "hint": {
      "ja": "5かい くりかえすと、カメは 2しゅう（720ど）まわるよ。720 ÷ 5 = ？",
      "en": "After 5 repeats the turtle turns around twice (720 degrees). 720 ÷ 5 = ?"
     },
     "goal": {
      "ja": "2しゅう まわる 図形を かこう",
      "en": "Draw a shape that turns around twice"
     },
     "point": {
      "ja": "5かいで 720ど（2しゅう）まわるから、1かいは 720 ÷ 5 = 144ど。",
      "en": "It turns 720° (twice around) in 5 repeats, so each turn is 720 ÷ 5 = 144°."
     },
     "mistake": {
      "ja": "72ど（360 ÷ 5）に すると、ほしではなく 五角形に なるよ。",
      "en": "Using 72° (360 ÷ 5) draws a pentagon, not a star."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "angle"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai3.png",
      "en": "images/answers/en/odai3.png"
     },
     "video": {
      "ja": "videos/ja/draw-03.mp4",
      "en": "videos/en/draw-03.mp4"
     },
     "title": {
      "ja": "③ まる ★★",
      "en": "③ Circle ★★"
     },
     "text": {
      "ja": "10ほ すすんで すこし まわる、を くりかえして まるを かこう。",
      "en": "Draw a circle by repeating: move 10 steps, then turn a little."
     },
     "hint": {
      "ja": "1しゅうは 360ど。10どずつ まわるなら なんかい くりかえす？",
      "en": "One full turn is 360 degrees. If you turn 10 degrees each time, how many repeats do you need?"
     },
     "goal": {
      "ja": "みじかい 直線で まるを つくろう",
      "en": "Make a circle from short lines"
     },
     "point": {
      "ja": "10ほ すすんで 10ど まわる を 36かい。ちいさな まがりを たくさん つなぐと まるに 見えるよ。",
      "en": "Move 10 and turn 10°, 36 times. Many small turns look like a circle."
     },
     "mistake": {
      "ja": "くりかえす かいすうが たりないと、まるが とちゅうで とまるよ（360 ÷ 10 = 36）。",
      "en": "Too few repeats and the circle stops partway (360 ÷ 10 = 36)."
     }
    },
    {
     "n": 4,
     "tags": [
      "nest"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai4.png",
      "en": "images/answers/en/odai4.png"
     },
     "video": {
      "ja": "videos/ja/draw-04.mp4",
      "en": "videos/en/draw-04.mp4"
     },
     "title": {
      "ja": "④ まど ★★★",
      "en": "④ Window ★★★"
     },
     "text": {
      "ja": "1つの へんが 60ほの しかくを 4つ くっつけて、まどの かたちを かこう。",
      "en": "Draw 4 squares (sides of 60 steps) next to each other to make a window."
     },
     "hint": {
      "ja": "「しかくを かく」を 4かい くりかえす。しかくを 1つ かいたら みぎに 90ど まわろう。くりかえしの なかに くりかえしを いれるよ。",
      "en": "Repeat \"draw a square\" 4 times. After each square, turn right 90 degrees. Put a repeat inside a repeat!"
     },
     "goal": {
      "ja": "くりかえしの なかに くりかえし",
      "en": "Put a loop inside a loop"
     },
     "point": {
      "ja": "しかくを かく くりかえしを、さらに 4かい くりかえすよ。",
      "en": "Repeat the square-drawing loop 4 more times."
     },
     "mistake": {
      "ja": "しかくを かいた あとの「みぎに 90ど」を わすれると、しかくが かさなって 1つに 見えるよ。",
      "en": "Forget “turn right 90” after each square, and the squares overlap into one."
     }
    },
    {
     "n": 5,
     "tags": [
      "nest",
      "angle"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai5.png",
      "en": "images/answers/en/odai5.png"
     },
     "video": {
      "ja": "videos/ja/draw-05.mp4",
      "en": "videos/en/draw-05.mp4"
     },
     "title": {
      "ja": "⑤ はな ★★★",
      "en": "⑤ Flower ★★★"
     },
     "text": {
      "ja": "まるを まわしながら 6こ かいて、はなを かこう。（まるは 5ほ・10ど を 36かい）",
      "en": "Draw 6 circles, turning between them, to make a flower. (Circle: 5 steps and 10 degrees, 36 times)"
     },
     "hint": {
      "ja": "まるを 1こ かいたら、360 ÷ 6 = 60ど まわる。これを 6かい くりかえす。",
      "en": "After each circle, turn 360 ÷ 6 = 60 degrees. Repeat this 6 times."
     },
     "goal": {
      "ja": "いれこ ＋ くるっと まわす",
      "en": "Nesting + rotating"
     },
     "point": {
      "ja": "まるを 1こ かいたら 60ど まわる。これを 6かい くりかえすよ。",
      "en": "After each circle, turn 60°. Do this 6 times."
     },
     "mistake": {
      "ja": "まわる かくどが 60ど でないと、はなびらが かたよるよ。",
      "en": "If the turn is not 60°, the petals are uneven."
     }
    },
    {
     "n": 6,
     "tags": [
      "var",
      "loop"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai6.png",
      "en": "images/answers/en/odai6.png"
     },
     "video": {
      "ja": "videos/ja/draw-06.mp4",
      "en": "videos/en/draw-06.mp4"
     },
     "title": {
      "ja": "⑥ しかくい うずまき ★★★★",
      "en": "⑥ Square spiral ★★★★"
     },
     "text": {
      "ja": "すすむ ながさを 10ほ、20ほ、30ほ…と 200ほまで のばしながら、みぎに 90どずつ まわろう。",
      "en": "Move 10, 20, 30 … up to 200 steps, turning right 90 degrees each time."
     },
     "hint": {
      "ja": "「くりかえし」の「i を 10 から 200 まで 10ずつ」を つかう。「すすむ」の かずに へんすう i を いれよう。",
      "en": "Use the loop \"count with i from 10 to 200 by 10\". Put the variable i into the \"move\" block."
     },
     "goal": {
      "ja": "へんすうを ながさに つかおう",
      "en": "Use a variable as a length"
     },
     "point": {
      "ja": "i が 10、20、30…と かわるので、すすむ ながさが だんだん のびていくよ。",
      "en": "i changes to 10, 20, 30…, so the line gets longer and longer."
     },
     "mistake": {
      "ja": "「すすむ」に かずを いれたままだと ながさが かわらない。へんすう i を いれよう。",
      "en": "With a fixed number in “move”, the length never changes. Put the variable i in."
     }
    },
    {
     "n": 7,
     "tags": [
      "var",
      "math",
      "nest"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai7.png",
      "en": "images/answers/en/odai7.png"
     },
     "video": {
      "ja": "videos/ja/draw-07.mp4",
      "en": "videos/en/draw-07.mp4"
     },
     "title": {
      "ja": "⑦ ならんだ たかくけい ★★★★",
      "en": "⑦ Polygons in a row ★★★★"
     },
     "text": {
      "ja": "三角形・四角形・五角形…八角形まで、1つの へんが 50ほの かたちを おなじ ばしょから かこう。",
      "en": "From the same spot, draw a triangle, square, pentagon … up to an octagon, each with sides of 50 steps."
     },
     "hint": {
      "ja": "n を 3 から 8 まで かえながら、「n かい くりかえす：50ほ すすむ、360 ÷ n ど まわる」。けいさんブロックを つかおう。",
      "en": "Change n from 3 to 8: \"repeat n times: move 50 steps, turn right 360 ÷ n degrees\". Use the math block!"
     },
     "goal": {
      "ja": "へんすう ＋ けいさん",
      "en": "Variable + math"
     },
     "point": {
      "ja": "n かくけいの まわる かくどは 360 ÷ n。n を 3〜8 に かえて 6つの かたちを かくよ。",
      "en": "An n-sided shape turns 360 ÷ n each time. Change n from 3 to 8 to draw 6 shapes."
     },
     "mistake": {
      "ja": "まわる かくどを かず（例：60）の ままに すると、ぜんぶ おなじ かたちに なるよ。",
      "en": "With a fixed turn (like 60), every shape is the same."
     }
    },
    {
     "n": 8,
     "tags": [
      "decomp",
      "loop"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai8.png",
      "en": "images/answers/en/odai8.png"
     },
     "video": {
      "ja": "videos/ja/draw-08.mp4",
      "en": "videos/en/draw-08.mp4"
     },
     "title": {
      "ja": "⑧ ゆきの けっしょう ★★★★★",
      "en": "⑧ Snowflake ★★★★★"
     },
     "text": {
      "ja": "1本の えだを かいて もとの ばしょに もどり、60ど まわる。これを 6かい くりかえそう。",
      "en": "Draw one branch, come back to where you started, and turn 60 degrees. Repeat this 6 times."
     },
     "hint": {
      "ja": "えだ：80ほ すすむ → 30ほ さがる → ひだり45ど → 25ほ すすむ → 25ほ さがる → みぎ90ど → 25ほ すすむ → 25ほ さがる → ひだり45ど → 50ほ さがる。",
      "en": "Branch: forward 80 → back 30 → left 45 → forward 25 → back 25 → right 90 → forward 25 → back 25 → left 45 → back 50."
     },
     "goal": {
      "ja": "てじゅんを わけて かんがえよう",
      "en": "Break the task into steps"
     },
     "point": {
      "ja": "1本の えだを かいたら、いちも むきも もとに もどすのが コツ。",
      "en": "The trick: after each branch, put the position and the direction back."
     },
     "mistake": {
      "ja": "さいごの「50ほ さがる」を わすれると、えだが ずれていくよ。",
      "en": "Forget the final “move back 50”, and the branches drift."
     }
    },
    {
     "n": 9,
     "tags": [
      "var",
      "math"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/odai9.png",
      "en": "images/answers/en/odai9.png"
     },
     "video": {
      "ja": "videos/ja/draw-09.mp4",
      "en": "videos/en/draw-09.mp4"
     },
     "title": {
      "ja": "⑨ ほしの うずまき ★★★★★",
      "en": "⑨ Star spiral ★★★★★"
     },
     "text": {
      "ja": "すすむ ながさを 4ほ、8ほ、12ほ…と 4ほずつ のばしながら（50かい）、みぎに 144どずつ まわろう。",
      "en": "Move 4, 8, 12 … steps (4 more each time, 50 times), turning right 144 degrees."
     },
     "hint": {
      "ja": "i を 1 から 50 まで 1ずつ。すすむ ながさは i × 4 だよ。いろを「ランダム」に すると きれい！",
      "en": "Count i from 1 to 50 by 1. Move i × 4 steps. Try a \"random\" pen color!"
     },
     "goal": {
      "ja": "へんすう × けいさん ＋ 回転",
      "en": "Variable × math + turning"
     },
     "point": {
      "ja": "すすむ ながさ i × 4 が だんだん のびて、144ど ずつ まわる ほしが うずまきに なるよ。",
      "en": "The length i × 4 grows, and turning 144° each time makes a star spiral."
     },
     "mistake": {
      "ja": "かけざんブロックに へんすう i を いれないと、ながさが のびないよ。",
      "en": "Without the variable i in the multiply block, the length does not grow."
     }
    }
   ]
  },
  {
   "key": "maze",
   "file": "maze.html",
   "icon": "⛏",
   "name": {
    "ja": "ブロックでめいろ",
    "en": "Block Maze"
   },
   "intro": {
    "ja": "たんけんかを ゴールの ダイヤまで うごかします。じゅんばん → くりかえし → もし → どんな めいろでも とける ほうほう へと すすみます。",
    "en": "Move the explorer to the diamond. Go from sequence → loops → “if” → a way to solve any maze."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/maze1.png",
      "en": "images/answers/en/maze1.png"
     },
     "video": {
      "ja": "videos/ja/maze-01.mp4",
      "en": "videos/en/maze-01.mp4"
     },
     "title": {
      "ja": "ステージ1　まっすぐ すすもう",
      "en": "Stage 1: Go straight"
     },
     "text": {
      "ja": "たんけんかを ゴールの ダイヤ 💎 まで うごかそう。「まえに すすむ」ブロックを ひだりから ひっぱってきて、たてに つなげてね。",
      "en": "Move the explorer to the diamond 💎. Drag \"move forward\" blocks from the left and stack them."
     },
     "hint": {
      "ja": "ゴールまで なんマス あるかな？ その かずだけ「まえに すすむ」を つなげよう。",
      "en": "How many squares to the goal? Stack that many \"move forward\" blocks."
     },
     "goal": {
      "ja": "じゅんばんに ならべよう",
      "en": "Put the steps in order"
     },
     "point": {
      "ja": "めいれいは うえから じゅんばんに うごくよ。「まえに すすむ」を 4こ つなげたね。",
      "en": "Commands run in order from top to bottom. You stacked four “move forward” blocks."
     },
     "mistake": {
      "ja": "ブロックを たてに つなげずに はなして おくと、うごかないよ。",
      "en": "Blocks that are not connected do not run."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/maze2.png",
      "en": "images/answers/en/maze2.png"
     },
     "video": {
      "ja": "videos/ja/maze-02.mp4",
      "en": "videos/en/maze-02.mp4"
     },
     "title": {
      "ja": "ステージ2　まがってみよう",
      "en": "Stage 2: Let's turn"
     },
     "text": {
      "ja": "とちゅうで まがるよ。たんけんかの ライト（きいろい ひかり）が てらしている ほうが「まえ」だよ。",
      "en": "You turn on the way. \"Forward\" is where the explorer's light (yellow beam) is shining."
     },
     "hint": {
      "ja": "2マス すすんだら「みぎを むく」。むきを かえても マスは うごかないよ。",
      "en": "After 2 squares, \"turn right\". Turning does not move you to another square."
     },
     "goal": {
      "ja": "むきを かんがえよう",
      "en": "Think about direction"
     },
     "point": {
      "ja": "「むく」は その ばで むきを かえるだけ。マスは うごかないよ。",
      "en": "“Turn” only changes the direction. The explorer stays on the same square."
     },
     "mistake": {
      "ja": "「みぎを むく」だけでは すすまない。むいた あとに「すすむ」が ひつようだよ。",
      "en": "Turning alone does not move you. Add “move forward” after turning."
     }
    },
    {
     "n": 3,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/maze3.png",
      "en": "images/answers/en/maze3.png"
     },
     "video": {
      "ja": "videos/ja/maze-03.mp4",
      "en": "videos/en/maze-03.mp4"
     },
     "title": {
      "ja": "ステージ3　ながい みち",
      "en": "Stage 3: A long path"
     },
     "text": {
      "ja": "ながい みちを すすもう。たんけんかに なったつもりで、どっちに まがるか かんがえよう。",
      "en": "Walk the long path. Pretend you are the explorer and think about which way to turn."
     },
     "hint": {
      "ja": "4マス すすむ → みぎを むく → 2マス すすむ → みぎを むく → 4マス すすむ",
      "en": "Forward 4 → turn right → forward 2 → turn right → forward 4"
     },
     "goal": {
      "ja": "ながい てじゅんを くみたてよう",
      "en": "Build a long set of steps"
     },
     "point": {
      "ja": "12こも つかって たいへん！ つぎは もっと みじかく する ほうほうを まなぶよ。",
      "en": "That took 12 blocks! Next, you will learn a way to make it shorter."
     },
     "mistake": {
      "ja": "まがる むきを まちがえやすい。たんけんかに なったつもりで かんがえよう。",
      "en": "It is easy to mix up left and right. Imagine you are the explorer."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop"
     ],
     "limit": 5,
     "img": {
      "ja": "images/answers/maze4.png",
      "en": "images/answers/en/maze4.png"
     },
     "video": {
      "ja": "videos/ja/maze-04.mp4",
      "en": "videos/en/maze-04.mp4"
     },
     "title": {
      "ja": "ステージ4　くりかえしを つかおう",
      "en": "Stage 4: Use a loop"
     },
     "text": {
      "ja": "おなじ ブロックを なんども ならべるのは たいへん。「〇かい くりかえす」の なかに ブロックを いれると、まとめて くりかえせるよ。",
      "en": "Stacking the same block again and again is hard work. Put blocks inside \"repeat\" to repeat them."
     },
     "hint": {
      "ja": "「4かい くりかえす（まえに すすむ）」→「みぎを むく」→「4かい くりかえす（まえに すすむ）」",
      "en": "\"repeat 4 (move forward)\" → \"turn right\" → \"repeat 4 (move forward)\""
     },
     "goal": {
      "ja": "くりかえしで みじかく しよう",
      "en": "Make it shorter with a loop"
     },
     "point": {
      "ja": "おなじ ブロックの くりかえしは「〇かい くりかえす」で まとめられるよ。",
      "en": "Repeated blocks can be grouped with “repeat __ times”."
     },
     "mistake": {
      "ja": "くりかえしの なかに「みぎを むく」まで いれると、ちがう うごきに なるよ。",
      "en": "Putting “turn right” inside the loop changes the movement."
     }
    },
    {
     "n": 5,
     "tags": [
      "loop",
      "pattern"
     ],
     "limit": 5,
     "img": {
      "ja": "images/answers/maze5.png",
      "en": "images/answers/en/maze5.png"
     },
     "video": {
      "ja": "videos/ja/maze-05.mp4",
      "en": "videos/en/maze-05.mp4"
     },
     "title": {
      "ja": "ステージ5　かいだんを のぼろう",
      "en": "Stage 5: Climb the stairs"
     },
     "text": {
      "ja": "かいだんの かたちを よく みてみよう。おなじ うごきの セットが くりかえされて いるよ。",
      "en": "Look closely at the stairs. The same set of moves repeats."
     },
     "hint": {
      "ja": "「すすむ → みぎを むく → すすむ → ひだりを むく」が 1セット。これを なんかい くりかえす？",
      "en": "One set is \"forward → turn right → forward → turn left\". How many times should it repeat?"
     },
     "goal": {
      "ja": "くりかえす パターンを みつけよう",
      "en": "Find the pattern that repeats"
     },
     "point": {
      "ja": "「すすむ・みぎ・すすむ・ひだり」が 1セット。ゴールに ついたら そこで とまるよ。",
      "en": "One set is forward, right, forward, left. The program stops when it reaches the goal."
     },
     "mistake": {
      "ja": "1セットの じゅんばん（すすむ → みぎ → すすむ → ひだり）を まちがえやすいよ。",
      "en": "It is easy to get the order of the set wrong (forward → right → forward → left)."
     }
    },
    {
     "n": 6,
     "tags": [
      "if",
      "until"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/maze6.png",
      "en": "images/answers/en/maze6.png"
     },
     "video": {
      "ja": "videos/ja/maze-06.mp4",
      "en": "videos/en/maze-06.mp4"
     },
     "title": {
      "ja": "ステージ6　もし〜なら",
      "en": "Stage 6: If…"
     },
     "text": {
      "ja": "「ゴールに つくまで くりかえす」と「もし まえが あいていたら」を つかってみよう。たんけんかが じぶんで まえを みて、すすむか まがるかを きめるよ。",
      "en": "Try \"repeat until goal\" and \"if front is open\". The explorer looks ahead and decides to move or turn by itself."
     },
     "hint": {
      "ja": "ゴールに つくまで くりかえす：もし まえ が あいていたら「すすむ」、そうでなければ「みぎを むく」",
      "en": "Repeat until goal: if front is open \"move forward\", else \"turn right\"."
     },
     "goal": {
      "ja": "「もし」で じぶんで きめさせよう",
      "en": "Let the explorer decide with “if”"
     },
     "point": {
      "ja": "まえが あいていたら すすむ、だめなら みぎ。たんけんかが じぶんで きめたね。",
      "en": "If the front is open, move. If not, turn right. The explorer decided by itself!"
     },
     "mistake": {
      "ja": "「もし」を くりかえしの そとに おくと、1かいしか しらべないよ。",
      "en": "If the “if” is outside the loop, it only checks once."
     }
    },
    {
     "n": 7,
     "tags": [
      "if",
      "nest"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/maze7.png",
      "en": "images/answers/en/maze7.png"
     },
     "video": {
      "ja": "videos/ja/maze-07.mp4",
      "en": "videos/en/maze-07.mp4"
     },
     "title": {
      "ja": "ステージ7　みぎ？ ひだり？",
      "en": "Stage 7: Right? Left?"
     },
     "text": {
      "ja": "こんどは みぎにも ひだりにも まがるよ。まえが ふさがっていたら、みぎを しらべて、それも だめなら ひだりを むこう。",
      "en": "Now you turn both right and left. If the front is blocked, check the right. If that is blocked too, turn left."
     },
     "hint": {
      "ja": "「そうでなければ」の なかに、もう1つ「もし みぎ が あいていたら」を いれよう。",
      "en": "Put another \"if right is open\" inside \"else\"."
     },
     "goal": {
      "ja": "「もし」の なかに「もし」を いれよう",
      "en": "Put an “if” inside an “if”"
     },
     "point": {
      "ja": "「そうでなければ」の なかに もう 1つ「もし」。みぎ も ひだり も えらべるよ。",
      "en": "Another “if” inside “else” lets it choose right or left."
     },
     "mistake": {
      "ja": "ステージ6の プログラムのままだと、まがった さきで いきどまりに なるよ。",
      "en": "With the Stage 6 program, you hit a dead end after turning."
     }
    },
    {
     "n": 8,
     "tags": [
      "algo",
      "if",
      "until"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/maze8.png",
      "en": "images/answers/en/maze8.png"
     },
     "video": {
      "ja": "videos/ja/maze-08.mp4",
      "en": "videos/en/maze-08.mp4"
     },
     "title": {
      "ja": "ステージ8　どんな めいろでも ゴール！",
      "en": "Stage 8: Any maze!"
     },
     "text": {
      "ja": "さいごの ちょうせん！ じっこうすると、ランダムな めいろ 30こで プログラムを テストするよ。ぜんぶ ゴールできたら クリア！",
      "en": "Final challenge! Your program is tested on 30 random mazes. Reach the goal in all of them to clear!"
     },
     "hint": {
      "ja": "「みぎての ほうそく」：みぎてを かべに つけたまま あるくと、かならず ゴールに つくよ。みぎが あいていたら、まず みぎを むいて すすもう。",
      "en": "The \"right-hand rule\": keep your right hand on the wall and you always reach the goal. If the right is open, turn right first, then move."
     },
     "goal": {
      "ja": "どんな めいろでも とける ほうほう",
      "en": "A way to solve any maze"
     },
     "point": {
      "ja": "みぎてを かべに つけて あるく「みぎての ほうそく」。どんな めいろでも ゴールできる！",
      "en": "The “right-hand rule”: keep your right hand on the wall, and you can solve any maze!"
     },
     "mistake": {
      "ja": "ステージ7の プログラムでは、めいろに よっては おなじ ところを まわりつづけるよ。",
      "en": "The Stage 7 program can keep going in circles in some mazes."
     }
    }
   ]
  },
  {
   "key": "mazejr",
   "file": "maze-junior.html",
   "icon": "🧭",
   "name": {
    "ja": "やじるしの めいろ",
    "en": "Arrow Maze"
   },
   "intro": {
    "ja": "ていがくねん むけ。うえ・した・ひだり・みぎ の やじるしで、たんけんかを ダイヤまで うごかします。「むき」を かんがえずに、じゅんばんを まなびます。",
    "en": "For younger kids. Move the explorer to the diamond with up, down, left and right arrows. Learn about order without thinking about directions."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazejr1.png",
      "en": "images/answers/en/mazejr1.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-01.mp4",
      "en": "videos/en/mazejr-01.mp4"
     },
     "title": {
      "ja": "ステージ1　みぎへ すすもう",
      "en": "Stage 1: Go right"
     },
     "text": {
      "ja": "「みぎへ ➡」を 3つ つなげて、ダイヤ 💎 まで いこう。",
      "en": "Stack three \"right ➡\" arrows and go to the diamond 💎."
     },
     "hint": {
      "ja": "ダイヤまで 3マス だよ。",
      "en": "The diamond is 3 squares away."
     },
     "goal": {
      "ja": "やじるしを ならべて すすもう",
      "en": "Line up arrows to move"
     },
     "point": {
      "ja": "やじるし 1つで 1マス。ダイヤまでの マスを かぞえて、その かずだけ つなげよう。",
      "en": "One arrow moves one square. Count the squares to the diamond and stack that many."
     },
     "mistake": {
      "ja": "やじるしが 2つだと とどかない、4つだと くさむらに ぶつかるよ。",
      "en": "With 2 arrows you fall short; with 4 you bump into the bushes."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazejr2.png",
      "en": "images/answers/en/mazejr2.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-02.mp4",
      "en": "videos/en/mazejr-02.mp4"
     },
     "title": {
      "ja": "ステージ2　したへ まがろう",
      "en": "Stage 2: Go down"
     },
     "text": {
      "ja": "「みぎへ ➡」と「したへ ⬇」を つかおう。",
      "en": "Use \"right ➡\" and \"down ⬇\"."
     },
     "hint": {
      "ja": "みぎへ 1つ、したへ 3つ、みぎへ 2つ。",
      "en": "right, then down 3 times, then right 2 times."
     },
     "goal": {
      "ja": "2しゅるいの やじるしを つかおう",
      "en": "Use two kinds of arrows"
     },
     "point": {
      "ja": "みぎへ → したへ → みぎへ。いく じゅんばんに やじるしを ならべるよ。",
      "en": "Right → down → right. Put the arrows in the order you go."
     },
     "mistake": {
      "ja": "「したへ」の かずを まちがえると、くさむらに ぶつかるよ。",
      "en": "If you use the wrong number of “down” arrows, you bump into the bushes."
     }
    },
    {
     "n": 3,
     "tags": [
      "seq",
      "pattern"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazejr3.png",
      "en": "images/answers/en/mazejr3.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-03.mp4",
      "en": "videos/en/mazejr-03.mp4"
     },
     "title": {
      "ja": "ステージ3　かいだん",
      "en": "Stage 3: Stairs"
     },
     "text": {
      "ja": "みぎ と した を じゅんばんに。",
      "en": "Right and down, one after the other."
     },
     "hint": {
      "ja": "みぎ → した → みぎ → した → みぎ → した",
      "en": "right, down, right, down, right, down"
     },
     "goal": {
      "ja": "こうごの ならびを みつけよう",
      "en": "Find the alternating pattern"
     },
     "point": {
      "ja": "みぎ・した・みぎ・した…と、おなじ ならびが つづいているね。",
      "en": "Right, down, right, down… the same pair keeps going."
     },
     "mistake": {
      "ja": "みぎを 2かい つづけると くさむらに ぶつかるよ。",
      "en": "Two “right” arrows in a row bump into the bushes."
     }
    },
    {
     "n": 4,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazejr4.png",
      "en": "images/answers/en/mazejr4.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-04.mp4",
      "en": "videos/en/mazejr-04.mp4"
     },
     "title": {
      "ja": "ステージ4　うえへ のぼろう",
      "en": "Stage 4: Go up"
     },
     "text": {
      "ja": "こんどは「うえへ ⬆」も つかうよ。",
      "en": "Now use \"up ⬆\" too."
     },
     "hint": {
      "ja": "うえへ 3つ、みぎへ 3つ。",
      "en": "up 3 times, then right 3 times."
     },
     "goal": {
      "ja": "うえへ も つかおう",
      "en": "Use “up” too"
     },
     "point": {
      "ja": "スタートは ひだりした。さきに うえへ 3つ、それから みぎへ 3つ。",
      "en": "You start at the bottom left. First up 3, then right 3."
     },
     "mistake": {
      "ja": "「みぎへ」から はじめると、すぐ くさむらに ぶつかるよ。",
      "en": "If you start with “right”, you bump into the bushes right away."
     }
    },
    {
     "n": 5,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazejr5.png",
      "en": "images/answers/en/mazejr5.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-05.mp4",
      "en": "videos/en/mazejr-05.mp4"
     },
     "title": {
      "ja": "ステージ5　ぐるっと まわろう",
      "en": "Stage 5: Go around"
     },
     "text": {
      "ja": "4つの やじるしを ぜんぶ つかおう。",
      "en": "Use all four arrows."
     },
     "hint": {
      "ja": "みぎへ 2つ、したへ 2つ、ひだりへ 2つ。",
      "en": "right 2, down 2, left 2."
     },
     "goal": {
      "ja": "4つの やじるしを ぜんぶ つかおう",
      "en": "Use all four arrows"
     },
     "point": {
      "ja": "みぎ → した → ひだり。ぐるっと まわって ダイヤへ。",
      "en": "Right → down → left. Go around to the diamond."
     },
     "mistake": {
      "ja": "「ひだりへ」と「みぎへ」を まちがえやすいよ。たんけんかから みて ではなく、がめんの ひだり・みぎ。",
      "en": "“Left” and “right” are easy to mix up. They mean left and right on the screen."
     }
    },
    {
     "n": 6,
     "tags": [
      "loop",
      "pattern"
     ],
     "limit": 3,
     "img": {
      "ja": "images/answers/mazejr6.png",
      "en": "images/answers/en/mazejr6.png"
     },
     "video": {
      "ja": "videos/ja/mazejr-06.mp4",
      "en": "videos/en/mazejr-06.mp4"
     },
     "title": {
      "ja": "ステージ6　くりかえしを つかおう",
      "en": "Stage 6: Use repeat"
     },
     "text": {
      "ja": "ながい かいだん！「みぎへ ➡ したへ ⬇」を「くりかえす」の なかに いれよう。",
      "en": "A long staircase! Put \"right ➡ down ⬇\" inside \"repeat\"."
     },
     "hint": {
      "ja": "「4かい くりかえす」の なかに「みぎへ」「したへ」。",
      "en": "repeat 4 times: right, down"
     },
     "goal": {
      "ja": "くりかえしで みじかく しよう",
      "en": "Make it shorter with repeat"
     },
     "point": {
      "ja": "「みぎへ・したへ」の セットを 4かい。ブロック 3こで かけるね。",
      "en": "Repeat the “right, down” set 4 times. Just 3 blocks!"
     },
     "mistake": {
      "ja": "くりかえしの かずが 3だと、ダイヤの てまえで とまるよ。",
      "en": "With 3 repeats you stop just before the diamond."
     }
    }
   ]
  },
  {
   "key": "mazekey",
   "file": "maze-key.html",
   "icon": "🗝",
   "name": {
    "ja": "かぎと とびらの めいろ",
    "en": "Keys & Doors Maze"
   },
   "intro": {
    "ja": "かぎを ひろって とびらを あけながら すすみます。「いま なにを もっているか」（じょうたい）を おぼえて かんがえる れんしゅうです。",
    "en": "Pick up keys and open doors as you go. Practice remembering what you are carrying (state)."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "state"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazekey1.png",
      "en": "images/answers/en/mazekey1.png"
     },
     "video": {
      "ja": "videos/ja/mazekey-01.mp4",
      "en": "videos/en/mazekey-01.mp4"
     },
     "title": {
      "ja": "ステージ1　かぎを ひろって とびらを あけよう",
      "en": "Stage 1: Pick up the key, open the door"
     },
     "text": {
      "ja": "かぎ 🔑 の うえで「かぎを ひろう」。とびら 🚪 の まえで「とびらを あける」と、とおれるように なるよ。",
      "en": "Move onto the key 🔑 and use \"pick up key\". In front of the door 🚪, use \"open door\" and you can go through."
     },
     "hint": {
      "ja": "すすむ → すすむ → かぎを ひろう → とびらを あける → すすむ → すすむ",
      "en": "forward → forward → pick up key → open door → forward → forward"
     },
     "goal": {
      "ja": "かぎを ひろって とびらを あけよう",
      "en": "Pick up the key and open the door"
     },
     "point": {
      "ja": "「かぎを ひろう」で もちものが 1こに なり、「とびらを あける」で 0こに もどる。",
      "en": "“Pick up key” makes your key count 1, and “open door” brings it back to 0."
     },
     "mistake": {
      "ja": "かぎの うえに いないのに ひろうと「ここには かぎが ないよ」。すすむ かずを たしかめよう。",
      "en": "Picking up when you are not on the key gives “There is no key here.” Check how far you move."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "state",
      "decomp"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazekey2.png",
      "en": "images/answers/en/mazekey2.png"
     },
     "video": {
      "ja": "videos/ja/mazekey-02.mp4",
      "en": "videos/en/mazekey-02.mp4"
     },
     "title": {
      "ja": "ステージ2　かぎは どこ？",
      "en": "Stage 2: Where is the key?"
     },
     "text": {
      "ja": "とびらの むこうに ダイヤが あるよ。さきに かぎを ひろいに いこう。かぎが ないと とびらは あかないよ。",
      "en": "The diamond is behind the door. Go and get the key first. Without a key, the door will not open."
     },
     "hint": {
      "ja": "かぎまで いって ひろったら、みぎを 2かい むいて もどろう。",
      "en": "Walk to the key and pick it up. Then turn right twice and go back."
     },
     "goal": {
      "ja": "さきに かぎを とりに いこう",
      "en": "Get the key first"
     },
     "point": {
      "ja": "ゴールの まえに より道。「かぎを とる」と「とびらへ もどる」に わけて かんがえよう。",
      "en": "Take a side trip before the goal. Think of it as “get the key” and “go back to the door”."
     },
     "mistake": {
      "ja": "かぎを もたずに とびらへ すすむと「とびらが あかないよ。かぎは どこかな？」。",
      "en": "Going to the door without a key gives “The door is locked. Where is the key?”"
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "pattern",
      "state"
     ],
     "limit": 7,
     "img": {
      "ja": "images/answers/mazekey3.png",
      "en": "images/answers/en/mazekey3.png"
     },
     "video": {
      "ja": "videos/ja/mazekey-03.mp4",
      "en": "videos/en/mazekey-03.mp4"
     },
     "title": {
      "ja": "ステージ3　とびらが 2つ",
      "en": "Stage 3: Two doors"
     },
     "text": {
      "ja": "かぎと とびらが ならんでいるよ。おなじ うごきの セットを みつけて「くりかえす」で まとめよう。",
      "en": "Keys and doors are in a row. Find the set of moves that repeats and use \"repeat\"."
     },
     "hint": {
      "ja": "「すすむ → かぎを ひろう → とびらを あける → すすむ」を 2かい。さいごに みぎを むいて すすむ。",
      "en": "Repeat 2 times: forward → pick up key → open door → forward. Then turn right and move forward."
     },
     "goal": {
      "ja": "おなじ セットを くりかえそう",
      "en": "Repeat the same set"
     },
     "point": {
      "ja": "かぎ → とびら が 2かい ならんでいる。4つの ブロックを まとめて 2かい。",
      "en": "Key → door appears twice. Repeat the 4 blocks 2 times."
     },
     "mistake": {
      "ja": "「とびらを あける」の あとの「まえに すすむ」を わすれると、つぎの かぎに とどかないよ。",
      "en": "If you forget “move forward” after “open door”, you never reach the next key."
     }
    },
    {
     "n": 4,
     "tags": [
      "if",
      "until",
      "state",
      "algo"
     ],
     "limit": 8,
     "img": {
      "ja": "images/answers/mazekey4.png",
      "en": "images/answers/en/mazekey4.png"
     },
     "video": {
      "ja": "videos/ja/mazekey-04.mp4",
      "en": "videos/en/mazekey-04.mp4"
     },
     "title": {
      "ja": "ステージ4　じぶんで かんがえる たんけんか",
      "en": "Stage 4: A thinking explorer"
     },
     "text": {
      "ja": "「ゴールに つくまで くりかえす」と「もし 〜なら」で、かぎを みつけたら ひろい、とびらが あったら あける プログラムに しよう。",
      "en": "Use \"repeat until goal\" and \"if\". Make a program that picks up a key when it finds one and opens a door when there is one."
     },
     "hint": {
      "ja": "くりかえしの なかで：もし ここに かぎが ある なら ひろう → もし まえが とびら なら あける → もし まえが あいていたら すすむ、そうでなければ みぎを むく",
      "en": "Inside the loop: if key here → pick up key; if door in front → open door; if front is open → forward, else → turn right."
     },
     "goal": {
      "ja": "しらべながら じぶんで きめよう",
      "en": "Check and decide by yourself"
     },
     "point": {
      "ja": "かぎを みつけたら ひろう、とびらが あったら あける、あとは まえ か みぎ。この 3つを まいかい しらべるよ。",
      "en": "Pick up a key when you find one, open a door when there is one, and then go forward or turn right. Check all three every time."
     },
     "mistake": {
      "ja": "「もし まえが とびら」より さきに「もし まえ が あいていたら」を おくと、とびらの まえで まわって しまうよ。",
      "en": "If “if front is open” comes before “if door in front”, you turn around at the door."
     }
    }
   ]
  },
  {
   "key": "mazeenemy",
   "file": "maze-enemy.html",
   "icon": "👾",
   "name": {
    "ja": "てきを よける めいろ",
    "en": "Dodge the Slime Maze"
   },
   "intro": {
    "ja": "きまった みちを いったり きたり する スライムを、「まつ」で よけて すすみます。タイミングと「もし」を まなびます。",
    "en": "Dodge slimes that move back and forth by waiting. Learn about timing and “if”."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "timing"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/mazeenemy1.png",
      "en": "images/answers/en/mazeenemy1.png"
     },
     "video": {
      "ja": "videos/ja/mazeenemy-01.mp4",
      "en": "videos/en/mazeenemy-01.mp4"
     },
     "title": {
      "ja": "ステージ1　まって よけよう",
      "en": "Stage 1: Wait and dodge"
     },
     "text": {
      "ja": "スライムが うえと したに いったり きたり しているよ。ぶつからないように「まつ」で タイミングを あわせよう。",
      "en": "The slime goes up and down. Use \"wait\" to time your move so you do not bump into it."
     },
     "hint": {
      "ja": "1マス すすんだら、スライムが とおりすぎるまで 2かい まつ。それから 3マス すすもう。",
      "en": "Move 1 square, then wait 2 times until the slime passes. Then move 3 squares."
     },
     "goal": {
      "ja": "まって タイミングを あわせよう",
      "en": "Wait to time your move"
     },
     "point": {
      "ja": "スライムは 1かいごとに 1マス。とおりすぎるまで「まつ」を 2かい。",
      "en": "The slime moves one square each turn. Wait 2 times until it passes."
     },
     "mistake": {
      "ja": "「まつ」が 1かいだと、ちょうど スライムに ぶつかるよ。",
      "en": "With only one “wait”, you walk right into the slime."
     }
    },
    {
     "n": 2,
     "tags": [
      "if",
      "until",
      "timing"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/mazeenemy2.png",
      "en": "images/answers/en/mazeenemy2.png"
     },
     "video": {
      "ja": "videos/ja/mazeenemy-02.mp4",
      "en": "videos/en/mazeenemy-02.mp4"
     },
     "title": {
      "ja": "ステージ2　あぶなかったら まつ",
      "en": "Stage 2: Wait if it is dangerous"
     },
     "text": {
      "ja": "「もし まえが あぶなかったら」を つかおう。スライムが まえに いる ときや、つぎに まえに くる ときは「あぶない」だよ。",
      "en": "Use \"if danger ahead\". It is dangerous when a slime is in front of you, or will move in front of you next."
     },
     "hint": {
      "ja": "ゴールに つくまで くりかえす：もし まえが あぶなかったら まつ、そうでなければ すすむ",
      "en": "Repeat until goal: if danger ahead → wait, else → move forward."
     },
     "goal": {
      "ja": "あぶなかったら まとう",
      "en": "Wait when it is dangerous"
     },
     "point": {
      "ja": "「あぶない」は、まえに スライムが いる か、つぎに まえに くる とき。そう なら まつ、ちがえば すすむ。",
      "en": "“Danger” means a slime is in front or will come there next. If so, wait; if not, move."
     },
     "mistake": {
      "ja": "「もし」を くりかえしの そとに おくと、さいしょの 1かいしか しらべないよ。",
      "en": "If the “if” is outside the loop, it checks only once."
     }
    },
    {
     "n": 3,
     "tags": [
      "if",
      "nest",
      "until",
      "timing"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/mazeenemy3.png",
      "en": "images/answers/en/mazeenemy3.png"
     },
     "video": {
      "ja": "videos/ja/mazeenemy-03.mp4",
      "en": "videos/en/mazeenemy-03.mp4"
     },
     "title": {
      "ja": "ステージ3　おおきな めいろ",
      "en": "Stage 3: A bigger maze"
     },
     "text": {
      "ja": "めいろが おおきく なったよ。あぶなかったら まつ。そうでなければ、まえが あいていたら すすむ、ふさがっていたら みぎを むく。",
      "en": "The maze is bigger. If it is dangerous, wait. If not: move forward when the front is open, turn right when it is blocked."
     },
     "hint": {
      "ja": "ゴールに つくまで くりかえす：もし まえが あぶなかったら まつ、そうでなければ（もし まえが あいていたら すすむ、そうでなければ みぎを むく）",
      "en": "Repeat until goal: if danger ahead → wait, else → (if front is open → forward, else → turn right)."
     },
     "goal": {
      "ja": "もしの なかに もし",
      "en": "An if inside an if"
     },
     "point": {
      "ja": "まず あぶないか しらべる。あぶなく なければ、まえが あいているか しらべる。じゅんばんが だいじ。",
      "en": "First check for danger. If it is safe, check if the front is open. The order matters."
     },
     "mistake": {
      "ja": "「あぶない」を しらべないで すすむと、とちゅうで スライムに つかまるよ。",
      "en": "If you move without checking for danger, a slime catches you on the way."
     }
    },
    {
     "n": 4,
     "tags": [
      "algo",
      "until",
      "timing"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/mazeenemy4.png",
      "en": "images/answers/en/mazeenemy4.png"
     },
     "video": {
      "ja": "videos/ja/mazeenemy-04.mp4",
      "en": "videos/en/mazeenemy-04.mp4"
     },
     "title": {
      "ja": "ステージ4　うずまきの めいろ",
      "en": "Stage 4: The spiral maze"
     },
     "text": {
      "ja": "さいごは 10×10 の うずまき。スライムが 3びき いるよ。ステージ3の プログラムで ゴール できるかな？",
      "en": "Last one: a 10×10 spiral with three slimes. Can the program from Stage 3 reach the goal?"
     },
     "hint": {
      "ja": "ステージ3と おなじ プログラムで いけるよ。スライムは みちを よこぎるので、まいかい「あぶない」を しらべよう。",
      "en": "Use the same program as Stage 3. The slimes cross the path, so check for danger every time."
     },
     "goal": {
      "ja": "おなじ プログラムで おおきな めいろ",
      "en": "The same program, a bigger maze"
     },
     "point": {
      "ja": "ステージ3の プログラムが そのまま つかえる。いつでも つかえる やりかた（一般化）だね。",
      "en": "The Stage 3 program works as it is. That is a method that works anywhere (generalization)."
     },
     "mistake": {
      "ja": "「まつ」を ぬくと、3びきの どれかに つかまるよ。",
      "en": "Without “wait”, one of the three slimes catches you."
     }
    }
   ]
  },
  {
   "key": "space",
   "file": "space.html",
   "icon": "🚀",
   "name": {
    "ja": "うちゅうで ほしあつめ",
    "en": "Space Star Hunt"
   },
   "intro": {
    "ja": "ほしを ぜんぶ ひろってから ロケットに のります。「その ばを しらべてから うごく」ことを まなびます。",
    "en": "Pick up every star, then board the rocket. Learn to check first, then act."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/space1.png",
      "en": "images/answers/en/space1.png"
     },
     "video": {
      "ja": "videos/ja/space-01.mp4",
      "en": "videos/en/space-01.mp4"
     },
     "title": {
      "ja": "ステージ1　ほしを ひろおう",
      "en": "Stage 1: Pick up a star"
     },
     "text": {
      "ja": "ほし ⭐ を ぜんぶ ひろってから、ロケット 🚀 に のりこもう！ ほしの マスで「ほしを ひろう」を つかうよ。",
      "en": "Pick up every star ⭐, then board the rocket 🚀! Use \"pick up star\" on a star square."
     },
     "hint": {
      "ja": "2マス すすむ → ほしを ひろう → 2マス すすむ",
      "en": "Forward 2 → pick up star → forward 2"
     },
     "goal": {
      "ja": "「ひろう」を つかおう",
      "en": "Use “pick up”"
     },
     "point": {
      "ja": "ほしの マスで「ひろう」。ぜんぶ あつめてから ロケットへ！",
      "en": "Use “pick up” on the star square. Collect them all, then go to the rocket!"
     },
     "mistake": {
      "ja": "ほしの ない マスで「ひろう」と しっぱい。どの マスで ひろうか かぞえよう。",
      "en": "Picking up on a square with no star fails. Count where to pick up."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/space2.png",
      "en": "images/answers/en/space2.png"
     },
     "video": {
      "ja": "videos/ja/space-02.mp4",
      "en": "videos/en/space-02.mp4"
     },
     "title": {
      "ja": "ステージ2　まがって あつめよう",
      "en": "Stage 2: Turn and collect"
     },
     "text": {
      "ja": "ほしが 2こ あるよ。まがる ところに きを つけよう。",
      "en": "There are 2 stars. Be careful where you turn."
     },
     "hint": {
      "ja": "2マス すすんで ひろう → 1マス すすむ → みぎを むく → 1マス すすんで ひろう → 1マス すすむ",
      "en": "Forward 2 and pick up → forward 1 → turn right → forward 1 and pick up → forward 1"
     },
     "goal": {
      "ja": "まがって じゅんばんに あつめよう",
      "en": "Turn and collect in order"
     },
     "point": {
      "ja": "まがる ばしょと ひろう ばしょの じゅんばんが だいじだよ。",
      "en": "The order of turning and picking up is important."
     },
     "mistake": {
      "ja": "まがる まえに ひろうか、まがった あとに ひろうか、じゅんばんに ちゅうい。",
      "en": "Watch the order: pick up before or after turning?"
     }
    },
    {
     "n": 3,
     "tags": [
      "loop"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/space3.png",
      "en": "images/answers/en/space3.png"
     },
     "video": {
      "ja": "videos/ja/space-03.mp4",
      "en": "videos/en/space-03.mp4"
     },
     "title": {
      "ja": "ステージ3　くりかえしで あつめよう",
      "en": "Stage 3: Collect with a loop"
     },
     "text": {
      "ja": "ほしが ならんでいるよ。「すすむ → ひろう」を くりかえしで まとめよう。",
      "en": "The stars are in a row. Put \"move → pick up\" into a loop."
     },
     "hint": {
      "ja": "「3かい くりかえす（まえに すすむ → ほしを ひろう）」→「まえに すすむ」",
      "en": "\"repeat 3 (move forward → pick up star)\" → \"move forward\""
     },
     "goal": {
      "ja": "くりかえしで あつめよう",
      "en": "Collect with a loop"
     },
     "point": {
      "ja": "「すすむ → ひろう」を 3かい くりかえして、さいごに 1マス すすむよ。",
      "en": "Repeat “move → pick up” 3 times, then move one more square."
     },
     "mistake": {
      "ja": "さいごの「すすむ」を わすれると、ロケットに つかないよ。",
      "en": "Forget the last “move” and you will not reach the rocket."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop",
      "pattern"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/space4.png",
      "en": "images/answers/en/space4.png"
     },
     "video": {
      "ja": "videos/ja/space-04.mp4",
      "en": "videos/en/space-04.mp4"
     },
     "title": {
      "ja": "ステージ4　ほしの かいだん",
      "en": "Stage 4: Star stairs"
     },
     "text": {
      "ja": "かいだんの とちゅうに ほしが あるよ。くりかえす セットを みつけよう。",
      "en": "There are stars on the stairs. Find the set of moves that repeats."
     },
     "hint": {
      "ja": "「すすむ → みぎを むく → すすむ → ひろう → ひだりを むく」を くりかえす。さいごは ロケットに ついた ところで おわるよ。",
      "en": "Repeat \"forward → turn right → forward → pick up → turn left\". You finish when you reach the rocket."
     },
     "goal": {
      "ja": "パターンを みつけて くりかえそう",
      "en": "Find the pattern and repeat it"
     },
     "point": {
      "ja": "かいだんの 1だんが 1セット。4かいめの とちゅうで ロケットに つくよ。",
      "en": "Each step of the stairs is one set. You reach the rocket during the 4th repeat."
     },
     "mistake": {
      "ja": "「ひろう」を いれる ばしょが ずれると、ほしの ない マスで ひろって しまうよ。",
      "en": "If “pick up” is in the wrong place, you pick up where there is no star."
     }
    },
    {
     "n": 5,
     "tags": [
      "if",
      "loop"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/space5.png",
      "en": "images/answers/en/space5.png"
     },
     "video": {
      "ja": "videos/ja/space-05.mp4",
      "en": "videos/en/space-05.mp4"
     },
     "title": {
      "ja": "ステージ5　もし ほしが あったら",
      "en": "Stage 5: If there is a star"
     },
     "text": {
      "ja": "ほしが ある マスと ない マスが あるよ。ない ところで「ひろう」と しっぱい！ たんけんかに しらべさせよう。",
      "en": "Some squares have stars and some don't. Picking up where there is no star is a mistake! Let the explorer check first."
     },
     "hint": {
      "ja": "「4かい くりかえす：まえに すすむ → もし ここに ほしが あったら ひろう」",
      "en": "\"repeat 4: move forward → if there is a star here, pick it up\""
     },
     "goal": {
      "ja": "しらべてから うごこう（もし）",
      "en": "Check first, then act (if)"
     },
     "point": {
      "ja": "ほしが ある ときだけ ひろう。「もし」で しらべてから うごこう。",
      "en": "Pick up only when there is a star. Check with “if” before you act."
     },
     "mistake": {
      "ja": "「もし」を つかわずに まいかい「ひろう」と、ほしの ない マスで しっぱい。",
      "en": "Picking up every time without “if” fails on empty squares."
     }
    },
    {
     "n": 6,
     "tags": [
      "if",
      "until"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/space6.png",
      "en": "images/answers/en/space6.png"
     },
     "video": {
      "ja": "videos/ja/space-06.mp4",
      "en": "videos/en/space-06.mp4"
     },
     "title": {
      "ja": "ステージ6　ミッション クリアまで",
      "en": "Stage 6: Until mission complete"
     },
     "text": {
      "ja": "うずまきの うちゅうに ほしが ちらばっているよ。「ミッション クリアまで くりかえす」で、しらべながら すすもう。",
      "en": "Stars are scattered around a spiral. Use \"repeat until mission complete\" and check as you go."
     },
     "hint": {
      "ja": "くりかえしの なかで：もし ほしが あったら ひろう → もし まえが あいていたら すすむ、そうでなければ みぎを むく",
      "en": "Inside the loop: if there is a star, pick it up → if front is open, move forward, else turn right"
     },
     "goal": {
      "ja": "ミッション クリアまで くりかえそう",
      "en": "Repeat until the mission is complete"
     },
     "point": {
      "ja": "まいかい、まず あしもとを しらべてから すすむよ。",
      "en": "Each time, first check under your feet, then move."
     },
     "mistake": {
      "ja": "まがる ところで ほしを しらべ わすれると、とりのこしが でるよ。",
      "en": "Forgetting to check at the corners leaves stars behind."
     }
    },
    {
     "n": 7,
     "tags": [
      "algo",
      "if",
      "until"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/space7.png",
      "en": "images/answers/en/space7.png"
     },
     "video": {
      "ja": "videos/ja/space-07.mp4",
      "en": "videos/en/space-07.mp4"
     },
     "title": {
      "ja": "ステージ7　どんな うちゅうでも！",
      "en": "Stage 7: Any space!"
     },
     "text": {
      "ja": "さいごの ちょうせん！ ランダムな うちゅう 30こで テストするよ。ほしを ぜんぶ あつめて ロケットに のれたら クリア！",
      "en": "Final challenge! Your program is tested in 30 random spaces. Collect all the stars and board the rocket to clear!"
     },
     "hint": {
      "ja": "「みぎての ほうそく」で かべに そって すすみながら、ほしが あったら ひろおう。ロケットを とおりすぎても だいじょうぶ。ほしを ぜんぶ ひろうまで あるきつづけよう。",
      "en": "Use the \"right-hand rule\" to follow the walls, and pick up stars when you find them. It's OK to pass the rocket — keep walking until you have every star."
     },
     "goal": {
      "ja": "どんな うちゅうでも クリアしよう",
      "en": "Clear any space"
     },
     "point": {
      "ja": "みぎての ほうそく ＋ ほしを ひろう。ロケットを とおりすぎても だいじょうぶ！",
      "en": "Right-hand rule + pick up stars. It is OK to pass the rocket!"
     },
     "mistake": {
      "ja": "ロケットに ついたら とまる と おもいがち。ほしが のこっていたら あるきつづけるよ。",
      "en": "You may think it stops at the rocket — it keeps going until every star is collected."
     }
    }
   ]
  },
  {
   "key": "craft",
   "file": "craft.html",
   "icon": "🧱",
   "name": {
    "ja": "こわして つくる ぼうけん",
    "en": "Break & Build Quest"
   },
   "intro": {
    "ja": "いしを こわして もち、みずに おいて はしを かけます。「もっている かず」を かんがえながら てじゅんを くみたてます。",
    "en": "Break stone to hold blocks, and place them on water to make bridges. Plan while keeping track of how many blocks you have."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/craft1.png",
      "en": "images/answers/en/craft1.png"
     },
     "video": {
      "ja": "videos/ja/craft-01.mp4",
      "en": "videos/en/craft-01.mp4"
     },
     "title": {
      "ja": "ステージ1　こわして すすもう",
      "en": "Stage 1: Break and go"
     },
     "text": {
      "ja": "いしブロックが じゃまを しているよ。「⛏ まえの ブロックを こわす」で こわして、たからばこまで すすもう！",
      "en": "A stone block is in the way. Break it with \"⛏ break the block in front\", then go to the treasure chest!"
     },
     "hint": {
      "ja": "1マス すすむ → こわす → 3マス すすむ",
      "en": "Forward 1 → break → forward 3"
     },
     "goal": {
      "ja": "「こわす」を つかおう",
      "en": "Use “break”"
     },
     "point": {
      "ja": "まえの いしを こわすと、すすめる みちに なるよ。",
      "en": "Break the stone in front, and it becomes a path."
     },
     "mistake": {
      "ja": "こわさずに すすむと、いしに ぶつかるよ。",
      "en": "Moving without breaking bumps into the stone."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "count"
     ],
     "limit": null,
     "img": {
      "ja": "images/answers/craft2.png",
      "en": "images/answers/en/craft2.png"
     },
     "video": {
      "ja": "videos/ja/craft-02.mp4",
      "en": "videos/en/craft-02.mp4"
     },
     "title": {
      "ja": "ステージ2　はしを かけよう",
      "en": "Stage 2: Build a bridge"
     },
     "text": {
      "ja": "みずが あるよ。はしを つくるには ブロックが ひつよう。まず いしを こわすと、ブロックが 1こ もてるよ！",
      "en": "There is water ahead. You need a block to make a bridge. Break the stone first — then you will have a block!"
     },
     "hint": {
      "ja": "こわす → すすむ → おく → 3マス すすむ",
      "en": "Break → forward → place → forward 3"
     },
     "goal": {
      "ja": "こわす → もつ → おく",
      "en": "Break → hold → place"
     },
     "point": {
      "ja": "さいしょは ブロックを もっていない。さきに こわしてから おこう。",
      "en": "You start with no blocks. Break first, then place."
     },
     "mistake": {
      "ja": "さきに「おく」と、ブロックを もっていなくて しっぱい。",
      "en": "Placing first fails because you have no blocks yet."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/craft3.png",
      "en": "images/answers/en/craft3.png"
     },
     "video": {
      "ja": "videos/ja/craft-03.mp4",
      "en": "videos/en/craft-03.mp4"
     },
     "title": {
      "ja": "ステージ3　くりかえして こわそう",
      "en": "Stage 3: Break with a loop"
     },
     "text": {
      "ja": "いしブロックが ならんでいるよ。「こわす → すすむ」を くりかえしで まとめよう。",
      "en": "Stone blocks in a row! Put \"break → move\" into a loop."
     },
     "hint": {
      "ja": "「3かい くりかえす（こわす → すすむ）」→「すすむ」",
      "en": "\"repeat 3 (break → move forward)\" → \"move forward\""
     },
     "goal": {
      "ja": "くりかえしで こわそう",
      "en": "Break with a loop"
     },
     "point": {
      "ja": "「こわす → すすむ」を 3かい くりかえしたね。",
      "en": "You repeated “break → move” 3 times."
     },
     "mistake": {
      "ja": "「すすむ」を さきに すると いしに ぶつかる。「こわす」が さきだよ。",
      "en": "Moving first bumps into stone. Break first."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop",
      "count"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/craft4.png",
      "en": "images/answers/en/craft4.png"
     },
     "video": {
      "ja": "videos/ja/craft-04.mp4",
      "en": "videos/en/craft-04.mp4"
     },
     "title": {
      "ja": "ステージ4　ながい はし",
      "en": "Stage 4: A long bridge"
     },
     "text": {
      "ja": "ブロックを 3こ もっているよ。かわに ながい はしを つくろう。",
      "en": "You have 3 blocks. Make a long bridge over the river."
     },
     "hint": {
      "ja": "「3かい くりかえす（おく → すすむ）」→「すすむ」",
      "en": "\"repeat 3 (place → move forward)\" → \"move forward\""
     },
     "goal": {
      "ja": "もっている かずを つかいきろう",
      "en": "Use up the blocks you have"
     },
     "point": {
      "ja": "3こ もっていたから、3かい おくと ちょうど 0こ。",
      "en": "You had 3 blocks. After placing 3, you have exactly 0."
     },
     "mistake": {
      "ja": "おく まえに すすむと、みずに おちるよ。",
      "en": "Moving before placing drops you into the water."
     }
    },
    {
     "n": 5,
     "tags": [
      "if",
      "loop"
     ],
     "limit": 4,
     "img": {
      "ja": "images/answers/craft5.png",
      "en": "images/answers/en/craft5.png"
     },
     "video": {
      "ja": "videos/ja/craft-05.mp4",
      "en": "videos/en/craft-05.mp4"
     },
     "title": {
      "ja": "ステージ5　もし いしが あったら",
      "en": "Stage 5: If there is stone"
     },
     "text": {
      "ja": "いしが ある ところと ない ところが あるよ。ない ところで こわそうと すると しっぱい！「もし」で しらべよう。",
      "en": "Some squares have stone and some don't. Breaking where there is no stone is a mistake! Use \"if\" to check first."
     },
     "hint": {
      "ja": "「4かい くりかえす：もし まえが いしブロック だったら こわす → すすむ」",
      "en": "\"repeat 4: if the front is a stone block, break it → move forward\""
     },
     "goal": {
      "ja": "しらべてから こわそう（もし）",
      "en": "Check first, then break (if)"
     },
     "point": {
      "ja": "いしが ある ときだけ こわす。ない ところで こわすと しっぱい！",
      "en": "Break only when there is stone. Breaking where there is none is a mistake!"
     },
     "mistake": {
      "ja": "いしが ない ときにも こわそうと すると しっぱい。",
      "en": "Trying to break when there is no stone fails."
     }
    },
    {
     "n": 6,
     "tags": [
      "if",
      "count"
     ],
     "limit": 6,
     "img": {
      "ja": "images/answers/craft6.png",
      "en": "images/answers/en/craft6.png"
     },
     "video": {
      "ja": "videos/ja/craft-06.mp4",
      "en": "videos/en/craft-06.mp4"
     },
     "title": {
      "ja": "ステージ6　いしと みず",
      "en": "Stage 6: Stone and water"
     },
     "text": {
      "ja": "いしと みずが まざっているよ。いしは こわす、みずには おく。こわすと ブロックが ふえて、おくと へるよ。もっている かずに ちゅうい！",
      "en": "Stone and water are mixed. Break stone, bridge water. Breaking stone gives you a block, and placing one uses it up. Watch how many you have!"
     },
     "hint": {
      "ja": "4かい くりかえす：もし いしなら こわす ／ もし みずなら おく ／ すすむ",
      "en": "Repeat 4 times: if stone → break / if water → place / move forward"
     },
     "goal": {
      "ja": "いしと みず、2つの「もし」",
      "en": "Stone and water: two “if”s"
     },
     "point": {
      "ja": "こわすと ふえて、おくと へる。0 → 1 → 0 → 1 だね。",
      "en": "Breaking adds one, placing uses one: 0 → 1 → 0 → 1."
     },
     "mistake": {
      "ja": "「もし みず」の しらべを わすれると、みずに おちるよ。",
      "en": "Forgetting to check for water makes you fall in."
     }
    },
    {
     "n": 7,
     "tags": [
      "if",
      "until",
      "nest"
     ],
     "limit": 8,
     "img": {
      "ja": "images/answers/craft7.png",
      "en": "images/answers/en/craft7.png"
     },
     "video": {
      "ja": "videos/ja/craft-07.mp4",
      "en": "videos/en/craft-07.mp4"
     },
     "title": {
      "ja": "ステージ7　うずまきの どうくつ",
      "en": "Stage 7: Spiral cave"
     },
     "text": {
      "ja": "いしと みずの ある うずまきの どうくつ。「ゴールに つくまで くりかえす」で、まえを しらべながら すすもう。",
      "en": "A spiral cave full of stone and water. Use \"repeat until goal\" and decide what to do by checking the front."
     },
     "hint": {
      "ja": "くりかえしの なかで：もし いしなら こわす ／ もし みずなら おく ／ もし すすめる みちなら すすむ、そうでなければ みぎを むく",
      "en": "Inside the loop: if stone → break / if water → place / if the front is an open path → move, else turn right"
     },
     "goal": {
      "ja": "まえを しらべながら すすもう",
      "en": "Check the front as you go"
     },
     "point": {
      "ja": "いし なら こわす、みず なら おく、すすめたら すすむ、だめなら みぎ！",
      "en": "Stone? Break. Water? Place. Open? Move. Otherwise, turn right!"
     },
     "mistake": {
      "ja": "かたい いわ（くろ）は こわせない。すすめない ときは みぎを むこう。",
      "en": "Hard dark rock cannot be broken. If you cannot move, turn right."
     }
    }
   ]
  },
  {
   "key": "pydraw",
   "file": "python-draw.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで おえかき",
    "en": "Python Drawing"
   },
   "intro": {
    "ja": "おえかきを Python で。forward(80)・right(60) のように () の なかに かずを かき、for i in range(10, 201, 10): の へんすうや 360 / n の けいさんも つかって、お手本と おなじ かたちを かく。",
    "en": "Drawing with Python. Write numbers inside () like forward(80) and right(60), and use variables (for i in range(10, 201, 10):) and math (360 / n) to match the model."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "loop",
      "angle",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(6):\n    forward(80)\n    right(60)",
     "video": {
      "ja": "videos/ja/pydraw-01.mp4",
      "en": "videos/en/pydraw-01.mp4"
     },
     "title": {
      "ja": "① 六角形（ろっかくけい） ★",
      "en": "① Hexagon ★"
     },
     "text": {
      "ja": "forward(80) で 80ほ すすみ、right(60) で 60ど まわる。これを 6かい くりかえして 六角形を かこう。",
      "en": "forward(80) moves 80 steps and right(60) turns 60 degrees. Repeat them 6 times to draw a hexagon."
     },
     "hint": {
      "ja": "for i in range(6): の なかに forward(80) と right(60)。360 ÷ 6 = 60",
      "en": "Put forward(80) and right(60) inside for i in range(6):. 360 ÷ 6 = 60"
     },
     "goal": {
      "ja": "for で 正多角形を かこう",
      "en": "Draw a regular polygon with for"
     },
     "point": {
      "ja": "forward() と right() の () の なかに かずを かく。for の なかの 2ぎょうを 6かい くりかえすよ。",
      "en": "Write numbers inside forward() and right(). The 2 lines inside for repeat 6 times."
     },
     "mistake": {
      "ja": "right(60) の じさげを わすれると、まわるのが 1かいだけに なって まっすぐな せんに なるよ。",
      "en": "If right(60) is not indented, it turns only once and draws a straight line."
     }
    },
    {
     "n": 2,
     "tags": [
      "loop",
      "angle",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(5):\n    forward(150)\n    right(144)",
     "video": {
      "ja": "videos/ja/pydraw-02.mp4",
      "en": "videos/en/pydraw-02.mp4"
     },
     "title": {
      "ja": "② ほし ★★",
      "en": "② Star ★★"
     },
     "text": {
      "ja": "1つの せんが 150ほの ほしを かこう。forward(150) と right(144) を 5かい くりかえすよ。",
      "en": "Draw a star with lines of 150 steps: repeat forward(150) and right(144) 5 times."
     },
     "hint": {
      "ja": "カメは 2しゅう（720ど）まわるよ。720 ÷ 5 = 144",
      "en": "The turtle turns around twice (720 degrees). 720 ÷ 5 = 144"
     },
     "goal": {
      "ja": "2しゅう まわる かくどを かんがえよう",
      "en": "Think about turning around twice"
     },
     "point": {
      "ja": "5かいで 720ど（2しゅう）まわるから、1かいは 720 ÷ 5 = 144 ど。",
      "en": "5 turns make 720 degrees (twice around), so each turn is 720 ÷ 5 = 144."
     },
     "mistake": {
      "ja": "right(72)（360 ÷ 5）に すると、ほしでは なく 五角形に なるよ。",
      "en": "right(72) (360 ÷ 5) makes a pentagon, not a star."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "angle",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(36):\n    forward(10)\n    right(10)",
     "video": {
      "ja": "videos/ja/pydraw-03.mp4",
      "en": "videos/en/pydraw-03.mp4"
     },
     "title": {
      "ja": "③ まる ★★",
      "en": "③ Circle ★★"
     },
     "text": {
      "ja": "forward(10) と right(10) を くりかえして まるを かこう。",
      "en": "Draw a circle by repeating forward(10) and right(10)."
     },
     "hint": {
      "ja": "1しゅうは 360ど。360 ÷ 10 = 36 だから range(36)",
      "en": "One full turn is 360 degrees. 360 ÷ 10 = 36, so use range(36)."
     },
     "goal": {
      "ja": "みじかい 直線で まるを つくろう",
      "en": "Make a circle from short lines"
     },
     "point": {
      "ja": "10ど ずつ 36かい まわると 360ど。ちいさな せんを たくさん つなぐと まるに 見えるよ。",
      "en": "36 turns of 10 degrees make 360. Many short lines look like a circle."
     },
     "mistake": {
      "ja": "range(35) だと まるが すこし あいて しまう。360 ÷ 10 = 36 を たしかめよう。",
      "en": "range(35) leaves a small gap. Check 360 ÷ 10 = 36."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop",
      "nest",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    for k in range(4):\n        forward(60)\n        right(90)\n    right(90)",
     "video": {
      "ja": "videos/ja/pydraw-04.mp4",
      "en": "videos/en/pydraw-04.mp4"
     },
     "title": {
      "ja": "④ まど ★★★",
      "en": "④ Window ★★★"
     },
     "text": {
      "ja": "1つの へんが 60ほの しかくを 4つ くっつけて、まどを かこう。for の なかに for を いれるよ。",
      "en": "Draw 4 squares (sides of 60 steps) to make a window. Put a for loop inside a for loop."
     },
     "hint": {
      "ja": "そとの for で 4かい：なかの for k in range(4): で しかくを かいて、そのあと right(90)。",
      "en": "Outer loop 4 times: the inner for k in range(4): draws a square, then right(90)."
     },
     "goal": {
      "ja": "for の なかに for を いれよう",
      "en": "Put a for inside a for"
     },
     "point": {
      "ja": "なかの for は スペース 8つ じさげ。しかくを かいたら、そとの for の なかで right(90)。",
      "en": "The inner for is indented 8 spaces. After a square, right(90) inside the outer for."
     },
     "mistake": {
      "ja": "さいごの right(90) を なかの for と おなじ ふかさに すると、しかくが かさなって 1つに みえるよ。",
      "en": "If the last right(90) is at the inner for’s depth, the squares overlap and look like one."
     }
    },
    {
     "n": 5,
     "tags": [
      "loop",
      "nest",
      "angle",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(6):\n    for k in range(36):\n        forward(5)\n        right(10)\n    right(60)",
     "video": {
      "ja": "videos/ja/pydraw-05.mp4",
      "en": "videos/en/pydraw-05.mp4"
     },
     "title": {
      "ja": "⑤ はな ★★★",
      "en": "⑤ Flower ★★★"
     },
     "text": {
      "ja": "まる（forward(5) と right(10) を 36かい）を、60どずつ まわしながら 6こ かいて はなに しよう。",
      "en": "Draw 6 circles (forward(5) and right(10), 36 times), turning 60 degrees between them, to make a flower."
     },
     "hint": {
      "ja": "for i in range(6): → なかで for k in range(36): forward(5) と right(10) → right(60)",
      "en": "for i in range(6): → for k in range(36): forward(5), right(10) → right(60)"
     },
     "goal": {
      "ja": "いれこ ＋ くるっと まわす",
      "en": "Nesting + turning around"
     },
     "point": {
      "ja": "まる 1こが なかの for。そとの for で 360 ÷ 6 = 60 ど まわしながら 6かい。",
      "en": "One circle is the inner for. The outer for turns 360 ÷ 6 = 60 degrees, 6 times."
     },
     "mistake": {
      "ja": "まわす かくどが 60 で ないと、はなびらが かたよるよ。",
      "en": "If the turn is not 60, the petals are uneven."
     }
    },
    {
     "n": 6,
     "tags": [
      "var",
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(10, 201, 10):\n    forward(i)\n    right(90)",
     "video": {
      "ja": "videos/ja/pydraw-06.mp4",
      "en": "videos/en/pydraw-06.mp4"
     },
     "title": {
      "ja": "⑥ しかくい うずまき ★★★★",
      "en": "⑥ Square spiral ★★★★"
     },
     "text": {
      "ja": "for i in range(10, 201, 10): で i を 10, 20, 30 … 200 と ふやしながら、forward(i) と right(90) で うずまきを かこう。",
      "en": "Use for i in range(10, 201, 10): so i becomes 10, 20, 30 … 200, and draw a spiral with forward(i) and right(90)."
     },
     "hint": {
      "ja": "range(はじめ, おわり, ふやす かず)。おわりの かずは ふくまないので 201 に するよ。",
      "en": "range(start, end, step). The end number is not included, so use 201."
     },
     "goal": {
      "ja": "へんすう i を ながさに つかおう",
      "en": "Use the variable i as the length"
     },
     "point": {
      "ja": "range(10, 201, 10) は 10, 20, … 200。おわりの かずは ふくまない ので 201 に する。forward(i) で だんだん ながく。",
      "en": "range(10, 201, 10) gives 10, 20, … 200. The end is not included, so use 201. forward(i) gets longer each time."
     },
     "mistake": {
      "ja": "range(10, 200, 10) だと 190 で おわって しまうよ。",
      "en": "range(10, 200, 10) stops at 190."
     }
    },
    {
     "n": 7,
     "tags": [
      "var",
      "math",
      "nest",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for n in range(3, 9):\n    for i in range(n):\n        forward(50)\n        right(360 / n)",
     "video": {
      "ja": "videos/ja/pydraw-07.mp4",
      "en": "videos/en/pydraw-07.mp4"
     },
     "title": {
      "ja": "⑦ ならんだ たかくけい ★★★★",
      "en": "⑦ Polygons in a row ★★★★"
     },
     "text": {
      "ja": "for n in range(3, 9): で n を 3〜8 に かえながら、n かくけい（1つの へんは 50ほ）を おなじ ばしょから かこう。",
      "en": "Use for n in range(3, 9): to change n from 3 to 8, and draw an n-sided shape (sides of 50 steps) from the same spot."
     },
     "hint": {
      "ja": "なかで for i in range(n): forward(50) と right(360 / n)。/ は わりざん。",
      "en": "Inside, for i in range(n): forward(50) and right(360 / n). / means divide."
     },
     "goal": {
      "ja": "へんすう と わりざん",
      "en": "Variables and division"
     },
     "point": {
      "ja": "n かくけいの まわる かくどは 360 / n。range(3, 9) で n は 3〜8。",
      "en": "An n-sided shape turns 360 / n. range(3, 9) gives n = 3 to 8."
     },
     "mistake": {
      "ja": "360 // n（きりすて）は ブロックに できないよ。わりざんは / を つかおう。",
      "en": "360 // n (floor division) has no block. Use / for division."
     }
    },
    {
     "n": 8,
     "tags": [
      "seq",
      "decomp",
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(6):\n    forward(80)\n    back(30)\n    left(45)\n    forward(25)\n    back(25)\n    right(90)\n    forward(25)\n    back(25)\n    left(45)\n    back(50)\n    right(60)",
     "video": {
      "ja": "videos/ja/pydraw-08.mp4",
      "en": "videos/en/pydraw-08.mp4"
     },
     "title": {
      "ja": "⑧ ゆきの けっしょう ★★★★★",
      "en": "⑧ Snowflake ★★★★★"
     },
     "text": {
      "ja": "えだを 1本 かいて もとの ばしょに もどり、right(60)。これを 6かい くりかえして ゆきの けっしょうを かこう。",
      "en": "Draw one branch, come back, and right(60). Repeat this 6 times to draw a snowflake."
     },
     "hint": {
      "ja": "えだ：forward(80) → back(30) → left(45) → forward(25) → back(25) → right(90) → forward(25) → back(25) → left(45) → back(50)",
      "en": "Branch: forward(80) → back(30) → left(45) → forward(25) → back(25) → right(90) → forward(25) → back(25) → left(45) → back(50)"
     },
     "goal": {
      "ja": "てじゅんを わけて かんがえよう",
      "en": "Break the steps into parts"
     },
     "point": {
      "ja": "えだ 1本は 10ぎょう。もとの ばしょと むきに もどるので、right(60) で つぎの えだへ。",
      "en": "One branch is 10 lines. It returns to the start, so right(60) moves to the next branch."
     },
     "mistake": {
      "ja": "さいごの back(50) を わすれると、えだが ずれて いくよ。",
      "en": "Forgetting the last back(50) shifts each branch."
     }
    },
    {
     "n": 9,
     "tags": [
      "var",
      "math",
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(1, 51):\n    pen_color('random')\n    forward(i * 4)\n    right(144)",
     "video": {
      "ja": "videos/ja/pydraw-09.mp4",
      "en": "videos/en/pydraw-09.mp4"
     },
     "title": {
      "ja": "⑨ ほしの うずまき ★★★★★",
      "en": "⑨ Star spiral ★★★★★"
     },
     "text": {
      "ja": "for i in range(1, 51): で i を 1〜50 に して、forward(i * 4) と right(144)。pen_color('random') で いろを かえよう。",
      "en": "Use for i in range(1, 51): (i from 1 to 50), then forward(i * 4) and right(144). Change colors with pen_color('random')."
     },
     "hint": {
      "ja": "* は かけざん。すすむ ながさが 4ほずつ のびるよ。",
      "en": "* means multiply. The line gets 4 steps longer each time."
     },
     "goal": {
      "ja": "へんすう × けいさん ＋ かいてん",
      "en": "Variable × math + turning"
     },
     "point": {
      "ja": "すすむ ながさ i * 4 が 4ほ ずつ のびて、144ど まわると ほしの うずまきに なる。",
      "en": "The length i * 4 grows by 4 each time, and turning 144 makes a star spiral."
     },
     "mistake": {
      "ja": "range(1, 50) だと 49かいで おわる。50かい かくには range(1, 51)。",
      "en": "range(1, 50) stops after 49. Use range(1, 51) for 50 times."
     }
    }
   ]
  },
  {
   "key": "python",
   "file": "python.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで めいろ",
    "en": "Python Maze"
   },
   "intro": {
    "ja": "めいろを Python で とく。ブロックで くむと おなじ うごきの Python が したに でて、「🐍 Python」タブで じぶんで かきかえられる。forward() から、for・while・if・elif まで すすむ。",
    "en": "Solve the maze with Python. Blocks you build appear below as Python, and you can edit it in the “🐍 Python” tab. Go from forward() to for, while, if and elif."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pymaze-01.mp4",
      "en": "videos/en/pymaze-01.mp4"
     },
     "title": {
      "ja": "ステージ1　まっすぐ すすもう",
      "en": "Stage 1: Go straight"
     },
     "text": {
      "ja": "forward() と かくと、たんけんかが 1マス すすむよ。ダイヤ 💎 まで すすもう。",
      "en": "Type forward() to move the explorer to the diamond 💎. One line moves one square."
     },
     "hint": {
      "ja": "forward() を 4ぎょう かこう。",
      "en": "Write forward() 4 times, one per line."
     },
     "goal": {
      "ja": "Python の めいれいを 1ぎょうずつ かこう",
      "en": "Write Python commands one line at a time"
     },
     "point": {
      "ja": "Python は うえの ぎょうから じゅんばんに うごく。ブロックの「まえに すすむ」＝ forward()",
      "en": "Python runs from the top line down. The “move forward” block = forward()"
     },
     "mistake": {
      "ja": "「()」を わすれて forward だけに すると エラーに なるよ。",
      "en": "Writing forward without “()” causes an error."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\nturn_right()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pymaze-02.mp4",
      "en": "videos/en/pymaze-02.mp4"
     },
     "title": {
      "ja": "ステージ2　まがってみよう",
      "en": "Stage 2: Let's turn"
     },
     "text": {
      "ja": "turn_right() で みぎを、turn_left() で ひだりを むくよ。むいても マスは うごかないよ。",
      "en": "turn_right() turns right, turn_left() turns left. Turning does not move you."
     },
     "hint": {
      "ja": "forward() を 2かい → turn_right() → forward() を 2かい",
      "en": "forward() ×2 → turn_right() → forward() ×2"
     },
     "goal": {
      "ja": "むきを かえる めいれいを つかおう",
      "en": "Use commands that change direction"
     },
     "point": {
      "ja": "むきを かえても マスは うごかない。「_」（アンダーバー）も わすれずに。",
      "en": "Turning does not move you. Don’t forget the “_” (underscore)."
     },
     "mistake": {
      "ja": "turn right（スペース）や Turn_right（おおもじ）は ちがう なまえに なるよ。",
      "en": "“turn right” (space) or “Turn_right” (capital) are different names."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    forward()\nturn_right()\nfor i in range(4):\n    forward()",
     "video": {
      "ja": "videos/ja/pymaze-03.mp4",
      "en": "videos/en/pymaze-03.mp4"
     },
     "title": {
      "ja": "ステージ3　for で くりかえそう",
      "en": "Stage 3: Repeat with for"
     },
     "text": {
      "ja": "「for i in range(4):」と かくと、したの ぎょうを 4かい くりかえすよ。くりかえす ぎょうは スペース 4つ じさげ しよう。",
      "en": "“for i in range(4):” repeats the lines under it 4 times. Indent those lines with 4 spaces!"
     },
     "hint": {
      "ja": "for i in range(4): → （じさげ）forward() → turn_right() → もう いちど おなじ くりかえし",
      "en": "for i in range(4): → forward() (indented) → turn_right() → the same loop again"
     },
     "goal": {
      "ja": "for と じさげで くりかえしを かこう",
      "en": "Write a loop with for and indentation"
     },
     "point": {
      "ja": "「:」の つぎの ぎょうを じさげ すると、その ぎょうが くりかえしの なかみ に なる。じさげを もどすと くりかえしの そと。",
      "en": "Lines indented after “:” are inside the loop. Un-indent to leave the loop."
     },
     "mistake": {
      "ja": "さいごの「:」を わすれる。turn_right() まで じさげ すると、まがる のも 4かい くりかえして しまう。",
      "en": "Forgetting the final “:”. Indenting turn_right() too makes it turn 4 times."
     }
    },
    {
     "n": 4,
     "tags": [
      "if",
      "until",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if is_open('front'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pymaze-04.mp4",
      "en": "videos/en/pymaze-04.mp4"
     },
     "title": {
      "ja": "ステージ4　while と if",
      "en": "Stage 4: while and if"
     },
     "text": {
      "ja": "「while not at_goal():」で ゴールまで くりかえし、「if is_open('front'):」で まえが あいているか しらべよう。だめなら else の なかが うごくよ。",
      "en": "Repeat with “while not at_goal():” and decide with “if is_open('front'):”. else runs when the front is blocked."
     },
     "hint": {
      "ja": "while not at_goal(): → if is_open('front'): forward() → else: turn_right()",
      "en": "while not at_goal(): → if is_open('front'): forward() → else: turn_right()"
     },
     "goal": {
      "ja": "while と if / else を くみあわせよう",
      "en": "Combine while with if / else"
     },
     "point": {
      "ja": "not は「〜でない」。while not at_goal() ＝「ゴールに ついていない あいだ くりかえす」。",
      "en": "not means “is not”. while not at_goal() = “repeat while you are not at the goal”."
     },
     "mistake": {
      "ja": "if と else の じさげが ずれると エラーに なるよ。else: は if と おなじ ふかさに かこう。",
      "en": "Misaligned if/else causes an error. Write else: at the same depth as if."
     }
    },
    {
     "n": 5,
     "tags": [
      "if",
      "until",
      "nest",
      "algo",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if is_open('front'):\n        forward()\n    elif is_open('right'):\n        turn_right()\n    else:\n        turn_left()",
     "video": {
      "ja": "videos/ja/pymaze-05.mp4",
      "en": "videos/en/pymaze-05.mp4"
     },
     "title": {
      "ja": "ステージ5　elif で 3つに わけよう",
      "en": "Stage 5: Three choices with elif"
     },
     "text": {
      "ja": "Python には elif（そうでなくて もし）が あるよ。まえ → みぎ の じゅんに しらべて、どちらも だめなら ひだりを むこう。",
      "en": "Python has elif (“else if”). Check the front, then the right, and otherwise turn left."
     },
     "hint": {
      "ja": "if is_open('front'): … elif is_open('right'): … else: …",
      "en": "if is_open('front'): … elif is_open('right'): … else: …"
     },
     "goal": {
      "ja": "elif で 3つの ばあいに わけよう",
      "en": "Split into three cases with elif"
     },
     "point": {
      "ja": "elif は「そうでなくて もし」。ブロックで「そうでなければ」の なかに「もし」を いれると、Python では elif に なるよ。",
      "en": "elif means “else if”. Putting an “if” block inside “else” becomes elif in Python."
     },
     "mistake": {
      "ja": "elif を else if と かくと Python では エラー。じゅんばんを かえると ちがう みちに すすむよ。",
      "en": "Writing “else if” is an error in Python. Changing the order takes a different path."
     }
    }
   ]
  },
  {
   "key": "pyspace",
   "file": "python-space.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで うちゅう",
    "en": "Python Space"
   },
   "intro": {
    "ja": "ほしあつめを Python で。pick_up()・has_star()・mission_done() を つかって、ほしを ぜんぶ ひろって ロケットへ。",
    "en": "Star hunting with Python. Use pick_up(), has_star() and mission_done() to collect every star and reach the rocket."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\npick_up()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pyspace-01.mp4",
      "en": "videos/en/pyspace-01.mp4"
     },
     "title": {
      "ja": "ステージ1　ほしを ひろおう",
      "en": "Stage 1: Pick up a star"
     },
     "text": {
      "ja": "ほし ⭐ の マスで pick_up() を つかって ひろってから、ロケット 🚀 まで すすもう。",
      "en": "Pick up the star ⭐ with pick_up(), then go to the rocket 🚀. pick_up() works only on a star square."
     },
     "hint": {
      "ja": "forward() を 2かい → pick_up() → forward() を 2かい",
      "en": "forward() ×2 → pick_up() → forward() ×2"
     },
     "goal": {
      "ja": "pick_up() を つかおう",
      "en": "Use pick_up()"
     },
     "point": {
      "ja": "pick_up() は いま いる マスの ほしを ひろう めいれい。ほしを ぜんぶ ひろってから ロケットへ！",
      "en": "pick_up() picks up the star on your square. Collect them all, then go to the rocket!"
     },
     "mistake": {
      "ja": "pickup() や pick up() と かくと NameError。「_」を わすれずに。",
      "en": "Writing pickup() or pick up() causes a NameError. Don’t forget the “_”."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\npick_up()\nforward()\nturn_right()\nforward()\npick_up()\nforward()",
     "video": {
      "ja": "videos/ja/pyspace-02.mp4",
      "en": "videos/en/pyspace-02.mp4"
     },
     "title": {
      "ja": "ステージ2　まがって あつめよう",
      "en": "Stage 2: Turn and collect"
     },
     "text": {
      "ja": "ほしが 2こ あるよ。みちが まがる ところで turn_right() を つかおう。",
      "en": "There are 2 stars. Use turn_right() where the path turns."
     },
     "hint": {
      "ja": "forward() ×2 と pick_up() → forward() → turn_right() → forward() と pick_up() → forward()",
      "en": "forward() ×2, pick_up() → forward() → turn_right() → forward(), pick_up() → forward()"
     },
     "goal": {
      "ja": "まがって じゅんばんに あつめよう",
      "en": "Turn and collect in order"
     },
     "point": {
      "ja": "turn_right() は その ばで むきを かえるだけ。まがる ばしょと ひろう ばしょの じゅんばんが だいじ。",
      "en": "turn_right() only changes direction. The order of turning and picking up matters."
     },
     "mistake": {
      "ja": "ほしの ない マスで pick_up() すると しっぱい。どの マスで ひろうか たしかめよう。",
      "en": "pick_up() on an empty square fails. Check which square has the star."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(3):\n    forward()\n    pick_up()\nforward()",
     "video": {
      "ja": "videos/ja/pyspace-03.mp4",
      "en": "videos/en/pyspace-03.mp4"
     },
     "title": {
      "ja": "ステージ3　for で あつめよう",
      "en": "Stage 3: Collect with for"
     },
     "text": {
      "ja": "ほしが ならんでいるよ。「forward() → pick_up()」を for で くりかえそう。くりかえす ぎょうは スペース 4つ じさげ。",
      "en": "The stars are in a row. Repeat “forward() → pick_up()” with for. Indent the lines inside the loop by 4 spaces."
     },
     "hint": {
      "ja": "for i in range(3): → （じさげ）forward() と pick_up() → さいごに forward()",
      "en": "for i in range(3): → (indented) forward() and pick_up() → forward()"
     },
     "goal": {
      "ja": "for で くりかえそう",
      "en": "Repeat with for"
     },
     "point": {
      "ja": "for の なかに 2ぎょう いれるには、どちらも スペース 4つ じさげ する。さいごの forward() は じさげ しない。",
      "en": "To put 2 lines inside for, indent both by 4 spaces. The last forward() is not indented."
     },
     "mistake": {
      "ja": "pick_up() の じさげを わすれると、ひろうのが 1かいだけに なるよ。",
      "en": "If you forget to indent pick_up(), it runs only once."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop",
      "pattern",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    forward()\n    turn_right()\n    forward()\n    pick_up()\n    turn_left()",
     "video": {
      "ja": "videos/ja/pyspace-04.mp4",
      "en": "videos/en/pyspace-04.mp4"
     },
     "title": {
      "ja": "ステージ4　ほしの かいだん",
      "en": "Stage 4: Star stairs"
     },
     "text": {
      "ja": "かいだんで くりかえす うごきの セットを みつけて、ぜんぶ for の なかに いれよう。",
      "en": "Find the set of moves that repeats on the stairs and put all of it inside the for loop."
     },
     "hint": {
      "ja": "for i in range(4): の なかに forward() → turn_right() → forward() → pick_up() → turn_left()",
      "en": "for i in range(4): forward(), turn_right(), forward(), pick_up(), turn_left()"
     },
     "goal": {
      "ja": "くりかえす セットを みつけよう",
      "en": "Find the set that repeats"
     },
     "point": {
      "ja": "5ぎょうの セットを まるごと for の なかへ。4かいめの とちゅうで ロケットに つくと そこで おわるよ。",
      "en": "Put the whole 5-line set inside for. You reach the rocket during the 4th repeat, and it ends there."
     },
     "mistake": {
      "ja": "turn_left() を わすれると、むきが どんどん かわって いんせきに ぶつかるよ。",
      "en": "Forgetting turn_left() keeps changing your direction and you hit an asteroid."
     }
    },
    {
     "n": 5,
     "tags": [
      "if",
      "loop",
      "nest",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    forward()\n    if has_star():\n        pick_up()",
     "video": {
      "ja": "videos/ja/pyspace-05.mp4",
      "en": "videos/en/pyspace-05.mp4"
     },
     "title": {
      "ja": "ステージ5　if has_star():",
      "en": "Stage 5: if has_star():"
     },
     "text": {
      "ja": "ほしが ある マスと ない マスが あるよ。has_star() で いまの マスを しらべて、if で ほしが ある ときだけ ひろおう。",
      "en": "Some squares have stars and some don’t. has_star() checks the square you are on. Use if so you only pick up where there is a star."
     },
     "hint": {
      "ja": "for i in range(4): の なかで forward() → if has_star(): → （もっと じさげ）pick_up()",
      "en": "for i in range(4): forward() → if has_star(): → (indent more) pick_up()"
     },
     "goal": {
      "ja": "if で しらべてから うごこう",
      "en": "Check with if before you act"
     },
     "point": {
      "ja": "if の なかの ぎょうは、for より もう 1だん（ぜんぶで スペース 8つ）じさげ する。",
      "en": "Lines inside if are indented one more level (8 spaces in total)."
     },
     "mistake": {
      "ja": "if has_star() の さいごの「:」を わすれると SyntaxError。",
      "en": "Forgetting the “:” after if has_star() causes a SyntaxError."
     }
    },
    {
     "n": 6,
     "tags": [
      "if",
      "until",
      "nest",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not mission_done():\n    if has_star():\n        pick_up()\n    if is_open('front'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pyspace-06.mp4",
      "en": "videos/en/pyspace-06.mp4"
     },
     "title": {
      "ja": "ステージ6　while not mission_done():",
      "en": "Stage 6: while not mission_done():"
     },
     "text": {
      "ja": "うずまきの うちゅうに ほしが ちらばっているよ。「while not mission_done():」で くりかえして、しらべながら すすもう。",
      "en": "Stars are scattered around a spiral. Repeat with “while not mission_done():” and check as you go."
     },
     "hint": {
      "ja": "while の なかで：if has_star(): pick_up() → if is_open('front'): forward() → else: turn_right()",
      "en": "Inside while: if has_star(): pick_up() → if is_open('front'): forward() else: turn_right()"
     },
     "goal": {
      "ja": "while not mission_done(): で くりかえそう",
      "en": "Repeat with while not mission_done():"
     },
     "point": {
      "ja": "mission_done() は「ほしを ぜんぶ ひろって ロケットに ついた」ときに True に なる。not で「まだの あいだ」くりかえす。",
      "en": "mission_done() becomes True when you have every star and are at the rocket. not repeats “while it is not done yet”."
     },
     "mistake": {
      "ja": "2つの if を elif で つなぐと、ほしを ひろった ときに すすまなく なるよ（それでも クリアは できる）。",
      "en": "If you join the two ifs with elif, you will not move on the turn you pick up a star (it can still clear)."
     }
    }
   ]
  },
  {
   "key": "pycraft",
   "file": "python-craft.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで こわす・おく",
    "en": "Python Break & Build"
   },
   "intro": {
    "ja": "こわす・おく を Python で。mine()・place()・front_is('stone') を つかって、いしを こわし、みずに はしを かける。elif で 3つ いじょうに わける。",
    "en": "Break & Build with Python. Use mine(), place() and front_is('stone') to break stone and bridge water. Split into 3 or more cases with elif."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nmine()\nforward()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pycraft-01.mp4",
      "en": "videos/en/pycraft-01.mp4"
     },
     "title": {
      "ja": "ステージ1　こわして すすもう",
      "en": "Stage 1: Break and go"
     },
     "text": {
      "ja": "いしブロックが じゃまを しているよ。mine() で まえの ブロックを こわして、たからばこまで すすもう！",
      "en": "A stone block is in the way. mine() breaks the block in front of you. Break it and go to the treasure chest!"
     },
     "hint": {
      "ja": "forward() → mine() → forward() を 3かい",
      "en": "forward() → mine() → forward() ×3"
     },
     "goal": {
      "ja": "mine() を つかおう",
      "en": "Use mine()"
     },
     "point": {
      "ja": "mine() で まえの いしを こわすと、すすめる みちに なるよ。",
      "en": "mine() breaks the stone in front, and it becomes a path."
     },
     "mistake": {
      "ja": "いしの ない ところで mine() すると しっぱい。forward() を 1かい してから こわそう。",
      "en": "mine() where there is no stone fails. Move forward once before breaking."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "mine()\nforward()\nplace()\nforward()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pycraft-02.mp4",
      "en": "videos/en/pycraft-02.mp4"
     },
     "title": {
      "ja": "ステージ2　はしを かけよう",
      "en": "Stage 2: Build a bridge"
     },
     "text": {
      "ja": "place() で まえに ブロックを おくよ。みずに おくと はしに なる。まず いしを こわして ブロックを てに いれよう！",
      "en": "place() puts a block in front of you. On water it becomes a bridge. Break the stone first to get a block!"
     },
     "hint": {
      "ja": "mine() → forward() → place() → forward() を 3かい",
      "en": "mine() → forward() → place() → forward() ×3"
     },
     "goal": {
      "ja": "mine() → place() の じゅんばん",
      "en": "The order: mine() → place()"
     },
     "point": {
      "ja": "さいしょは ブロックを もっていない。mine() で 1こ もってから place() で はしを かける。",
      "en": "You start with no blocks. mine() to get one, then place() to build a bridge."
     },
     "mistake": {
      "ja": "さきに forward() すると いしに ぶつかる。place() の まえに みずの てまえまで すすもう。",
      "en": "forward() first bumps into the stone. Move to just before the water before place()."
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(3):\n    mine()\n    forward()\nforward()",
     "video": {
      "ja": "videos/ja/pycraft-03.mp4",
      "en": "videos/en/pycraft-03.mp4"
     },
     "title": {
      "ja": "ステージ3　for で こわそう",
      "en": "Stage 3: Break with for"
     },
     "text": {
      "ja": "いしブロックが ならんでいるよ。「mine() → forward()」を for で くりかえそう。",
      "en": "Stone blocks in a row! Repeat “mine() → forward()” with for."
     },
     "hint": {
      "ja": "for i in range(3): の なかに mine() と forward() → さいごに forward()",
      "en": "for i in range(3): mine(), forward() → forward()"
     },
     "goal": {
      "ja": "for で こわそう",
      "en": "Break with for"
     },
     "point": {
      "ja": "「mine() → forward()」を 3かい。さいごの forward() は for の そと（じさげ しない）。",
      "en": "“mine() → forward()” 3 times. The last forward() is outside the for (not indented)."
     },
     "mistake": {
      "ja": "forward() を じさげ しないと、こわすのが 3かい つづいて しっぱい するよ。",
      "en": "If forward() is not indented, mine() runs 3 times in a row and fails."
     }
    },
    {
     "n": 4,
     "tags": [
      "loop",
      "count",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(3):\n    place()\n    forward()\nforward()",
     "video": {
      "ja": "videos/ja/pycraft-04.mp4",
      "en": "videos/en/pycraft-04.mp4"
     },
     "title": {
      "ja": "ステージ4　ながい はし",
      "en": "Stage 4: A long bridge"
     },
     "text": {
      "ja": "ブロックを 3こ もっているよ。「place() → forward()」を くりかえして ながい はしを つくろう。",
      "en": "You have 3 blocks. Repeat “place() → forward()” to make a long bridge."
     },
     "hint": {
      "ja": "for i in range(3): の なかに place() と forward() → さいごに forward()",
      "en": "for i in range(3): place(), forward() → forward()"
     },
     "goal": {
      "ja": "もっている かずを つかいきろう",
      "en": "Use up the blocks you have"
     },
     "point": {
      "ja": "3こ もっているから、3かい place() すると ちょうど 0こ。",
      "en": "You have 3 blocks, so after 3 place() calls you have exactly 0."
     },
     "mistake": {
      "ja": "range(4) に すると、4かいめの place() で ブロックが たりなくなるよ。",
      "en": "With range(4), the 4th place() runs out of blocks."
     }
    },
    {
     "n": 5,
     "tags": [
      "if",
      "loop",
      "nest",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    if front_is('stone'):\n        mine()\n    forward()",
     "video": {
      "ja": "videos/ja/pycraft-05.mp4",
      "en": "videos/en/pycraft-05.mp4"
     },
     "title": {
      "ja": "ステージ5　if front_is('stone'):",
      "en": "Stage 5: if front_is('stone'):"
     },
     "text": {
      "ja": "front_is('stone') で まえが いしブロックか しらべられるよ。if で いしの ときだけ こわそう。",
      "en": "front_is('stone') checks if the front is a stone block. Use if so you only break where there is stone."
     },
     "hint": {
      "ja": "for i in range(4): の なかで if front_is('stone'): → （じさげ）mine() → forward()",
      "en": "for i in range(4): if front_is('stone'): mine() → forward()"
     },
     "goal": {
      "ja": "if front_is('stone'): で しらべよう",
      "en": "Check with if front_is('stone'):"
     },
     "point": {
      "ja": "front_is('stone') は まえが いしなら True。if の なかは もう 1だん じさげ。",
      "en": "front_is('stone') is True if the front is stone. Indent one more level inside if."
     },
     "mistake": {
      "ja": "'stone' を \"stone\" と かいても OK。でも 'rock' など ちがう ことばは ValueError。",
      "en": "\"stone\" with double quotes is OK, but other words like 'rock' cause a ValueError."
     }
    },
    {
     "n": 6,
     "tags": [
      "if",
      "loop",
      "nest",
      "count",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    if front_is('stone'):\n        mine()\n    elif front_is('water'):\n        place()\n    forward()",
     "video": {
      "ja": "videos/ja/pycraft-06.mp4",
      "en": "videos/en/pycraft-06.mp4"
     },
     "title": {
      "ja": "ステージ6　elif で いしと みず",
      "en": "Stage 6: Stone and water with elif"
     },
     "text": {
      "ja": "いしと みずが まざっているよ。いしなら mine()、そうでなくて みずなら（elif）place()。こわすと ブロックが ふえて、おくと へるよ。",
      "en": "Stone and water are mixed. If it is stone, mine(); elif it is water, place(). Breaking gives you a block, and placing uses one."
     },
     "hint": {
      "ja": "for i in range(4): の なかで if front_is('stone'): mine() → elif front_is('water'): place() → forward()",
      "en": "for i in range(4): if front_is('stone'): mine() / elif front_is('water'): place() / forward()"
     },
     "goal": {
      "ja": "elif で 2つの ばあいに わけよう",
      "en": "Split into two cases with elif"
     },
     "point": {
      "ja": "いし → mine()、そうでなくて みず → place()。こわすと 1こ ふえて、おくと 1こ へる（0 → 1 → 0 → 1）。",
      "en": "Stone → mine(), else if water → place(). Breaking adds one and placing uses one (0 → 1 → 0 → 1)."
     },
     "mistake": {
      "ja": "elif を else if と かくと SyntaxError。elif は if と おなじ ふかさに かこう。",
      "en": "Writing “else if” causes a SyntaxError. Write elif at the same depth as if."
     }
    },
    {
     "n": 7,
     "tags": [
      "if",
      "until",
      "nest",
      "algo",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if front_is('stone'):\n        mine()\n    elif front_is('water'):\n        place()\n    elif front_is('path'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pycraft-07.mp4",
      "en": "videos/en/pycraft-07.mp4"
     },
     "title": {
      "ja": "ステージ7　うずまきの どうくつ",
      "en": "Stage 7: Spiral cave"
     },
     "text": {
      "ja": "「while not at_goal():」で くりかえして、まえを しらべて きめよう：いし → mine()、みず → place()、みち → forward()、どれでもなければ turn_right()。",
      "en": "Use “while not at_goal():” and decide by checking the front: stone → mine(), water → place(), path → forward(), otherwise turn_right()."
     },
     "hint": {
      "ja": "while not at_goal(): の なかで if front_is('stone') … elif front_is('water') … elif front_is('path') … else: turn_right()",
      "en": "while not at_goal(): if front_is('stone') … elif front_is('water') … elif front_is('path') … else: turn_right()"
     },
     "goal": {
      "ja": "まえを しらべながら すすもう",
      "en": "Check the front as you go"
     },
     "point": {
      "ja": "if・elif・elif・else で 4つの ばあいに わける。くりかえす たびに まえを しらべなおすよ。",
      "en": "if, elif, elif and else split it into 4 cases. You check the front again on every loop."
     },
     "mistake": {
      "ja": "かたい いわ（くろ）は front_is では 'stone' に ならない。すすめない ときは else で turn_right()。",
      "en": "Hard dark rock is not 'stone' for front_is. When you cannot move, else turns right."
     }
    }
   ]
  },
  {
   "key": "pymazejr",
   "file": "python-maze-junior.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで やじるし めいろ",
    "en": "Python Arrow Maze"
   },
   "intro": {
    "ja": "やじるしの めいろを Python で。up()・down()・left()・right() の 4つの めいれいと for を つかいます。",
    "en": "The Arrow Maze in Python. Use the four commands up(), down(), left(), right() and for."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "right()\nright()\nright()",
     "video": {
      "ja": "videos/ja/pymazejr-01.mp4",
      "en": "videos/en/pymazejr-01.mp4"
     },
     "title": {
      "ja": "ステージ1　right() で すすもう",
      "en": "Stage 1: Go with right()"
     },
     "text": {
      "ja": "right() と かくと みぎへ 1マス すすむよ。3ぎょう かいて ダイヤ 💎 まで いこう。",
      "en": "right() moves one square to the right. Write it 3 times, one per line, to reach the diamond 💎."
     },
     "hint": {
      "ja": "right() を 3ぎょう。",
      "en": "right() on 3 lines."
     },
     "goal": {
      "ja": "right() を かこう",
      "en": "Write right()"
     },
     "point": {
      "ja": "Python は 1ぎょうに 1つの めいれい。right() を 3ぎょう かくと 3マス すすむ。",
      "en": "Python has one command per line. Three lines of right() move 3 squares."
     },
     "mistake": {
      "ja": "「()」を わすれて right だけに すると SyntaxError。",
      "en": "Writing just right without “()” causes a SyntaxError."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "dir",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "right()\ndown()\ndown()\ndown()\nright()\nright()",
     "video": {
      "ja": "videos/ja/pymazejr-02.mp4",
      "en": "videos/en/pymazejr-02.mp4"
     },
     "title": {
      "ja": "ステージ2　down() で したへ",
      "en": "Stage 2: Go down with down()"
     },
     "text": {
      "ja": "down() で したへ 1マス すすむよ。",
      "en": "down() moves one square down."
     },
     "hint": {
      "ja": "right() → down() を 3つ → right() を 2つ",
      "en": "right() → down() ×3 → right() ×2"
     },
     "goal": {
      "ja": "down() も つかおう",
      "en": "Use down() too"
     },
     "point": {
      "ja": "right() と down() を いく じゅんばんに かくよ。",
      "en": "Write right() and down() in the order you go."
     },
     "mistake": {
      "ja": "Down() のように おおもじに すると NameError。Python は おおもじと こもじを くべつするよ。",
      "en": "Down() with a capital letter causes a NameError. Python cares about capital letters."
     }
    },
    {
     "n": 3,
     "tags": [
      "seq",
      "pattern",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "right()\ndown()\nright()\ndown()\nright()\ndown()",
     "video": {
      "ja": "videos/ja/pymazejr-03.mp4",
      "en": "videos/en/pymazejr-03.mp4"
     },
     "title": {
      "ja": "ステージ3　かいだん",
      "en": "Stage 3: Stairs"
     },
     "text": {
      "ja": "right() と down() を じゅんばんに かこう。",
      "en": "right() and down(), one after the other."
     },
     "hint": {
      "ja": "right() → down() → right() → down() → right() → down()",
      "en": "right() down() right() down() right() down()"
     },
     "goal": {
      "ja": "こうごに かこう",
      "en": "Write them alternately"
     },
     "point": {
      "ja": "right() と down() を 3かいずつ、こうごに。",
      "en": "right() and down(), 3 times each, one after the other."
     },
     "mistake": {
      "ja": "じゅんばんが いれかわると くさむらに ぶつかるよ。",
      "en": "If the order is swapped, you bump into the bushes."
     }
    },
    {
     "n": 4,
     "tags": [
      "seq",
      "dir",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "up()\nup()\nup()\nright()\nright()\nright()",
     "video": {
      "ja": "videos/ja/pymazejr-04.mp4",
      "en": "videos/en/pymazejr-04.mp4"
     },
     "title": {
      "ja": "ステージ4　up() で うえへ",
      "en": "Stage 4: Go up with up()"
     },
     "text": {
      "ja": "up() で うえへ 1マス すすむよ。",
      "en": "up() moves one square up."
     },
     "hint": {
      "ja": "up() を 3つ → right() を 3つ",
      "en": "up() ×3 → right() ×3"
     },
     "goal": {
      "ja": "up() で うえへ",
      "en": "Go up with up()"
     },
     "point": {
      "ja": "up() を 3ぎょう、それから right() を 3ぎょう。",
      "en": "Three lines of up(), then three lines of right()."
     },
     "mistake": {
      "ja": "ぎょうの はじめに スペースを いれると IndentationError。for の なか いがいは じさげ しないよ。",
      "en": "A space at the start of a line causes an IndentationError. Only lines inside for are indented."
     }
    },
    {
     "n": 5,
     "tags": [
      "seq",
      "dir",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "right()\nright()\ndown()\ndown()\nleft()\nleft()",
     "video": {
      "ja": "videos/ja/pymazejr-05.mp4",
      "en": "videos/en/pymazejr-05.mp4"
     },
     "title": {
      "ja": "ステージ5　left() も つかおう",
      "en": "Stage 5: Use left() too"
     },
     "text": {
      "ja": "left() で ひだりへ 1マス。4つ ぜんぶ つかおう。",
      "en": "left() moves one square to the left. Use all four."
     },
     "hint": {
      "ja": "right() を 2つ → down() を 2つ → left() を 2つ",
      "en": "right() ×2 → down() ×2 → left() ×2"
     },
     "goal": {
      "ja": "left() も つかおう",
      "en": "Use left() too"
     },
     "point": {
      "ja": "right() → down() → left()。4つの めいれいを ぜんぶ つかえたね。",
      "en": "right() → down() → left(). Now you have used all four commands."
     },
     "mistake": {
      "ja": "left と right を まちがえやすい。がめんの ひだり・みぎで かんがえよう。",
      "en": "left and right are easy to mix up. Think of the left and right of the screen."
     }
    },
    {
     "n": 6,
     "tags": [
      "loop",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(4):\n    right()\n    down()",
     "video": {
      "ja": "videos/ja/pymazejr-06.mp4",
      "en": "videos/en/pymazejr-06.mp4"
     },
     "title": {
      "ja": "ステージ6　for で くりかえそう",
      "en": "Stage 6: Repeat with for"
     },
     "text": {
      "ja": "「for i in range(4):」で、したの ぎょうを 4かい くりかえすよ。くりかえす ぎょうは スペース 4つ じさげ。",
      "en": "“for i in range(4):” repeats the lines under it 4 times. Indent those lines with 4 spaces."
     },
     "hint": {
      "ja": "for i in range(4): → （じさげ）right() と down()",
      "en": "for i in range(4): → (indented) right() and down()"
     },
     "goal": {
      "ja": "for で くりかえそう",
      "en": "Repeat with for"
     },
     "point": {
      "ja": "for i in range(4): の したの 2ぎょうを スペース 4つ じさげ。2ぎょうとも くりかえされるよ。",
      "en": "Indent the 2 lines under for i in range(4): by 4 spaces. Both lines repeat."
     },
     "mistake": {
      "ja": "down() の じさげを わすれると、くりかえすのは right() だけに なるよ。",
      "en": "If down() is not indented, only right() repeats."
     }
    }
   ]
  },
  {
   "key": "pymazekey",
   "file": "python-maze-key.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで かぎと とびら",
    "en": "Python Keys & Doors"
   },
   "intro": {
    "ja": "かぎと とびらの めいろを Python で。pick_up()・open_door() と、key_here()・door_ahead() で しらべる if を つかいます。",
    "en": "Keys & Doors in Python. Use pick_up(), open_door() and if with key_here() and door_ahead()."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "state",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\npick_up()\nopen_door()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pymazekey-01.mp4",
      "en": "videos/en/pymazekey-01.mp4"
     },
     "title": {
      "ja": "ステージ1　pick_up() と open_door()",
      "en": "Stage 1: pick_up() and open_door()"
     },
     "text": {
      "ja": "かぎ 🔑 の うえで pick_up()、とびら 🚪 の まえで open_door()。すると とおれるよ。",
      "en": "On the key 🔑, pick_up(). In front of the door 🚪, open_door(). Then you can go through."
     },
     "hint": {
      "ja": "forward() を 2かい → pick_up() → open_door() → forward() を 2かい",
      "en": "forward() ×2 → pick_up() → open_door() → forward() ×2"
     },
     "goal": {
      "ja": "pick_up() と open_door()",
      "en": "pick_up() and open_door()"
     },
     "point": {
      "ja": "pick_up() で かぎが 1こ、open_door() で 0こ。もちものの かずが かわるね。",
      "en": "pick_up() makes 1 key and open_door() makes 0. Your item count changes."
     },
     "mistake": {
      "ja": "pickup() や open door() と かくと NameError や SyntaxError。「_」を わすれずに。",
      "en": "pickup() or open door() causes an error. Don’t forget the “_”."
     }
    },
    {
     "n": 2,
     "tags": [
      "seq",
      "state",
      "decomp",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nforward()\nturn_right()\nforward()\nforward()\nturn_right()\nforward()\nforward()\npick_up()\nturn_right()\nturn_right()\nforward()\nforward()\nopen_door()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pymazekey-02.mp4",
      "en": "videos/en/pymazekey-02.mp4"
     },
     "title": {
      "ja": "ステージ2　かぎは どこ？",
      "en": "Stage 2: Where is the key?"
     },
     "text": {
      "ja": "さきに かぎを とりに いこう。かぎが ないと open_door() は できないよ。",
      "en": "Get the key first. Without a key, open_door() does not work."
     },
     "hint": {
      "ja": "かぎまで いって pick_up()、turn_right() を 2かい して もどろう。",
      "en": "Walk to the key, pick_up(), turn_right() twice and go back."
     },
     "goal": {
      "ja": "より道の じゅんばんを かこう",
      "en": "Write the side trip in order"
     },
     "point": {
      "ja": "かぎまで いく → pick_up() → turn_right() を 2かい → とびらへ。ながい てじゅんも 1ぎょうずつ。",
      "en": "Go to the key → pick_up() → turn_right() twice → to the door. Write a long plan one line at a time."
     },
     "mistake": {
      "ja": "pick_up() の まえに open_door() を かくと「かぎを もっていないよ」。",
      "en": "open_door() before pick_up() gives “You have no key.”"
     }
    },
    {
     "n": 3,
     "tags": [
      "loop",
      "pattern",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "for i in range(2):\n    forward()\n    pick_up()\n    open_door()\n    forward()\nturn_right()\nforward()",
     "video": {
      "ja": "videos/ja/pymazekey-03.mp4",
      "en": "videos/en/pymazekey-03.mp4"
     },
     "title": {
      "ja": "ステージ3　for で とびら 2つ",
      "en": "Stage 3: Two doors with for"
     },
     "text": {
      "ja": "「forward() → pick_up() → open_door() → forward()」を for で くりかえそう。",
      "en": "Repeat “forward() → pick_up() → open_door() → forward()” with for."
     },
     "hint": {
      "ja": "for i in range(2): の なかに 4ぎょう（じさげ）→ turn_right() → forward()",
      "en": "for i in range(2): (4 lines, indented) → turn_right() → forward()"
     },
     "goal": {
      "ja": "for の なかに 4ぎょう",
      "en": "Four lines inside for"
     },
     "point": {
      "ja": "for の なかの 4ぎょうは ぜんぶ スペース 4つ じさげ。さいごの 2ぎょうは じさげ しない。",
      "en": "All 4 lines inside for are indented by 4 spaces. The last 2 lines are not."
     },
     "mistake": {
      "ja": "turn_right() まで じさげ すると、2かい まわって もどって しまうよ。",
      "en": "If turn_right() is indented too, you turn twice and go back."
     }
    },
    {
     "n": 4,
     "tags": [
      "if",
      "until",
      "state",
      "algo",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if key_here():\n        pick_up()\n    if door_ahead():\n        open_door()\n    if is_open('front'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pymazekey-04.mp4",
      "en": "videos/en/pymazekey-04.mp4"
     },
     "title": {
      "ja": "ステージ4　key_here() と door_ahead()",
      "en": "Stage 4: key_here() and door_ahead()"
     },
     "text": {
      "ja": "key_here() で いまの マスに かぎが あるか、door_ahead() で まえに とびらが あるか しらべられるよ。「while not at_goal():」の なかで つかおう。",
      "en": "key_here() checks for a key where you stand. door_ahead() checks for a door in front. Use them inside “while not at_goal():”."
     },
     "hint": {
      "ja": "while not at_goal(): の なかで if key_here(): pick_up() → if door_ahead(): open_door() → if is_open('front'): forward() → else: turn_right()",
      "en": "while not at_goal(): if key_here(): pick_up() / if door_ahead(): open_door() / if is_open('front'): forward() else: turn_right()"
     },
     "goal": {
      "ja": "key_here() と door_ahead() で しらべよう",
      "en": "Check with key_here() and door_ahead()"
     },
     "point": {
      "ja": "if を 2つ ならべて、さいごに if … else。while の なかは まいかい しらべなおすよ。",
      "en": "Two ifs in a row, then if … else. Inside while, everything is checked again each time."
     },
     "mistake": {
      "ja": "key_here の あとの「()」を わすれると SyntaxError。しらべる ことばにも () を つけるよ。",
      "en": "Forgetting “()” after key_here causes a SyntaxError. Checks also need ()."
     }
    }
   ]
  },
  {
   "key": "pymazeenemy",
   "file": "python-maze-enemy.html",
   "icon": "🐍",
   "name": {
    "ja": "Pythonで てきを よける",
    "en": "Python Slime Maze"
   },
   "intro": {
    "ja": "てきを よける めいろを Python で。wait() と danger_ahead()、if・elif・else を つかいます。",
    "en": "Dodge the Slime Maze in Python. Use wait(), danger_ahead() and if, elif, else."
   },
   "items": [
    {
     "n": 1,
     "tags": [
      "seq",
      "timing",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "forward()\nwait()\nwait()\nforward()\nforward()\nforward()",
     "video": {
      "ja": "videos/ja/pymazeenemy-01.mp4",
      "en": "videos/en/pymazeenemy-01.mp4"
     },
     "title": {
      "ja": "ステージ1　wait() で まとう",
      "en": "Stage 1: wait()"
     },
     "text": {
      "ja": "wait() で 1かい まつよ。スライムは 1かいごとに 1マス うごく。タイミングを あわせよう！",
      "en": "wait() makes the explorer wait for 1 turn. The slime moves 1 square every turn. Time your move!"
     },
     "hint": {
      "ja": "forward() → wait() を 2かい → forward() を 3かい",
      "en": "forward() → wait() ×2 → forward() ×3"
     },
     "goal": {
      "ja": "wait() で まとう",
      "en": "Wait with wait()"
     },
     "point": {
      "ja": "wait() は 1かい まつ めいれい。スライムは その あいだに 1マス うごくよ。",
      "en": "wait() waits one turn. The slime moves one square meanwhile."
     },
     "mistake": {
      "ja": "wait(2) のように () の なかに かずを かくと TypeError。2かい まつなら wait() を 2ぎょう。",
      "en": "wait(2) causes a TypeError. To wait twice, write wait() on 2 lines."
     }
    },
    {
     "n": 2,
     "tags": [
      "if",
      "until",
      "timing",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if danger_ahead():\n        wait()\n    else:\n        forward()",
     "video": {
      "ja": "videos/ja/pymazeenemy-02.mp4",
      "en": "videos/en/pymazeenemy-02.mp4"
     },
     "title": {
      "ja": "ステージ2　if danger_ahead():",
      "en": "Stage 2: if danger_ahead():"
     },
     "text": {
      "ja": "danger_ahead() は、スライムが まえに いる ときや つぎに まえに くる とき True に なるよ。そう なら wait()、そうでなければ forward()。",
      "en": "danger_ahead() is True when a slime is in front of you or will come there next. If so, wait(); else, forward()."
     },
     "hint": {
      "ja": "while not at_goal(): の なかで if danger_ahead(): wait() → else: forward()",
      "en": "while not at_goal(): if danger_ahead(): wait() else: forward()"
     },
     "goal": {
      "ja": "if danger_ahead(): で しらべよう",
      "en": "Check with if danger_ahead():"
     },
     "point": {
      "ja": "danger_ahead() は あぶない とき True。if … else で まつ か すすむ かを きめる。",
      "en": "danger_ahead() is True when it is dangerous. if … else decides between waiting and moving."
     },
     "mistake": {
      "ja": "else: の「:」を わすれると SyntaxError。",
      "en": "Forgetting the “:” after else causes a SyntaxError."
     }
    },
    {
     "n": 3,
     "tags": [
      "if",
      "nest",
      "until",
      "timing",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if danger_ahead():\n        wait()\n    elif is_open('front'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pymazeenemy-03.mp4",
      "en": "videos/en/pymazeenemy-03.mp4"
     },
     "title": {
      "ja": "ステージ3　elif で おおきな めいろ",
      "en": "Stage 3: A bigger maze with elif"
     },
     "text": {
      "ja": "あぶなければ wait()、そうでなくて（elif）まえが あいていれば forward()、どれでもなければ turn_right()。",
      "en": "If danger, wait(). elif the front is open, forward(). else turn_right()."
     },
     "hint": {
      "ja": "while not at_goal(): の なかで if danger_ahead(): wait() → elif is_open('front'): forward() → else: turn_right()",
      "en": "while not at_goal(): if danger_ahead(): wait() / elif is_open('front'): forward() / else: turn_right()"
     },
     "goal": {
      "ja": "elif で 3つに わけよう",
      "en": "Split into three with elif"
     },
     "point": {
      "ja": "if（あぶない）→ elif（まえが あいている）→ else（みぎを むく）。うえから じゅんに しらべるよ。",
      "en": "if (danger) → elif (front is open) → else (turn right). They are checked from the top."
     },
     "mistake": {
      "ja": "elif を if に すると、まった あとに すすんで つかまる ことが あるよ。",
      "en": "If you change elif to if, you may move right after waiting and get caught."
     }
    },
    {
     "n": 4,
     "tags": [
      "algo",
      "until",
      "timing",
      "py"
     ],
     "limit": null,
     "img": null,
     "code": "while not at_goal():\n    if danger_ahead():\n        wait()\n    elif is_open('front'):\n        forward()\n    else:\n        turn_right()",
     "video": {
      "ja": "videos/ja/pymazeenemy-04.mp4",
      "en": "videos/en/pymazeenemy-04.mp4"
     },
     "title": {
      "ja": "ステージ4　うずまきの めいろ",
      "en": "Stage 4: The spiral maze"
     },
     "text": {
      "ja": "10×10 の うずまきに スライムが 3びき。ステージ3の プログラムで いけるかな？",
      "en": "A 10×10 spiral with three slimes. Does your program from Stage 3 work here too?"
     },
     "hint": {
      "ja": "ステージ3の プログラムが そのまま つかえるよ。",
      "en": "The Stage 3 program works as it is."
     },
     "goal": {
      "ja": "おなじ コードで おおきな めいろ",
      "en": "The same code, a bigger maze"
     },
     "point": {
      "ja": "ステージ3の コードを そのまま。どんな めいろでも つかえる やりかただね。",
      "en": "Use the Stage 3 code as it is. It works in any maze."
     },
     "mistake": {
      "ja": "is_open('front') の ' を わすれると ValueError や SyntaxError。",
      "en": "Forgetting the quotes in is_open('front') causes an error."
     }
    }
   ]
  }
 ]
};
