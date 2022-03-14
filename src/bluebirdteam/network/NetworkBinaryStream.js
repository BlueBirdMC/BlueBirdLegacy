const UUID = require("../utils/UUID");

class NetworkBinaryStream extends require("bluebirdmc-binarystream") {
	/**
	 * @return {String}
	 */
	readString() {
		return this.read(this.readUnsignedVarInt()).toString();
	}

	/**
	 * @param v {String}
	 * @return {NetworkBinaryStream}
	 */
	writeString(v) {
		this.writeUnsignedVarInt(Buffer.byteLength(v));
		if (v.length === 0) {
			return this;
		}
		this.append(Buffer.from(v, "utf8"));
		return this;
	}

	/**
	 * @return {UUID}
	 */
	readUUID() {
		let [p1, p0, p3, p2] = [
			this.readLInt(),
			this.readLInt(),
			this.readLInt(),
			this.readLInt(),
		];

		return new UUID(p0, p1, p2, p3);
	}

	/**
	 * @param uuid {UUID}
	 * @return {NetworkBinaryStream}
	 */
	writeUUID(uuid) {
		this.writeLInt(uuid.getPart(1));
		this.writeLInt(uuid.getPart(0));
		this.writeLInt(uuid.getPart(3));
		this.writeLInt(uuid.getPart(2));

		return this;
	}
}
module.exports = NetworkBinaryStream;
