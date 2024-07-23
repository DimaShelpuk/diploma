const http = require('http');
let server = http.createServer((req, res) => {
     res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
     res.end("hellow dima")
})



server.listen(3000, function(){ console.log("Сервер запущен по адресу http://localhost:3000")});