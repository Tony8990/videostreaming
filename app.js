var express = require("express");
var fs =require('fs');
var app = new express();

var http = require("http").Server(app);
var io = require("socket.io")(http);
var Log = require('log'),
    log = new Log('debug');
var port = process.env.PORT || 3000;
var options={
    key: fs.readFileSync('credential/server.key'),
    cert:fs.readFileSync('credential/server.crt'),
    ca:fs.readFileSync('credential/server.csr')

};

var https =require("https").Server(options,app);


app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.redirect('index.html');

});
io.on('connection', function (socket) {
    socket.on('stream', function (image) {
        socket.broadcast.emit('stream', image);

    });


});
https.listen(port, function () {
    log.info('HTTPS Server In Ascolto %s' , port);
});
