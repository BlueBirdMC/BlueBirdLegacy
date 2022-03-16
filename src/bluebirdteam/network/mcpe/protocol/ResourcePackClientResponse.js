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

class ResourcePackClientResponse extends DataPacket {
	static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE;

	static STATUS_REFUSED = 1;

	static STATUS_SEND_PACKS = 2;

	static STATUS_HAVE_ALL_PACKS = 3;

	static STATUS_COMPLETED = 4;

	/** @type {number} */
	status = 0;
	/** @type {any} */
	packIds = [];

	decodePayload() {
		this.status = this.readByte();
		let entryCount = this.readShortLE();
		while (entryCount-- > 0) {
			this.packIds.push(this.readString());
		}
	}

	encodePayload() {
		this.writeByte(this.status);
		this.writeShortLE(this.packIds.length);
		this.packIds.forEach((id) => {
			this.writeString(id);
		});
	}

	handle(handler) {
		return handler.handleResourcePackClientResponse(this);
	}
}

module.exports = ResourcePackClientResponse;
