const utils = require("../utils");

//function to generate e
function generateEncryptionExponent(ef) {
    //choosing random e in 5 - 205
    //smaller for speed of calculations
    let e = Math.floor(Math.random() * 200 + 5);

    while (utils.calculateGreatestCommonDevisor(e, ef) !== 1) {
        e =  Math.floor(Math.random() * 200 + 5);
    }

    return e;
}

//function to calculate d
//starting with 1 and gradually searching for d, so that it's less than modulo and
// ((е % еf) * (d % еf)) % еf = 1
const modInverse = (a, m) => {
    for(let x = 1; x < m; x++)
        if (((a % m) * (x % m)) % m == 1)
            return x;
}

//classes to simulate users Р і V
class P {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    sendPublicKey() {
        return this.publicKey;
    }

    calculateR(x) {
        const n = this.privateKey.n;
        const d = this.privateKey.d;
        const r = (BigInt(x) ** BigInt(d)) % BigInt(n);
        return Number(r.toString());
    }
}

class V {
    r = 0;
    publicKey = 0;

    recievePublicKey(key) {
        this.publicKey = key;
    }

    setRcalculateX() {
        const n = this.publicKey.n;
        const e = this.publicKey.e;
        const r = utils.generateRandom(1, n -1);
        this.r = r;
        console.log('r: ' + r);
        const x = (BigInt(r) ** BigInt(e)) % BigInt(n);
        return Number(x.toString());
    }

    verify(rP) {
        const verified = this.r === rP;
        console.log('Verified: ' + verified);
        return verified;
    }
}

//2 random primes
const p = 61;
const q = 53;

//calculate n = p * q
const n = p * q;
console.log('n: ' + n);

//calculate Euler function
const ef = (p - 1) * (q - 1);
console.log('ef: ' + ef);

//choose е, so that 0 < e < ef and mutually prime with ef
const e = generateEncryptionExponent(ef);
console.log('e: ' + e);

//calculate d inverse to е modulo ef
const d = modInverse(e, ef);
console.log('d: ' + d);

//form public key
const publicKey = { e, n };
//form private key
const privateKey = { d, n };

//users
const userP = new P(publicKey, privateKey);
const userV = new V();

//P sends public key
const key = userP.sendPublicKey();

//V recieves public key
userV.recievePublicKey(key);
console.log('Exchanged publicKey');

//V choose r, sets it and calculates х
const x = userV.setRcalculateX();

//P calculates r'
const r = userP.calculateR(x);
console.log('r`: ' + r);

//V verifies
userV.verify(r);