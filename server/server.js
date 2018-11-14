const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const publicPath = path.join(__dirname, '..', 'public');
var PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newEmail', {
    //     from:'a@mail.com',
    //     text:'Hey, bitch',
    //     createdAt:123
    // });
    
    //  Send to client
    // socket.emit('newMessage', {
    //     from:'a@mail.com',
    //     text:'Hey, bitch',
    //     createdAt:123
    // });

    // socket.on('createEmail', (newEmail) =>{
    //     console.log('createEmail', newEmail);
    // });

    //  Receive from client
    socket.on('createMessage', function(message) {
        console.log('createMessage', message);
        
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt : new Date().getTime()
        });

    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    })
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
