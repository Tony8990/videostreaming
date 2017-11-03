var fs =require('fs');

//var http = require("http").Server(app);
var Log = require('log'),
    log = new Log('debug');
var port = process.env.PORT || 3000;
var options={
    key: fs.readFileSync('credential/server.key'),
    cert:fs.readFileSync('credential/server.crt'),
    ca:fs.readFileSync('credential/server.csr')

};
var express = require("express"),
     app =  express(),
    server =require('https').createServer(options,app);
var io = require("socket.io")(server);



app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.redirect('index.html');

});
io.on('connection', function (socket) {

    socket.on('stream', function (image) {
        socket.broadcast.emit('stream', image);

    });


});
server.listen(port, function () {
    log.info('HTTPS Server In Ascolto %s' , port);
});
