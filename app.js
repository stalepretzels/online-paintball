var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
const requestIp = require('request-ip')
var server = require('http').createServer(app);
var io = require('socket.io')(server);  
var ipBanList = new Array;

var os = require('os');
var networkInterfaces = os.networkInterfaces();
var ip = require("ip");
const { Socket } = require('socket.io');
var c = 0;
var b = false;

app.use(cookieParser());
app.use(express.static('public'))
app.use(express.static(__dirname + '/node_modules'));
app.get('/', function (req, res, next) {
    while (c < ipBanList.length) {
        if (ip.address() == ipBanList[c]) {
            b = true;
            c = ipBanList.length++;
            res.sendFile(__dirname + '/IpBanned.html');
        }
        c++
    }
    if (b === false) {
        res.sendFile(__dirname + '/index.html');
    }
    var clientIp = requestIp.getClientIp(req)
    console.log(`network Ip: ${clientIp}`)
    console.log("local Ip: " + ip.address());
    console.log(networkInterfaces);
})
io.on('connection', function (client) {
    console.log('Client connected...');

    client.on('join', function (data) {
        console.log(data);
    });

    client.on('messages', function (data) {
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    });
    client.on('functions', function (data) {
        client.emit('functions', data);
        client.broadcast.emit('functions', data);
    });

    client.on('disconnect', function () {
        client.emit('functions', 'disconnect:');
        client.broadcast.emit('functions', 'disconnect:');
        console.log('Client disconnected...');
    });
});

server.listen(8080);
