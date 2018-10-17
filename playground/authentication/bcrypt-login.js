const bcrypt = require('bcryptjs');

// value in db;
let encryptedPassword = '$2a$10$brIjgbU5MJt3BUWiIC7E7e8ZsaG.H/knH.SV1RcwflM9FlfXMhUVK';

// login

let userEmail = 'ani@dctacademy.com';
let userPassword = 'secret124';

bcrypt.compare(userPassword, encryptedPassword).then((res) => {
    console.log(res);
});