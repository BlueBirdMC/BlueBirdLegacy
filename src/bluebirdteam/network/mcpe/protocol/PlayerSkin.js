const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class PlayerSkin extends DataPacket {
    static NETWORK_ID = ProtocolInfo.PLAYER_SKIN;

    uuid;

    oldSkinName;

    newSkinName;

    skin;

    decodePayload() {
        this.uuid = this.readUUID();
        this.oldSkinName = this.readString();
        this.newSkinName = this.readString();
        this.skin = this.readSkin();
    }

    encodePayload() {
        this.writeUUID(this.uuid);
        this.writeString(this.oldSkinName);
        this.writeString(this.newSkinName);
        this.writeSkin(this.skin);
    }

    handle(handler) {
        return handler.handlePlayerSkin(this);
    }
}

module.exports = PlayerSkin;