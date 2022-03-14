const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class DisconnectPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.DISCONNECT_PACKET;

    hideDisconnectionScreen = false;
    message = "";

    canBeSentBeforeLogin = true;

    decodePayload() {
        this.hideDisconnectionScreen = this.readBool();
        if (!this.hideDisconnectionScreen) {
            this.message = this.readString();
        }
    }

    encodePayload() {
        this.writeBool(this.hideDisconnectionScreen);
        if(!this.hideDisconnectionScreen){
            this.writeString(this.message);
        }
    }
}

module.exports = DisconnectPacket;