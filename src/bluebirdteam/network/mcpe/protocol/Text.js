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

class Text extends DataPacket {
	static NETWORK_ID = ProtocolInfo.TEXT;

	static TYPE_RAW = 0;

	static TYPE_CHAT = 1;

	static TYPE_TRANSLATION = 2;

	static TYPE_POPUP = 3;

	static TYPE_JUKEBOX_POPUP = 4;

	static TYPE_TIP = 5;

	static TYPE_SYSTEM = 6;

	static TYPE_WHISPER = 7;

	static TYPE_ANNOUNCEMENT = 8;

	static TYPE_JSON_WHISPER = 9;

	static TYPE_JSON = 10;

	/** @type {number} */
	type;
	/** @type {boolean} */
	needsTranslation = false;
	/** @type {string} */
	sourceName = "";
	/** @type {string} */
	message = "";
	/** @type {any} */
	parameters = [];
	/** @type {string} */
	xboxUserId = "";
	/** @type {string} */
	platformChatId = "";

	canBeSentBeforeLogin = true;

	decodePayload() {
		this.type = this.readByte();
		this.needsTranslation = this.readBool();
		switch (this.type) {
			case Text.TYPE_CHAT:
			case Text.TYPE_WHISPER:
			case Text.TYPE_ANNOUNCEMENT:
				this.sourceName = this.readString();
			case Text.TYPE_RAW:
			case Text.TYPE_TIP:
			case Text.TYPE_SYSTEM:
			case Text.TYPE_JSON_WHISPER:
			case Text.TYPE_JSON:
				this.message = this.readString();
				break;
			case Text.TYPE_TRANSLATION:
			case Text.TYPE_POPUP:
			case Text.TYPE_JUKEBOX_POPUP:
				this.message = this.readString();
				let count = this.readVarInt();
				for (let i = 0; i < count; ++i) {
					this.parameters.push(this.readString());
				}
				break;
		}

		this.xboxUserId = this.readString();
		this.platformChatId = this.readString();
	}

	encodePayload() {
		this.writeByte(this.type);
		this.writeBool(this.needsTranslation);
		switch (this.type) {
			case Text.TYPE_CHAT:
			case Text.TYPE_WHISPER:
			case Text.TYPE_ANNOUNCEMENT:
				this.writeString(this.sourceName);
			case Text.TYPE_RAW:
			case Text.TYPE_TIP:
			case Text.TYPE_SYSTEM:
			case Text.TYPE_JSON_WHISPER:
			case Text.TYPE_JSON:
				this.writeString(this.message);
				break;
			case Text.TYPE_TRANSLATION:
			case Text.TYPE_POPUP:
			case Text.TYPE_JUKEBOX_POPUP:
				this.writeString(this.message);
				this.writeVarInt(this.parameters.length);
				this.parameters.forEach((p) => this.writeString(p));
				break;
		}

		this.writeString(this.xboxUserId);
		this.writeString(this.platformChatId);
	}

	handle(handler) {
		return handler.handleText(this);
	}
}

module.exports = Text;
