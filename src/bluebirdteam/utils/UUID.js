const BinaryStream = require("../network/NetworkBinaryStream");

class UUID {
	parts = [0, 0, 0, 0];
	version;

	constructor(part1 = 0, part2 = 0, part3 = 0, part4 = 0, version = null) {
		this.parts = [part1, part2, part3, part4];
		this.version = version ? version : (part2 & 0xf000) >> 12;
	}

	getVersion() {
		return this.version;
	}

	equals(uuid) {
		if (uuid instanceof UUID) {
			return (
				uuid.parts[0] === this.parts[0] &&
				uuid.parts[1] === this.parts[1] &&
				uuid.parts[2] === this.parts[2] &&
				uuid.parts[3] === this.parts[3]
			);
		}
		return false;
	}

	static fromString(uuid, version) {
		return UUID.fromBinary(Buffer.from(uuid.trim().replace(/-/g, "")), version);
	}

	static fromBinary(buffer, version) {
		if (buffer.length !== 16) {
			throw new TypeError("UUID buffer must be exactly 16 bytes");
		}
		let stream = new BinaryStream(buffer);

		return new UUID(
			stream.readInt(),
			stream.readInt(),
			stream.readInt(),
			stream.readInt(),
			version
		);
	}

	getPart(i) {
		return this.parts[i] ? this.parts[i] : null;
	}
}

module.exports = UUID;
