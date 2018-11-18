var socket = io();

function scrollToBottom(){
    //  Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    //  Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`)
    
    // $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();

    // var formattedTime = moment(message.createdAt).format('h:mm a');

    // var li = $('<li></li>');
    // var a = $(`<a target="_blank">My current location</a>`);
    
    // li.text(`${message.from} ${formattedTime}: `)
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
});

var locationButton = $('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(postition){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: postition.coords.latitude,
            longitude: postition.coords.longitude
        });
    }, function(error){
        locationButton.removeAttr('disabled').text('Send location');
        alert(`Unable to fetch location.`);
    });
});


// socket.on('newEmail', function(email){
//     console.log('newEmail', email);
// });

//  Sample callback acknowledgement
// socket.emit('createMessage', {
//     from:'Frank',
//     text:'Hi'
// }, function(data){
//     console.log('Got it.', data);
// });

$('#message-form').on('submit', function(e) {
    e.preventDefault(); //Prevent pageload
    var messageTextBox = $('[name=message');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function(){
        messageTextBox.val('');
    });
});