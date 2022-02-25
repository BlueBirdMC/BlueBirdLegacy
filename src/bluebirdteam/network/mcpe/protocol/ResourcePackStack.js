const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class ResourcePackStack extends DataPacket {
    static get NETWORK_ID(){ return ProtocolInfo.RESOURCE_PACK_STACK; }

    /** @type {boolean} */
    mustAccept = false;

    /** @type {any} */
    behaviorPackStack = [];
    /** @type {any} */
    resourcePackStack = [];

    /** @type {boolean} */
    isExperimental = false;
    /** @type {string} */
    baseGameVersion = ProtocolInfo.VERSION;

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

        this.isExperimental = this.readBool();
        this.baseGameVersion = this.readString();
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

        this.writeBool(this.isExperimental);
        this.writeString(this.baseGameVersion);
    }
}

module.exports = ResourcePackStack;