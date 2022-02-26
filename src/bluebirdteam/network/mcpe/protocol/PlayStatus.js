const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class PlayStatus extends DataPacket {

    static get NETWORK_ID(){ return ProtocolInfo.PLAY_STATUS; }

    /** @type {number} */
    status;

    static get LOGIN_SUCCESS() {
        return 0;
    }

    static get LOGIN_FAILED_CLIENT() {
        return 1;
    }

    static get LOGIN_FAILED_SERVER() {
        return 2;
    }

    static get PLAYER_SPAWN() {
        return 3;
    }

    static get LOGIN_FAILED_INVALID_TENANT() {
        return 4;
    }

    static get LOGIN_FAILED_VANILLA_EDU() {
        return 5;
    }

    static get LOGIN_FAILED_EDU_VANILLA() {
        return 6;
    }

    canBeSentBeforeLogin() {
        return true;
    }

    decodePayload() {
        this.status = this.readInt();
    }

    encodePayload() {
        this.writeInt(this.status);
    }

    handle(handler) {
        return handler.handlePlayStatus(this);
    }
}

module.exports = PlayStatus;