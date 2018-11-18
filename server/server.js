const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '..', 'public');
var PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');


    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

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
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        //  Emit new message to event "newMessage"
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.');

        //  Send message to all event "newMessage" except self
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt : new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    })
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
