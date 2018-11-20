const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '..', 'public');
var PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');


    

    //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);


        //  socket.leave('room name');

        //  io.emit -> io.to('The Office Fans).emit
        //  socket.broadcast.emit   -> socket.broadcast.to('roomname').emit
        //  socket.emit 
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });
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
        var user = users.getUser(socket.id);
        
        if(user && isRealString(message.text)){
            //  Emit new message to event "newMessage"
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        
        callback();

        //  Send message to all event "newMessage" except self
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt : new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
        
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
