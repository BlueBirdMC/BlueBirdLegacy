global.ucfirst = function (str) {
    str = str.split("");
    str[0] = str[0].toUpperCase();
    return str.join("");
}

global.base64_decode = function (str, strict) {
    let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "="];
    let yes = true;
    for (let i = 0; i < str.length; i++) {
        if (characters.indexOf(str[i]) === -1) yes = false;
    }
    if(strict === true) {
        if(yes === true) {
            return Buffer.from(str, "base64").toString("binary");
        } else {
            return false;
        }
    }
    return Buffer.from(str, "base64").toString("binary");
}

global.base64_encode = function (str) {
    return Buffer.from(str).toString("base64");
}

/**
 * PHP-like rounding added onto the Math object
 * @param value     {number}
 * @param precision {number}
 * @param mode      {string}
 * @return {Number}
 */

Math.round_php = function (value, precision = 0, mode = "ROUND_HALF_UP") {
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
        switch (mode) {
            case "ROUND_HALF_DOWN":
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case "ROUND_HALF_EVEN":
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case "ROUND_HALF_ODD":
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
}
