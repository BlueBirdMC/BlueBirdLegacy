const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class ResourcePackStack extends DataPacket {
	static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_STACK;

	/** @type {boolean} */
	mustAccept = false;

	/** @type {any} */
	behaviorPackStack = [];
	/** @type {any} */
	resourcePackStack = [];

	/** @type {string} */
	baseGameVersion = ProtocolInfo.MINECRAFT_VERSION;
	/** @type {boolean} */
	experimentsPreviouslyUsed = false;

	canBeSentBeforeLogin = true;

	decodePayload() {
		this.mustAccept = this.readBool();
		let behaviorPackCount = this.readUnsignedVarInt();
		while (behaviorPackCount-- > 0) {
			this.readString();
			this.readString();
			this.readString();
		}

		let resourcePackCount = this.readUnsignedVarInt();
		while (resourcePackCount-- > 0) {
			this.readString();
			this.readString();
			this.readString();
		}

		this.baseGameVersion = this.readString();
		let experimentsCount = this.readLInt();
		while (experimentsCount-- > 0) {
			this.readString();
			this.readBool();
		}
		this.experimentsPreviouslyUsed = this.readBool();
	}

	encodePayload() {
		this.writeBool(this.mustAccept);

		this.writeUnsignedVarInt(this.behaviorPackStack.length);
		this.behaviorPackStack.forEach(() => {
			this.writeString("");
			this.writeString("");
			this.writeString("");
		});

		this.writeUnsignedVarInt(this.resourcePackStack.length);
		this.resourcePackStack.forEach(() => {
			this.writeString("");
			this.writeString("");
			this.writeString("");
		});

		this.writeString(this.baseGameVersion);
		this.writeLInt(0); // experiments count
		this.writeBool(this.experimentsPreviouslyUsed);
	}
}

module.exports = ResourcePackStack;
