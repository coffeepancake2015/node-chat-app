var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

var generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url:`https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: new Date().getDate()
    };
};

module.exports = {generateMessage, generateLocationMessage};