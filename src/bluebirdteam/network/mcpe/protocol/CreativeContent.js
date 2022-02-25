const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class CreativeContent extends DataPacket {
    static NETWORK_ID = ProtocolInfo.CREATIVE_CONTENT;

    canBeSentBeforeLogin(){
        return true;
    }

    encodePayload() {
        this.writeUnsignedVarInt(0);
    }

    handle(handler) {
        return false;
    }
}

module.exports = CreativeContent;