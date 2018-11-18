var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Deb';
        var lat = 15;
        var lng = 10;
        var url = `https://www.google.com/maps?q=15,10`;

        var msg = generateLocationMessage(from, lat, lng);

        expect(msg.createdAt).toBeA('number');
        expect(msg.from).toBe(from);
        expect(msg.url).toBe(url);
    });
});