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

class ResourcePacksInfo extends DataPacket {
	static NETWORK_ID = ProtocolInfo.RESOURCE_PACKS_INFO;

	/** @type {boolean} */
	mustAccept = false;
	/** @type {boolean} */
	hasScripts = false;
	/** @type {boolean} */
	forceServerPacks = false;

	/** @type {any} */
	behaviorPackEntries = [];
	/** @type {any} */
	resourcePackEntries = [];

	canBeSentBeforeLogin = true;

	decodePayload() {
		this.mustAccept = this.readBool();
		this.hasScripts = this.readBool();
		this.forceServerPacks = this.readBool();
		let behaviourPackCount = this.readShortLE();
		while (behaviourPackCount-- > 0) {
			this.readString();
			this.readString();
			this.readLongLE();
			this.readString();
			this.readString();
			this.readString();
			this.readBool();
		}

		let resourcePackCount = this.readShortLE();
		while (resourcePackCount-- > 0) {
			this.readString();
			this.readString();
			this.readLongLE();
			this.readString();
			this.readString();
			this.readString();
			this.readBool();
			this.readBool();
		}
	}

	encodePayload() {
		this.writeBool(this.mustAccept);
		this.writeBool(this.hasScripts);
		this.writeBool(this.forceServerPacks);
		this.writeShortLE(this.behaviorPackEntries.length);
		this.behaviorPackEntries.forEach(() => {
			this.writeString("");
			this.writeString("");
			this.writeLLong(0);
			this.writeString("");
			this.writeString("");
			this.writeString("");
			this.writeBool(false);
		});
		this.writeShortLE(this.resourcePackEntries.length);
		this.resourcePackEntries.forEach(() => {
			this.writeString("");
			this.writeString("");
			this.writeLongLE(0);
			this.writeString("");
			this.writeString("");
			this.writeString("");
			this.writeBool(false);
			this.writeBool(false);
		});
	}
}

module.exports = ResourcePacksInfo;
