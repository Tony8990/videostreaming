var fs =require('fs');
var Log = require('log'),
    log = new Log('debug');
var port = process.env.PORT || 8000;
var options={
    key: fs.readFileSync('credential/server.key'),
    cert:fs.readFileSync('credential/server.crt'),
    ca:fs.readFileSync('credential/server.csr')

};
var express = require("express"),
    app =  express(),
    server = require('https').createServer(options,app);
var io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res) {
    res.redirect('index.html');
});

users = [];
// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('setUsername', function(data) {
        console.log(data);

        if(users.indexOf(data) > -1) {
            socket.emit('userExists', ' Username ' + data + ' is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', {username: data, color: colors.shift()});
        }
    });

    socket.on('msg', function(data,color) {
        io.sockets.emit('newmsg', data,color);
    });

    socket.on('stream', function (image) {
        socket.broadcast.emit('stream', image);
    });
});

server.listen(port, function() {
    log.info('listening on localhost: ',port);
});