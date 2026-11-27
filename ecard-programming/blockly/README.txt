このフォルダに Google Blockly を置くと、インターネットなしでも「Blockly」モードが使えます。
置くファイル(npm の blockly パッケージ、または https://unpkg.com/blockly@11/ から):
  blockly/blockly_compressed.js
  blockly/msg/ja.js   (英語表示も使うなら msg/en.js も)
  blockly/media/      (任意。ゴミ箱などの画像)
このフォルダが空のときは、インターネット(unpkg)から自動で読み込みます。
どちらも読み込めないときは、自作の「🧩 ブロック」モードに切り替わります。
