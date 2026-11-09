"""本の きょうつうの ぶんしょう（おえかき・うちゅう・こわす・おく の 本で つかう）"""
from content import UI as BASE_UI, AUTHOR  # noqa: F401

UI = dict(BASE_UI)
UI.update({
    'model': ('おてほん（うすい せんを なぞるように かこう）', 'Model (draw over the light lines)'),
    'start': ('スタートの ようす', 'The start'),
})


def howto(app_ja, app_en, extra_ja='', extra_en=''):
    ja = f'''<h2>この ほんの つかいかた</h2>
<p>この ほんは、パソコンや タブレットの「{app_ja}」の アプリと いっしょに つかう ほん です。ブロック と Python（パイソン）で プログラムを つくりながら、プログラミングの かんがえかたを まなびます。</p>
<div class="steps">
<div><b>1</b><span>ページの <b>もんだい</b>と えを よむ。</span></div>
<div><b>2</b><span>どんな じゅんばんで うごかすか、ゆびで なぞったり ノートに かいたり して かんがえる。</span></div>
<div><b>3</b><span>アプリで プログラムを つくって「▶ じっこう」。うまく いかなかったら、どこが ちがったかを みて なおす。</span></div>
<div><b>4</b><span>こまったら <b>💡 ヒント</b>。できたら ページを めくって <b>📖 こたえ</b>と <b>✨ ポイント</b>を たしかめる。</span></div>
</div>
{extra_ja}
<p class="note">こたえは 1つ だけでは ありません。ほんと ちがう くみかたでも、できれば せいかい です。まちがいは「ヒント」。なんども ためして みよう！</p>
<h3>この ほんで あつかう アプリ</h3>'''
    en = f'''<h2>How to use this book</h2>
<p>Use this book together with the “{app_en}” app on a computer or tablet. You will learn how to think like a programmer by building programs with blocks and with Python.</p>
<div class="steps">
<div><b>1</b><span>Read the <b>problem</b> and look at the picture.</span></div>
<div><b>2</b><span>Think about the order: trace it with your finger or write it in your notebook.</span></div>
<div><b>3</b><span>Build the program in the app and press “▶ Run”. If it doesn’t work, find what was different and fix it.</span></div>
<div><b>4</b><span>Stuck? Look at the <b>💡 Hint</b>. When you are done, turn the page and check the <b>📖 Answer</b> and the <b>✨ Key point</b>.</span></div>
</div>
{extra_en}
<p class="note">There is more than one right answer. If it works, your program is correct, even if it is different from the book. Mistakes are hints — try again and again!</p>
<h3>Apps in this book</h3>'''
    return (ja, en)


ASSESS = (('評価の観点（例）', 'Assessment (example)'),
          '''<table class="t"><tr><th>観点</th><th>おおむね満足できる姿（B）</th><th>十分満足できる姿（A）の例</th></tr>
<tr><td>知識・技能</td><td>ブロック（コード）を正しく組み合わせ、課題を達成できる。</td><td>反復や条件分岐を使い、短く分かりやすいプログラムで達成できる。</td></tr>
<tr><td>思考・判断・表現</td><td>実行結果から誤りの場所を見つけ、直すことができる。</td><td>決まりや手順を言葉で説明し、別の場面にも使えるプログラムにできる。</td></tr>
<tr><td>主体的に学習に取り組む態度</td><td>うまくいかなくても、試し直して課題に取り組む。</td><td>友達と考えを伝え合い、よりよい方法を自分から探す。</td></tr></table>
<p>評価資料として、ワークシート（①振り返り、②・⑤・⑦など）、アプリのクリア状況（⑧チェックカード、修了証）を活用できます。</p>''',
          '''<table class="t"><tr><th>Area</th><th>Meets expectations (B)</th><th>Exceeds (A), e.g.</th></tr>
<tr><td>Knowledge & skills</td><td>Combines blocks (code) correctly and completes the task.</td><td>Uses loops and conditions to complete it with a short, clear program.</td></tr>
<tr><td>Thinking, judgment & expression</td><td>Finds where the error is from the result and fixes it.</td><td>Explains the rule or steps in words and makes a program that works in other cases too.</td></tr>
<tr><td>Attitude toward learning</td><td>Keeps trying even when it doesn’t work.</td><td>Shares ideas with friends and looks for better ways on their own.</td></tr></table>
<p>Use the worksheets (1 reflection; 2, 5, 7 etc.) and the app progress (8 check card, certificate) as evidence.</p>''')


def usage(slides_ja, slides_en, ws_ja, ws_en):
    return (('使い方と関連教材', 'Using the apps and related materials'),
            f'''<h3>動作環境・運用</h3>
<ul><li>パソコン・タブレット・スマートフォンのブラウザで動きます。インストールは不要です。動作にはインターネット接続が必要です。</li>
<li>クリアしたステージは、その端末のブラウザに保存されます。端末を共有する場合は、授業の最初にどこまで進んだかを確認してください。</li>
<li><b>先生モード：</b>アドレスの最後に <code>?sensei</code> を付けると「こたえ」ボタンが表示され、答えを読み込めます。</li>
<li>「⚙ きのう」から、日本語・英語の切り替え、ドット文字への切り替え、Python版への切り替え、修了証の表示ができます。</li></ul>
<h3>関連教材</h3>
<table class="t"><tr><th>教材</th><th>内容</th></tr>
<tr><td>かいせつしょ（guide.html）</td><td>全課題のめあて・つまずき・ヒント・答え。この本の元になったデータです。</td></tr>
<tr><td>ワークシート（PDF）</td><td>{ws_ja}、①めあて・ふりかえり、⑧チェックカード。</td></tr>
<tr><td>学習指導案（原案）</td><td>45分の授業の展開例（かいせつしょの各課題から開けます）。</td></tr>
<tr><td>解説動画（videos.html）</td><td>各ステージ・おだいの解き方を短い動画で紹介。</td></tr>
<tr><td>授業用スライド</td><td>{slides_ja}（PowerPoint）。</td></tr></table>''',
            f'''<h3>Requirements and tips</h3>
<ul><li>Works in the browser on computers, tablets and smartphones. No installation needed. An internet connection is required.</li>
<li>Cleared stages are saved in that device’s browser. If devices are shared, check progress at the start of each lesson.</li>
<li><b>Teacher mode:</b> add <code>?sensei</code> to the end of the address to show an “Answer” button.</li>
<li>From “⚙ Settings” you can switch Japanese/English, use the pixel font, switch to the Python version and show the certificate.</li></ul>
<h3>Related materials</h3>
<table class="t"><tr><th>Material</th><th>Contents</th></tr>
<tr><td>Guide (guide.html)</td><td>Goals, common mistakes, hints and answers for every task. This book is built from the same data.</td></tr>
<tr><td>Worksheets (PDF)</td><td>{ws_en}, 1 goal & reflection, 8 check card.</td></tr>
<tr><td>Lesson plans (Japanese)</td><td>Example 45-minute lessons (open them from each task in the Guide).</td></tr>
<tr><td>Videos (videos.html)</td><td>Short videos showing how to solve each task.</td></tr>
<tr><td>Lesson slides</td><td>{slides_en} (PowerPoint).</td></tr></table>''')
