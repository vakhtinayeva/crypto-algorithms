//function для calculate GCD
const calculateGreatestCommonDevisor = (a, b) => {
    if (a < b) {
        return calculateGreatestCommonDevisor(b, a);
    } else if (a % b === 0) {
        return b;
    } else {
        return calculateGreatestCommonDevisor(b, a % b);
    }
}

// function to generate pseudorandom number in [min, max]
const generateRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//function to calculate k^-1
const modInverse = (a, m) => {
    for(let x = 1; x < m; x++)
        if (((a % m) * (x % m)) % m == 1)
            return x;
}

//фfunction to calculate v
const calculateV = n => {
    let v = generateRandom(2, n - 1);
    while (calculateGreatestCommonDevisor(v, n) !== 1 || !Number.isInteger(Math.sqrt(v % n)) || !modInverse(v, n)) {
        v = generateRandom(2, n-1);
    }
    return v;
}

//classes to simulate users Р і V
class P {
    r = 0;
    x = 0;
    b = 0;
    y = 0;

    setB(b) {
        this.b = b;
    }

    setRcalculateX() {
        const r = generateRandom(2, n - 1);
        this.r = r;
        const x = Math.pow(r, 2) % n;
        this.x = x;
        return x;
    }

    calculateY(s) {
        const y = this.r * Math.pow(s, this.b);
        this.y = y;
        return y;
    }
}

class V {
    x = 0;
    y = 0;
    b = 0;

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    chooseRandomBit() {
        const b = generateRandom(0, 1);
        this.b = b;
        return b;
    }

    verify(v, n) {
        const check = (Math.pow(this.y, 2) * Math.pow(v, this.b)) % n;
        console.log('x`: ' + check);
        const verified = (this.x === check);
        return verified;
    }
}


//2 random primes
const p = 61;
const q = 53;

//calculate n
const n = p * q;
console.log('n: ' + n);

//calculate v, mutually prime with n
const v = calculateV(n);
console.log('v: ' + v);

//calculate s
const s = (modInverse(v, n) * Math.sqrt(v)) % n;
console.log('s: ' + s);

//users
const userP = new P();
const userV = new V();

//find random r to calculate x
const x = userP.setRcalculateX();
userV.setX(x);
console.log('x: ' + x);

//find random b equaling 0 або 1
const b = userV.chooseRandomBit();
userP.setB(b);
console.log('b ' + b);

//calculate y
const y = userP.calculateY(s);
userV.setY(y);
console.log('y ' + y);

//verify х
const verified = userV.verify(v, n); 
console.log('Verified: ' + verified);