/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const crypto = require('crypto');


console.log('adsdsd');
var expected = 'd2319c7e9509b070dc7dc5a2ddb9db16dd0bec8d29b8ae3233342d8b5b3d9d566fc9bf3ff181807c087d80f89cd1238d9e6a00e843cc392241c6d8b6a23232ec';
var password = 'KmU2NNy53wSJ';

const hash = crypto.createHash("sha512");
const salt = "be5axu7u2ev5jeTuraprUsp4brap8us";
const key = 'alw';


var reHashCount = 97;
var outputHash = password;
var merged = password + salt + key;

var derivedKey;

//perform key lengthening
for (var i = 0; i < reHashCount; i++) {
    const hash1 = crypto.createHash("sha512")
    hash1.update(outputHash + salt + key) // Hash the input
    derivedKey = hash1.digest("hex")         // Return it as a hex string
    outputHash = derivedKey.toString('hex');
//    console.log('\n mid 3=');
//    console.log(outputHash);


}
console.log('\nkey 3=\n');
console.log(derivedKey.toString('hex'));
console.log(derivedKey.toString('hex') == expected);


function generateHash(password) {
    const salt = "be5axu7u2ev5jeTuraprUsp4brap8us";
    const key = 'alw';
    const reHashCount = 97;
    var outputHash = password;

    for (var i = 0; i < reHashCount; i++) {
        const hash1 = crypto.createHash("sha512")
        hash1.update(outputHash + salt + key) // Hash the input
        outputHash = hash1.digest("hex").toString('hex');     // Return it as a hex string
    }

    return outputHash;
}


var op = generateHash(password);
console.log(op == expected);
