const DataPacket = require("./DataPacket");
const assert = require("assert");
const Zlib = require("zlib");
const PacketPool = require("./PacketPool");
const BinaryStream = require("bluebirdmc-binarystream");

class GamePacket extends DataPacket {

    static get NETWORK_ID() {
        return 0xFE;
    }

    payload = "";

    compressionLevel = 7;

    canBeBatched() {
        return false;
    }

    canBeSentBeforeLogin() {
        return true;
    }

    decodeHeader() {
        let pid = this.readByte();
        assert(pid === this.constructor.NETWORK_ID);
    }

    decodePayload() {
        let data = this.readRemaining();
        try {
            this.payload = new BinaryStream(Zlib.inflateRawSync(data, {level: this.compressionLevel, maxOutputLength: 1024 * 1024 * 2}));
        } catch (e) { //zlib decode error
            this.payload = "";
        }
    }

    encodeHeader() {
        this.writeByte(this.constructor.NETWORK_ID);
    }

    encodePayload() {
        let buf = Zlib.deflateRawSync(this.payload.getBuffer(), {level: this.compressionLevel});
        this.append(buf);
    }

    addPacket(packet) {
        if (!packet.canBeBatched) {
            throw new Error(packet.getName() + " cant be batched");
        }
        if (!packet.isEncoded) {
            packet.encode();
        }

        this.payload = this.writeUnsignedVarInt(packet.buffer.length);
        this.payload.append(packet.getBuffer());
    }

    getPackets() {
        let pks = [];
        while (!this.payload.feof()) {
            pks.push(this.payload.read(this.payload.readUnsignedVarInt()));
        }
        return pks;
    }

    getCompressionLevel() {
        return this.compressionLevel;
    }

    setCompressionLevel(level) {
        this.compressionLevel = level;
    }

    handle(handler) {
        if (this.payload === "") {
            return false;
        }
        this.getPackets().forEach(buf => {
            let pk = handler.raknetAdapter.packetPool.getPacket(buf[0]);
            if (pk instanceof DataPacket) {
                if (!pk.canBeBatched) {
                    throw new Error("Received invalid " + pk.getName() + " inside BatchPacket");
                }

                pk.setBuffer(buf, 1);
                handler.handleDataPacket(pk);
            } else {
                console.log("MINECRAFT PACKET: 0x" + buf.slice(0, 1).toString("hex"));
            }

        });
        return true;
    }
}

module.exports = GamePacket;