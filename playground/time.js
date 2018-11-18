var moment = require('moment');

// var date = new Date();
// console.log(date);

// var date = moment();
// date.add(100,'year').subtract(1,'months');
// console.log(date.format('MMM Do, YYYY'));

// console.log(date.format('h:mm a'));
var createdAt = moment().valueOf();
var date = moment(createdAt);
console.log(date.format('YYYY-MM-DD h:mm:ss A'));