const g = 8;
const p = 29;

//function to generate pseudorandom number in certain interval
const generateRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//function to calculate GCD
const calculateGreatestCommonDevisor = (a, b) => {
    if (a < b) {
        return calculateGreatestCommonDevisor(b, a);
    } else if (a % b === 0) {
        return b;
    } else {
        return calculateGreatestCommonDevisor(b, a % b);
    }
}

//function to calculate k^-1
const modInverse = (a, m) => {
    for(let x = 1; x < m; x++)
        if (((a % m) * (x % m)) % m == 1)
            return x;
}

//generate private x in [1, p-2]
const generatePrivateKey = (p) => {
    const privateKey = generateRandom(1, p - 2);
    return privateKey;
}

//calculate h = g^x modp and form public key
const generatePublicKey = (g, p, privateKey) => {
    let y = Math.pow(g, privateKey) % p;
    return {p, g, y};
}

//function to hash
const hashFunction = (message, p) => {
    let num = (Math.pow(message, 3) + 9) % (p - 1);
    return num;
}

//create signature
const sign = (message, publicKey, privateKey) => {
    const { p, g, y } = publicKey;
    const m = hashFunction(message, p);

    //calculate k in [1, p-1] so that (r, p-1) = 1
    let k = generateRandom(1, p - 1) % (p - 1);
    while (calculateGreatestCommonDevisor(k, p - 1) !== 1) {
        k = generateRandom(1, p - 1) % (p - 1);
    }

    //calculate r = g^k modp
    let r = Math.pow(g, k) % p;

    //calculate к^-1
    const k1 = modInverse(k, p - 1);

    //calculate s
    const s = ((p - 1) + (k1 * (m - privateKey * r)) % (p - 1)) % (p - 1);
    return { r, s };
}

//decrypt
const verify = (message, signature, publicKey) => {
    const { p, g, y } = publicKey;
    const { r, s } = signature;
    const m = hashFunction(message, p);

    let num1 = Math.pow(g, m) % p;
    const num = (BigInt(y) ** BigInt(r)) * (BigInt(r) ** BigInt(s)) % BigInt(p);
    let num2 = num.toString();

    return num1 == num2;
}


//user1 generates private key
const privateKey = generatePrivateKey(p);
console.log('Private key: ' + privateKey);

//user1 calculates h and forms public key
const curPublicKey = generatePublicKey(g, p, privateKey);
console.log('Public key: ' + JSON.stringify(curPublicKey));

//message and signature
const text = 45456;
const signature = sign(text, curPublicKey, privateKey);
console.log('Message: ' + text);
console.log('Signature: ' + JSON.stringify(signature));


//verification
const verification = verify(text, signature, curPublicKey);
console.log('Verified: ' + verification);