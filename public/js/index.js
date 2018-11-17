var socket = io();
socket.on('connect', function() {
    console.log('Connecteed to server');

    // socket.emit('createEmail', {
    //     to:'cc@mail.com',
    //     text:'Hey, dog!'
    // });

    // socket.emit('createMessage', {
    //     from:'Andrew',
    //     text: 'Yup, thats me!'
    // });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
    
});

// socket.on('newEmail', function(email){
//     console.log('newEmail', email);
// });

socket.emit('createMessage', {
    from:'Frank',
    text:'Hi'
}, function(data){
    console.log('Got it.', data);
});