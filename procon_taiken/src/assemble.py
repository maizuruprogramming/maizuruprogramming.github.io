b='/home/claude/build/'
head='''<!DOCTYPE html>
<html lang="ja" data-theme="normal">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>高専プロコン競技部門 体験</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Noto+Sans+Thai:wght@500;700;800&display=swap" rel="stylesheet">
<script>try{var s=JSON.parse(localStorage.getItem('enmusubi-settings')||'{}');if(s.theme)document.documentElement.dataset.theme=s.theme;}catch(e){}</script>
'''
app=open(b+'app.js').read().replace('%%CODE%%',open(b+'kata_core.js').read()+open(b+'kata_ui.js').read()+open(b+'hexa_core.js').read()+open(b+'hexa_ui.js').read()+open(b+'code.js').read())
out=head+open(b+'style.css').read().strip()+'\n</head>\n'+open(b+'body.html').read()+'\n<script>\n'+open(b+'i18n.js').read()+'\n'+open(b+'i18n_th.js').read()+'\n'+open(b+'i18n_mn.js').read()+'\n'+open(b+'i18n_hexa.js').read()+'\n'+open(b+'core.js').read()+'\n'+app+'</script>\n</body>\n</html>\n'
open('/home/claude/enmusubi.html','w').write(out)
