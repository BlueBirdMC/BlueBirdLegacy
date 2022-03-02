const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class SetTitle extends DataPacket{
    static get NETWORK_ID(){ return ProtocolInfo.SET_TITLE; }

    static get TYPE_CLEAR_TITLE(){ return 0; }
    static get TYPE_RESET_TITLE(){ return 1; }
    static get TYPE_SET_TITLE(){ return 2; }
    static get TYPE_SET_SUBTITLE(){ return 3; }
    static get TYPE_SET_ACTIONBAR_MESSAGE(){ return 4; }
    static get TYPE_SET_ANIMATION_TIMES(){ return 5; }
    static get TYPE_SET_TITLE_JSON(){ return 6; }
    static get TYPE_SET_SUBTITLE_JSON(){ return 7; }
    static get TYPE_SET_ACTIONBAR_MESSAGE_JSON(){ return 8; }

    type;

    text = "";

    fadeInTime = 0;

    stayTime = 0;

    fadeOutTime = 0;

    xuid = "";

    platformOnlineId = "";

    decodePayload() {
        this.type = this.readVarInt();
        this.text = this.readString();
        this.fadeInTime = this.readVarInt();
        this.stayTime = this.readVarInt();
        this.fadeOutTime = this.readVarInt();
        this.xuid = this.readString();
        this.platformOnlineId = this.readString();
    }

    encodePayload() {
        this.writeVarInt(this.type);
        this.writeString(this.text);
        this.writeVarInt(this.fadeInTime);
        this.writeVarInt(this.stayTime);
        this.writeVarInt(this.fadeOutTime);
        this.writeString(this.xuid);
        this.writeString(this.platformOnlineId);
    }
}

module.exports = SetTitle;