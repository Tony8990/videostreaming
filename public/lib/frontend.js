var socket = io();
var input = $('#input');
function setUsername() {
    if(document.getElementById('input').value!="") {
        socket.emit('setUsername', document.getElementById('input').value);
    }
    else
    {
        alert("Write Name");
    }
};
var user;
var color;

socket.on('userExists', function(data) {
    document.getElementById('error-container').innerHTML = data;
});
socket.on('userSet', function(data) {
    user = data.username;
    color = data.color;
    document.body.innerHTML = '<div id="container"><div id="chat"><div id="content"></div>\
                <input class="input" style="float: left" type="text" id="input" value=""/>\
                <button class="btn btn-success" id="button" style="float: right" type = "button" name = "button" onclick = "sendMessage()">Send Message</button>\
                </div>\
                <div id="chat"><div class="bg-success" style="text-align: center; font-size: 18px;" id="logger">\
                <button class="btn btn-primary" style="float:left;" onclick="stream();"> Stream Web Cam !!!</button>\
                <button class="btn btn-primary" style="float:right;" onclick="view();"> View Web Cam !!!</button></div></div>\
                <div id="video-box"><img id="play" style="margin-top: 15px;" ">\
                <video src="" id="video" style="text-align: center" autoplay="true"></video>\
                <canvas style="display: none" id="canvas"></canvas>\
                </div></div>';
});
function sendMessage() {
    var msg = document.getElementById('input').value;
    if(msg!="") {
        socket.emit('msg', {message: msg, user: user, color: color});
        $('#input').val("");
    }
    else
    {
        alert("Write Message");
    }
}

socket.on('newmsg', function(data) {
    if(user) {
        $('#content').prepend('<p><span style="color:' + data.color + '">'+
            data.user +'</span>'+ ' @ '+ new Date().getHours() +':' + new Date().getMinutes() +' # ' + data.message + '</p>');
    }
});

function stream(){
    var socket = io();

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        freq=0.1;
    canvas.width = 600;
    canvas.height = 400;

    context.width = 600;
    context.height = 400;
    function logger(msg) {
        $("#logger").text(msg);
    }

    function loadCam(stream) {
        video.src = window.URL.createObjectURL(stream);
        logger('Streaming in corso ...');

    }
    function loadFail(stream) {
        logger('WebCam non Connessa Ritentare o controllare bene ');
    }

    function ViewVideo(video, context) {
        context.drawImage(video, 0, 0, context.width, context.height);
        socket.emit('stream', canvas.toDataURL('image/webp'));

    }
    $(function () {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true, audio:true}, loadCam, loadFail);
        }

        //1000 =1sc
        setInterval(function () {
            ViewVideo(video, context);
        },freq);
    });

}

function view() {
    var socket = io();

    socket.on('stream', function (image) {
        var img = document.getElementById("play");
        img.src = image;
        $("#logger").text("View in corso ...");
    });
}
