// function to check if the number is prime
const checkPrime = num => {
    let max = Math.sqrt(num) + 1;
    for (let i = 2; i < max; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// function to generate pseudorandom number in certain interval
const generateRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// finding s and t in size 6 (32) - 10 (1023) bits
const calculatePrime = () => {
    // choosing pseudoRandom number
    let random = generateRandom(32, 1023);
    // calculating interval
    let interval = Math.ceil(random + Math.log2(random));

    // finding prime number
    for (let i = random; i < interval; i++) {
        if (checkPrime(i)) return i;
    }
    return calculatePrime();
};

const s = calculatePrime();
const t = calculatePrime();

// calculating r by formula
const calculateR = t => {
    let max = Math.ceil(Math.log2(t));
    let r;
    for (let l = 1; l < max; l++) {
        r = 1 + 2 * l * t;
        if (checkPrime(r)) return r;
    }
}

const r = calculateR(t);

console.log('s ' + s);
console.log('t ' + t);
console.log('r ' + r);

// function tu calculate modulo
function powerMod(base, exponent, modulus) {
    if (modulus === 1) return 0;
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1)
            result = (result * base) % modulus;
        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

// calculate р0
const calculateP = (r, s) => {
    let num = powerMod(s, r - 2, r);
    //calculate u
    let u = 2 * num * s - 1;
    if (u % 2 === 0) {
        return u + r * s;
    } 
    return u;
}

const p0 = calculateP(r, s);

// testing prime р0 + 2*k*r*s till finding strong prime
const calculateStrongPrime = (p0) => {
    let k = 0;
    let strongPrime = p0;

    while (!checkPrime(strongPrime)) {
        k++;
        strongPrime = strongPrime + 2 * k * r * s;
    }
    return strongPrime;
}

const strongPrime = calculateStrongPrime(p0);
console.log('p ' + strongPrime);


// Rabin-Miller test
function rabinMillerTest(n) { 
    let d = n - 1;
    while (d % 2 == 0)
        d /= 2;
    
    //calculate pseudorandom remainder a
    let a = 2 + Math.floor(Math.random() * (n-2)) % (n - 4);
 
    // calculate a^d % n
    let x = powerMod(a, d, n);
 
    // if condition is true, number isn't prime
    if (x == 1 || x == n-1)
        return true;
 
    // Repeating loop till
    // d not equals n-1
    // (x^2) % n not 1
    // (x^2) % n not n-1
    while (d != n-1)
    {
        x = (x * x) % n;
        d *= 2;
 
        if (x == 1)    
            return true;
        if (x == n - 1)
            return true;
    }
 
    return false;
}

//testing
const test = (k, p) => {
    for (let i = 0; i < k; i++)
    if (!rabinMillerTest(p)) return 'Not prime';
    return 'Prime';
}

const precision = 2;
console.log(test(precision, strongPrime));