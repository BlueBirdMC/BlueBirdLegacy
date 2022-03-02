const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class Text extends DataPacket{
    static get NETWORK_ID(){ return ProtocolInfo.TEXT; }

    static get TYPE_RAW() {
        return 0;
    }

    static get TYPE_CHAT() {
        return 1;
    }

    static get TYPE_TRANSLATION() {
        return 2;
    }

    static get TYPE_POPUP() {
        return 3;
    }

    static get TYPE_JUKEBOX_POPUP() {
        return 4;
    }

    static get TYPE_TIP() {
        return 5;
    }

    static get TYPE_SYSTEM() {
        return 6;
    }

    static get TYPE_WHISPER() {
        return 7;
    }

    static get TYPE_ANNOUNCEMENT() {
        return 8;
    }

    static get TYPE_JSON_WHISPER() {
        return 9;
    }

    static get TYPE_JSON() {
        return 10;
    }

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
                let count = this.readUnsignedVarInt();
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
                this.writeUnsignedVarInt(this.parameters.length);
                this.parameters.forEach(p => this.writeString(p));
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