const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class PlayStatus extends DataPacket {
	static NETWORK_ID = ProtocolInfo.PLAY_STATUS;

	/** @type {number} */
	status;

	static LOGIN_SUCCESS = 0;

	static LOGIN_FAILED_CLIENT = 1;

	static LOGIN_FAILED_SERVER = 2;

	static PLAYER_SPAWN = 3;

	static LOGIN_FAILED_INVALID_TENANT = 4;

	static LOGIN_FAILED_VANILLA_EDU = 5;

	static LOGIN_FAILED_EDU_VANILLA = 6;

	canBeSentBeforeLogin = true;

	decodePayload() {
		this.status = this.readInt();
	}

	encodePayload() {
		this.writeInt(this.status);
	}
}

module.exports = PlayStatus;
