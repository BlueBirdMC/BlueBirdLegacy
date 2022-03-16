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

const BinaryStream = require("bbmc-binarystream");
const lib = require("uuid-js");
const {bin2hex} = require("locutus/php/strings");

class UUID {

	/** @type {number[]} */
	parts;
	/** @type {number} */
	version;

	constructor(part1 = 0, part2 = 0, part3 = 0, part4 = 0, version = null) {
		this.parts = [part1, part2, part3, part4];

		this.version = version || (this.parts[1] & 0xf000) >> 12;
	}

	getVersion() {
		return this.version;
	}

	equals(uuid) {
		return uuid.parts === this.parts;
	}

	static fromString(uuid, version = null) {
		return UUID.fromBinary(Buffer.from(uuid.trim().replace(/-/g, ""), "hex"), version);
	}

	static fromBinary(uuid, version) {
		if (uuid.length !== 16) {
			throw new TypeError("UUID buffer must be exactly 16 bytes");
		}
		let stream = new BinaryStream(Buffer.from(uuid));
		return new UUID(stream.readIntBE(), stream.readIntBE(), stream.readIntBE(), stream.readIntBE(), version);
	}

	static fromRandom() {
		return lib.create(4);
	}

	toBinary(){
		let stream = new BinaryStream();
		stream.writeIntBE(this.parts[0] + this.parts[1] + this.parts[2] + this.parts[3]);
		return stream;
	}

	toString(){
		let b = bin2hex(this.toBinary());
		return b.substr(0, 8) + "-" + b.substr(8, 4) + b.substr(12, 4) + "-" + b.substr(16, 4) + b.substr(20, 12);
	}

	getPart(partNumber) {
		if (partNumber < 0 || partNumber > 3) {
			throw new Error(`Invalid UUID part index ${partNumber}`);
		}
		return this.parts[partNumber];
	}

	getParts() {
		return this.parts;
	}
}

module.exports = UUID;