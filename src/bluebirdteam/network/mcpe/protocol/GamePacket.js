const DataPacket = require("./DataPacket");
const assert = require("assert");
const Zlib = require("zlib");
const PacketPool = require("./PacketPool");
const BinaryStream = require("bluebirdmc-binarystream")
const {count} = require("locutus/php/array");

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
        if (!packet.canBeBatched()) {
            throw new Error(packet.getName() + " cant be batched");
        }
        if (!packet.isEncoded) {
            packet.encode();
        }

        this.payload = this.writeUnsignedVarInt(packet.length);
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
            let packetPool = new PacketPool();
            let pk = packetPool.getPacket(buf);
            if(count(pk) > 0){
                if (!pk.canBeBatched) {
                    throw new Error("Received invalid " + pk.getName() + " inside GamePacket");
                }
            }

            return handler.handleGamePacket(this);
        });
    }
}

module.exports = GamePacket;