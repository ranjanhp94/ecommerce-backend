let city = 'bangalore';
let skills = ['js','rb','py'];
const details = function(name,skills){
    return name + ' knows ' + skills;
}

module.exports = {
    city,  // export string
    skills, // ------ array
    details // ----- function
}

// console.log(module);