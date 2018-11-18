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
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`)
    
    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = $('<li></li>');
    var a = $(`<a target="_blank">My current location</a>`);
    
    li.text(`${message.from}: `)
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

var locationButton = $('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    
    navigator.geolocation.getCurrentPosition(function(postition){
        socket.emit('createLocationMessage', {
            latitude: postition.coords.latitude,
            longitude: postition.coords.longitude
        });
    }, function(error){
        alert(`Unable to fetch location.`);
    });
});


// socket.on('newEmail', function(email){
//     console.log('newEmail', email);
// });

// socket.emit('createMessage', {
//     from:'Frank',
//     text:'Hi'
// }, function(data){
//     console.log('Got it.', data);
// });

$('#message-form').on('submit', function(e) {
    e.preventDefault(); //Prevent pageload
    
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message').val()
    }, function(){

    });
});