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

const DataPacket = require("./DataPacket");
const assert = require("assert");
const Zlib = require("zlib");
const BinaryStream = require("../../NetworkBinaryStream");

class GamePacket extends DataPacket {
	static NETWORK_ID = 0xfe;

	payload = new BinaryStream();

	compressionLevel = 7;

	canBeBatched = false;

	canBeSentBeforeLogin = true;

	decodeHeader() {
		let pid = this.readUnsignedByte();
		assert(pid === this.constructor.NETWORK_ID);
	}

	decodePayload() {
		let data = this.readRemaining();
		try {
			this.payload = new BinaryStream(Zlib.inflateRawSync(data, {level: this.compressionLevel, maxOutputLength: 1024 * 1024 * 2}));
		} catch (e) {
			//zlib decode error
			this.payload = new BinaryStream();
		}
	}

	encodeHeader() {
		this.writeUnsignedByte(this.constructor.NETWORK_ID);
	}

	encodePayload() {
		let buf = Zlib.deflateRawSync(this.payload.buffer, {level: this.compressionLevel});
		this.write(buf);
	}

	addPacket(packet) {
		if (!packet.canBeBatched) {
			throw new Error(packet.getName() + " cant be batched");
		}
		if (!packet.isEncoded) {
			packet.encode();
		}

		this.payload.writeVarInt(packet.buffer.length);
		this.payload.write(packet.buffer);
	}

	getPackets() {
		let pks = [];
		while (!this.payload.feos()) {
			pks.push(this.payload.read(this.payload.readVarInt()));
		}
		return pks;
	}

	handle(handler) {
		if (this.payload.buffer.length === 0) {
			return false;
		}
		this.getPackets().forEach((buf) => {
			let pk = handler.raknetAdapter.packetPool.getPacket(buf[0]);
			console.log("MINECRAFT PACKET: 0x" + buf.slice(0, 1).toString("hex"));
			if (pk instanceof DataPacket) {
				if (!pk.canBeBatched) {
					throw new Error("Received invalid " + pk.getName() + " inside GamePacket");
				}
				pk.buffer = buf;
				pk.offset = 1;
				handler.handleDataPacket(pk);
			} else {
				console.log(buf);
			}
		});
		return true;
	}
}

module.exports = GamePacket;
