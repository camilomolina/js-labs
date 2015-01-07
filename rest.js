var http = require('http');
var url = require('url');
var items = [];



http.createServer(function(req, res) {
    console.log(req.method);
    switch (req.method) {
        case 'POST':
            //curl http://localhost:8000 -d "elemento nuevo"
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk){
                console.log(chunk);
                item += chunk;
            });
            req.on('end', function(){
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            //curl http://localhost:8000
            items.forEach(function(item, i){
                res.write(i + ') ' + item + '\n');
            });
            res.end();
            break;
        case 'DELETE':
            //curl http://localhost:8000/1 -X DELETE
            console.log('borando');
            var path = url.parse(req.url).pathname;
            console.log(path);
            var i = parseInt(path.slice(1), 10);
            console.log(i);
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            } else {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;
    }
}).listen(8000, "127.0.0.1");