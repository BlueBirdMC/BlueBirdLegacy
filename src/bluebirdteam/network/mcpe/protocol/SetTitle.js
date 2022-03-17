/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class SetTitle extends DataPacket {
	static NETWORK_ID = ProtocolInfo.SET_TITLE;

	static TYPE_CLEAR_TITLE = 0;
	static TYPE_RESET_TITLE = 1;
	static TYPE_SET_TITLE = 2;
	static TYPE_SET_SUBTITLE = 3;
	static TYPE_SET_ACTIONBAR_MESSAGE = 4;
	static TYPE_SET_ANIMATION_TIMES = 5;
	static TYPE_SET_TITLE_JSON = 6;
	static TYPE_SET_SUBTITLE_JSON = 7;
	static TYPE_SET_ACTIONBAR_MESSAGE_JSON = 8;

	type;

	text = "";

	fadeInTime = 0;

	stayTime = 0;

	fadeOutTime = 0;

	xuid = "";

	platformOnlineId = "";

	decodePayload() {
		this.type = this.readSignedVarInt();
		this.text = this.readString();
		this.fadeInTime = this.readSignedVarInt();
		this.stayTime = this.readSignedVarInt();
		this.fadeOutTime = this.readSignedVarInt();
		this.xuid = this.readString();
		this.platformOnlineId = this.readString();
	}

	encodePayload() {
		this.writeSignedVarInt(this.type);
		this.writeString(this.text);
		this.writeSignedVarInt(this.fadeInTime);
		this.writeSignedVarInt(this.stayTime);
		this.writeSignedVarInt(this.fadeOutTime);
		this.writeString(this.xuid);
		this.writeString(this.platformOnlineId);
	}
}

module.exports = SetTitle;
