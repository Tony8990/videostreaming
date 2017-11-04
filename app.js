var fs =require('fs');
//var http = require("http");
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
    log.info('HTTPS Server In Ascolto %s', port);

});

/*var wsServer = require('ws').Server,
    wss= new wsServer({
    ssl:true,
    port:3000,
    ssl_key:'credential/server.key',
    ssl_cert:'credential/server.crt'
    });*/
var http=require('http');
var webSocketServer = require('websocket').server;
var webSocketPort=process.env.PORT || 1337;
var chat = http.createServer(function (req,res) {
    var wsServer=new webSocketServer({
        httpServer:chat
    });
// This callback function is called every time someone
// tries to connect to the WebSocket server
    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin '
            + request.origin + '.');
        var connection = request.accept(null, request.origin);

        var index = clients.push(connection) - 1;
        var userName = false;
        var userColor = false;
        console.log((new Date()) + ' Connection accepted.');
        if (history.length > 0) {
            connection.sendUTF(
                JSON.stringify({ type: 'history', data: history} ));
        }
        // user sent some message
        connection.on('message', function(message) {
            if (message.type === 'utf8') { // accept only text
                // first message sent by user is their name
                if (userName === false) {
                    // remember user name
                    userName = htmlEntities(message.utf8Data);
                    // get random color and send it back to the user
                    userColor = colors.shift();
                    connection.sendUTF(
                        JSON.stringify({ type:'color', data: userColor }));
                    console.log((new Date()) + ' User is known as: ' + userName
                        + ' with ' + userColor + ' color.');
                } else { // log and broadcast the message
                    console.log((new Date()) + ' Received Message from '
                        + userName + ': ' + message.utf8Data);

                    // we want to keep history of all sent messages
                    var obj = {
                        time: (new Date()).getTime(),
                        text: htmlEntities(message.utf8Data),
                        author: userName,
                        color: userColor
                    };
                    history.push(obj);
                    history = history.slice(-100);
                    // broadcast message to all connected clients
                    var json = JSON.stringify({ type:'message', data: obj });
                    for (var i=0; i < clients.length; i++) {
                        clients[i].sendUTF(json);
                    }
                }
            }
        });
        process.title = 'node-chat';
        var history = [ ];
        var clients = [ ];
        function htmlEntities(str) {
            return String(str)
                .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
        colors.sort(function(a,b) { return Math.random() > 0.5; } );

        // user disconnected
        connection.on('close', function(connection) {
            if (userName !== false && userColor !== false) {
                console.log((new Date()) + " Peer "
                    + connection.remoteAddress + " disconnected.");
                // remove user from the list of connected clients
                clients.splice(index, 1);
                // push back user's color to be reused by another user
                colors.push(userColor);
            }
        });
    });

    chat.listen(webSocketPort,function () {
        console.log((new Date()) + " Server is listening on port "
            + webSocketPort);
    });

});


