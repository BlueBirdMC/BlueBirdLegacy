import DataPacket from './DataPacket.js';
import assert from 'assert';
import Zlib from 'zlib';
import BinaryStream from '../../NetworkBinaryStream.cjs';

class GamePacket extends DataPacket {

    static get NETWORK_ID() { return 0xFE; }

    payload = new BinaryStream();

    compressionLevel = 7;

    canBeBatched = false;

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
            this.payload = new BinaryStream();
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

        this.writeUnsignedVarInt(packet.buffer.length);
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
        if (this.payload.length === 0) {
            return false;
        }
        this.getPackets().forEach(buf => {
            let pk = handler.raknetAdapter.packetPool.getPacket(buf[0]);
            if (pk instanceof DataPacket) {
                if (!pk.canBeBatched) {
                    throw new Error("Received invalid " + pk.getName() + " inside GamePacket");
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

export default GamePacket;