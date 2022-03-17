const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class SetLocalPlayerAsInitialized extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SET_LOCAL_PLAYER_AS_INITIALIZED;

    entityRuntimeId;

    decodePayload() {
        this.entityRuntimeId = this.readVarLong();
    }

    encodePayload() {
        this.writeVarLong(this.entityRuntimeId);
    }
}

module.exports = SetLocalPlayerAsInitialized;