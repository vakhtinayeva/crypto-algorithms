// file with modulo calculations for big numbers
const utils = require("./utils");

//function to generate e
function generateEncryptionExponent(ef) {
    // choose pseudorandom е in 5 - 205
    // smaller for speed of calculations
    let e = Math.floor(Math.random() * 200 + 5);

    while (utils.calculateGreatestCommonDevisor(e, ef) !== 1) {
        e =  Math.floor(Math.random() * 200 + 5);
    }

    return e;
}

//function to calculate d
//start with 1 і and gradually looking for d, less than module and fits
// ((е % еf) * (d % еf)) % еf = 1
const modInverse = (a, m) => {
    for(let x = 1; x < m; x++)
        if (((a % m) * (x % m)) % m == 1)
            return x;
}

//test encryption
const encryption = (message, publicKey) => {
    let encrypted = "";
    const {e, n} = publicKey;

    for (let i = 0; i < message.length; i++) {
        let charCode = message.charCodeAt(i);
        let code = utils.powMod(charCode, e, n);
        encrypted += String.fromCharCode(code);
    }

    return encrypted;
}

//test decryption
function decryption(encryptedMessage, privateKey) {
    const { d, n } = privateKey;

    let decrypted = "";
    for (let i = 0; i < encryptedMessage.length; i++) {
        let charCode = encryptedMessage.charCodeAt(i);
        let code = utils.powMod(charCode, d, n);
        decrypted += String.fromCharCode(code);
    }
    return decrypted;
}

//choose 2 random prime numbers
const p = 61;
const q = 53;

//calculate n = p * q
const n = p * q;
console.log('n: ' + n);

//calculate euler function
const ef = (p - 1) * (q - 1);
console.log('ef: ' + ef);

//choose е, so that 0 < e < ef and mutually ptime to ef
const e = generateEncryptionExponent(ef);
console.log('e: ' + e);

//calculate d inverse to е modulo ef
const d = modInverse(e, ef);
console.log('d: ' + d);

//form public key
const publicKey = { e, n };
//form private key d
const secretKey = { d, n };

const message = "Вахтіна Єва Олексіївна";
console.log('Message: ' + message);

//user 1 encrypts with public key
const encryptedMessage = encryption(message, publicKey);
console.log("Encrypted message: " + encryptedMessage);

//user 2 decrypts with private key
const decryptedMessage = decryption(encryptedMessage, secretKey);
console.log("Decrypted message: " + decryptedMessage);
