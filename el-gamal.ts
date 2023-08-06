//define constants and types
const g = 8;
const p = 29;

type publicKey = {
    p: number,
    g: number,
    h: number
};

type encryptedMessage = {
    c1: number,
    c2: string,
}

//additional functions
//function to generate pseudorandom muber in certain interval
const generateRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//function to calculate GCD
const calculateGreatestCommonDevisor = (a: number, b: number): number => {
    if (a < b) {
        return calculateGreatestCommonDevisor(b, a);
    } else if (a % b === 0) {
        return b;
    } else {
        return calculateGreatestCommonDevisor(b, a % b);
    }
}

//generate private x in [1, p-2]
const generatePrivateKey = (p: number): number => {
    const privateKey = generateRandom(1, p - 2);
    return privateKey;
}

//calculate h = g^x modp and form public key
const generatePublicKey = (g: number, p: number, privateKey: number) => {
    let h = Math.pow(g, privateKey) % p;
    return {p, g, h};
}

//шифрування
const encryption = (message: string, publicKey: publicKey) => {
    const { p, g, h } = publicKey;

    //calculate r in [1, p-1] so that (r, p-1) = 1
    let r = generateRandom(1, p - 1) % (p - 1);
    while (calculateGreatestCommonDevisor(r, p - 1) !== 1) {
        r = generateRandom(1, p - 1) % (p - 1);
    }

    //calculate с1 = g^r modp
    let c1 = Math.pow(g, r) % p;
    //calculate h^r modp
    let key = Math.pow(h, r) % p;

    //encrypt
    let c2 = "";
    for (let i = 0; i < message.length; i++) {
        c2 += String.fromCharCode(message.charCodeAt(i) * key);
    }
    return { c1, c2 };
}

//decrypt
const decryption = (encryptedMessage: encryptedMessage, privateKey: number, p: number) => {
    const { c1, c2 } = encryptedMessage;

    //with х calculate key to decrypt с1^x modp
    let key = Math.pow(c1, privateKey) % p;

    //decrypt
    let decrypted = "";
    for (let i = 0; i < c2.length; i++) {
        decrypted += String.fromCharCode(c2.charCodeAt(i) / key);
    }
    return decrypted;
}

//user 1 generates private key
const privateKey = generatePrivateKey(p);
console.log('Private key: ' + privateKey);

//user 1 calculates h and forms public key
const curPublicKey = generatePublicKey(g, p, privateKey);
console.log('Public key: ' + JSON.stringify(curPublicKey));

//user 2 recieves public key and encrypts secret message
const text = "Вахтіна Єва Олексіївна";
const encryptedText = encryption(text, curPublicKey);
console.log('Message: ' + text);
console.log('Encrypted message: ' + JSON.stringify(encryptedText));

//user 1 recieves encrypted message
//and uses its private key to decrypt it
const decryptedText = decryption(encryptedText, privateKey, p);
console.log('Decrypted message: ' + decryptedText);
