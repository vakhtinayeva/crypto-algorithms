class DH { 
    private key: number = 0;
    private privateKey: number = 0;

    constructor(
        private readonly publicKey1: number, 
        private readonly publicKey2: number,
    ) {
        // p
        this.publicKey1 = publicKey1;
        // g
        this.publicKey2 = publicKey2;
    }

    //generate private x as random remainder modulo p-1
    generatePrivateKey() {
        const random = (Math.floor(Math.random() * (this.publicKey2 - 2)) + 1);
        const privateKey = random  % (this.publicKey2 - 1);
        console.log("Private key: " + privateKey);
        this.privateKey = privateKey;
    }
    
    //calculate у = g^x (modp)
    generatePartialKey() {
        let partialKey = this.publicKey1 ** this.privateKey % this.publicKey2;
        return partialKey;
    }
    
    //calculate к = у^x (modp) 
    generateKey(partialKey: number) {
        let key = partialKey ** this.privateKey % this.publicKey2;
        this.key = key;
        return key;
    }
    
    //test encryption
    encryptMessage(message: string) {
        let encrypted = "";
        let key = this.key;
        
        for (let i = 0; i < message.length; i++) {
            encrypted += String.fromCharCode(message.charCodeAt(i) + key);
        }
        return encrypted;
    }
    
    //test decryption
    decryptMessage(encryptedMessage: string) {
        let decrypted = "";
        let key = this.key;

        for (let i = 0; i < encryptedMessage.length; i++) {
            decrypted += String.fromCharCode(encryptedMessage.charCodeAt(i) - key);
        }
        return decrypted;
    }
}

// p and g 
const p = 29;
const g = 8;

// 2 class instances as 2 users, а and b
const a = new DH(g, p);
const b = new DH(g, p);

//generate private keys
a.generatePrivateKey();
b.generatePrivateKey();

//calculate у as partial key
const aPartial = a.generatePartialKey();
console.log("Partial key ya: " + aPartial);
const bPartial = b.generatePartialKey();
console.log("Partial key yb: " + bPartial);

//exchange partial keys and generate full
const aKey = a.generateKey(bPartial);
console.log("Key ka: " + aKey);
const bKey = b.generateKey(aPartial);
console.log("Key kb: " + bKey);

//test encryption/decryption
const text = "Вахтіна Єва Олексіївна";
console.log("Message: " + text);

const encryptedA = a.encryptMessage(text);
console.log("Encrypted A: " + encryptedA);
const encryptedB = b.encryptMessage(text);
console.log("Encrypted B: " + encryptedB);

const decryptedA = a.decryptMessage(encryptedB);
console.log("Decrypted A: " + decryptedA);
const decryptedB = b.decryptMessage(encryptedA);
console.log("Decrypted B: " + decryptedB);
