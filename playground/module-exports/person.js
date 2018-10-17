let name = 'ani';
// let dataFromAnotherFile = require('./place')
// console.log(name + ' lives in ' + dataFromAnotherFile.city);

// console.log(require('./place'));
// let city = require('./place').city;
// let skills = require('./place).skills;

// es6 object destructing
let { city, skills, details } = require('./place');
console.log(city);

console.log(name + ' lives in ' + city);
console.log(details); // [Function: details]
console.log(details(name, skills));  