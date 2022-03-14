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