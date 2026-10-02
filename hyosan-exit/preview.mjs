import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const files=new Set(['index.html','styles.css','app.js','hyosan-logo-white.png']);
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',png:'image/png',jpg:'image/jpeg'};
createServer(async(req,res)=>{let file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(!files.has(file)&&!/^captures\/[a-z-]+\.jpg$/.test(file)){res.writeHead(404);return res.end('Not found')}try{const data=await readFile(new URL('dist/'+file,import.meta.url));res.writeHead(200,{'content-type':types[file.split('.').pop()],'cache-control':'no-store'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(4186,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4186'));
