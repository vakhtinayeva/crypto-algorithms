const BN = require("bignumber.js");

//sum modulo
const addmod = (x, y, n) => {
  if (x + y <= x) {
      x = x - (n - y) % n;
  } else {
      x = (x + y) % n;
  }
  return x;
}

//square modulo
const sqrmod = (a, n) => {
  let b;
  let sum = 0;

  //check for а < n
  a = a % n;

  //implement algorithm double and add to calculate a*a mod n
  for (b = a; b != 0; b >>= 1) {
      if (b & 1) {
          sum = addmod(sum, a, n);
      }
      a = addmod(a, a, n);
    }
    return sum;
}

//calculate number in power modulo
const powMod = (base, ex, mo) => {
  //anything in power 0 is 1
  if (ex === 0) {
      return 1;
  } else if (ex % 2 === 0) {
      //if power is even calculate for power/2
      //than calculate result in power 2 modulo: (r * r) % mo
      let r = powMod(base, ex/2, mo) % mo ;
      return sqrmod(r, mo);
  } else {
      //otherwise start recursion with power-1 till reaching 1
      return (base * powMod(base, ex - 1, mo)) % mo;
  }
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

//inverse modulo
function findInverse(number, modulo) {
  const xgcdBN = (a, b) => {
    if (b.isEqualTo(0)) {
      return [1, 0];
    }

    const [x, y] = xgcdBN(
      b,
      a.minus(a.dividedBy(b).integerValue(BN.ROUND_FLOOR).multipliedBy(b))
    );

    return [
      y,
      x.minus(y.multipliedBy(a.dividedBy(b).integerValue(BN.ROUND_FLOOR)))
    ];
  };

  const [result] = xgcdBN(number, modulo);
  return result;
}

//modulo
function getModulo(bigNumber, modulo) {
  if (bigNumber.isGreaterThanOrEqualTo(0)) {
    return bigNumber.modulo(modulo);
  }

  return modulo
    .minus(bigNumber.multipliedBy(-1).mod(modulo))
    .mod(modulo);
}
//function to generate pseudorandom number in [min, max]
const generateRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = { findInverse, getModulo, calculateGreatestCommonDevisor, powMod, generateRandom };