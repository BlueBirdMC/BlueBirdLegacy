const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class DisconnectPacket extends DataPacket {
    static get NETWORK_ID() { return ProtocolInfo.DISCONNECT_PACKET; }

    hideDisconnectionScreen = false;
    message = "";

    canBeSentBeforeLogin() {
        return true;
    }

    decodePayload() {
        this.hideDisconnectionScreen = this.readBool();
        if (!this.hideDisconnectionScreen) {
            this.message = this.readString();
        }
    }
}

module.exports = DisconnectPacket;