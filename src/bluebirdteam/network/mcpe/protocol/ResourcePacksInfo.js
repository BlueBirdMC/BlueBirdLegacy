import DataPacket from './DataPacket.js';
import { ProtocolInfo } from './ProtocolInfo.js';

class ResourcePacksInfo extends DataPacket {
    static get NETWORK_ID() { return ProtocolInfo.RESOURCE_PACKS_INFO; }

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

    canBeSentBeforeLogin(){
        return true;
    }

    decodePayload() {
        this.mustAccept = this.readBool();
        this.hasScripts = this.readBool();
        this.forceServerPacks = this.readBool();
        let behaviourPackCount = this.readLShort();
        while (behaviourPackCount-- > 0) {
            this.readString();
            this.readString();
            this.readLLong();
            this.readString();
            this.readString();
            this.readString();
            this.readBool();
        }

        let resourcePackCount = this.readLShort();
        while (resourcePackCount-- > 0) {
            this.readString();
            this.readString();
            this.readLLong();
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
        this.writeLShort(this.behaviorPackEntries.length);
        this.behaviorPackEntries.forEach(() => {
            this.writeString("");
            this.writeString("");
            this.writeLLong(0);
            this.writeString("");
            this.writeString("");
            this.writeString("");
            this.writeBool(false);
        });
        this.writeLShort(this.resourcePackEntries.length);
        this.resourcePackEntries.forEach(() => {
            this.writeString("");
            this.writeString("");
            this.writeLLong(0);
            this.writeString("");
            this.writeString("");
            this.writeString("");
            this.writeBool(false);
            this.writeBool(false);
        });
    }
}

export default ResourcePacksInfo;
