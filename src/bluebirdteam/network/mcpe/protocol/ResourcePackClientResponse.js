const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class ResourcePackClientResponse extends DataPacket {
    static get NETWORK_ID(){ return ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE; }

    static get STATUS_REFUSED() {
        return 1;
    }

    static get STATUS_SEND_PACKS() {
        return 2;
    }

    static get STATUS_HAVE_ALL_PACKS() {
        return 3;
    }

    static get STATUS_COMPLETED() {
        return 4;
    }

    /** @type {number} */
    status = 0;
    /** @type {any} */
    packIds = [];

    decodePayload() {
        this.status = this.readByte();
        let entryCount = this.readLShort();
        while (entryCount-- > 0) {
            this.packIds.push(this.readString());
        }
    }

    encodePayload() {
        this.writeByte(this.status);
        this.writeLShort(this.packIds.length);
        this.packIds.forEach(id => {
            this.writeString(id);
        });
    }

    handle(handler) {
        return handler.handleResourcePackClientResponse(this);
    }
}

module.exports = ResourcePackClientResponse;