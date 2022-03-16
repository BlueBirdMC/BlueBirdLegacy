/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
 \******************************************/

global.ucfirst = function (str) {
	str = str.split("");
	str[0] = str[0].toUpperCase();
	return str.join("");
};

global.lcfirst = function (str) {
	str = str.split("");
	str[0] = str[0].toLowerCase();
	return str.join("");
};

global.base64_decode = function (str, strict) {
	let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "=",];
	let yes = true;
	for (let i = 0; i < str.length; i++) {
		if (characters.indexOf(str[i]) === -1) yes = false;
	}
	if (strict === true) {
		if (yes === true) {
			return Buffer.from(str, "base64").toString("binary");
		} else {
			return false;
		}
	}
	return Buffer.from(str, "base64").toString("binary");
};

global.base64_encode = function (str) {
	return Buffer.from(str).toString("base64");
};

global.CheckTypes = function (...args) {
	if (args.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");

	args.forEach(arg => {
		if (!(arg instanceof Array)) {
			throw new TypeError("Expecting Array, got " + (arg.constructor.name ? arg.constructor.name : arg.name));
		}

		if (typeof arg[0] === "undefined" || typeof arg[1] === "undefined") {
			throw new TypeError("Expecting Array with two items. Example: [Object, myObjectVar]");
		}

		let type = arg[0];
		let item = arg[1];

		if (
			!(item instanceof type) &&
			(item.constructor.name !== type.name && item.constructor !== type)
		) {
			throw new TypeError("Expecting " + type.name + ", got " + item.constructor.name);
		}
	});
	return true;
};