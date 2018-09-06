var crypto = require('crypto');
//var key = 'MySecretKey12345';
//var iv = '1234567890123456';

var key = 'ezRTZaPUkr0XqEib';
var iv = 't4QKb1xx7tKRAluu';



var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

var text = 'plain text';
var encrypted = cipher.update(text, 'utf8', 'binary');
encrypted += cipher.final('binary');
hexVal = Buffer.from(encrypted, 'binary');
newEncrypted = hexVal.toString('hex');
console.log('Encrypted: ', newEncrypted);
//Encrypted:  58b24d58b3dea8aeed591b0a6b756263

//
//var decrypted = decipher.update(newEncrypted, 'hex', 'binary');
//decrypted += decipher.final('binary');
//
//console.log('Decrypted: ', decrypted);
