const bcrypt = require('bcryptjs');

// funktion för att hasha och jämföra lösenord

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err){
                    reject('error')
                }
                resolve(hash)
                
            });
        });
    });
}
const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, res) {
            if(err){
                reject('error')
            }
            resolve(res)
        });
        
    });
}

module.exports = {hashPassword, comparePassword}