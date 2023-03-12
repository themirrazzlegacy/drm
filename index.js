let CryptoJS = {AES:require('crypto-js/aes')};
let request = require('request');
let fs = require('fs').promises
let fss = require('fs');
let http = require('http');
let path = require('path');

(async () => {
    var music = await fs.readdir('drm');
    var key = process.env['drmkey'];
    var i0;
    var drm = [];
    var zdrm = [];
    for(var i = 0;i<music.length;i++) {
        i0 = 'drm/'+music[i]
        zdrm.push(i0);
        drm.push(
            await new Promise(function (res,rej) {
                request({
                      url: 'https://www.devglan.com/online-tools/decrypt-file',
                      method: 'POST',
                      formData: {
                        'dkey': key,
                        'file': fss.createReadStream(
                            i0
                        ),
                          'deSecretKey': 'true'
                      },encoding: null
                    }, function (e,r,b) {
                    res(b);
                });
            })
        );
    }
    var s = http.createServer(
        async (req,res) => {
            var url = new URL(`https://wwwwqw.w.w${req.url}`);
            var qG = decodeURIComponent(url.pathname);
            if(qG === '/' || qG === '/leng') {
                res.writeHead(200,{
                    'content-type':'text/plain',
                    'access-control-allow-origin':'*'
                });
                res.write(String(drm.length));
                res.end()
            } else if(qG.startsWith('/play/')&& zdrm[Number(qG.slice(6))] && url.searchParams.get('zU') == key) {
                    res.writeHead(200,{
                        'content-type':'audio/mp3',
                        'access-control-allow-origin':'*'
                    });
                    res.write(drm[Number(qG.slice(6))]);
                    res.end();
            } else if(qG=='/titles') {
                res.writeHead(200,{'Content-type':'text/plain','access-control-allow-origin':'*'});
                var qdrm = [];
                zdrm.forEach(e => {
                    qdrm.push(e.slice(
                        4,e.length-4
                    ))
                })
                res.write(qdrm.join('\n'));
                res.end();
            } else if(qG.startsWith('/playtitle/')&& zdrm.indexOf('drm/'+qG.slice(11)+'.mp3')>-1 && url.searchParams.get('zU') == key) {
                    res.writeHead(200,{
                        'content-type':'audio/mp3',
                        'access-control-allow-origin':'*'
                    });
                    res.write(drm[zdrm.indexOf('drm/'+qG.slice(11)+'.mp3')]);
                    res.end();
            } else {
                res.writeHead(400,{
                    'content-type':'text/plain',
                    'access-control-allow-origin':'*'
                });
                res.write('E!');
                res.end();
            }
        }
    );
    s.listen();
})();
