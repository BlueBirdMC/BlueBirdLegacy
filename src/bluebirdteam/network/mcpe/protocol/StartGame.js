import DataPacket from './DataPacket.js';
import { ProtocolInfo } from './ProtocolInfo.js';

class StartGame extends DataPacket{
    static get NETWORK_ID(){ return ProtocolInfo.START_GAME; }

    canBeSentBeforeLogin() {
        return true;
    }

    encodePayload() {
        this.writeVarLong(0);
        this.writeUnsignedVarLong(0);
        this.writeVarInt(0);

        this.writeVarInt(0);
        this.writeUnsignedVarInt(4);
        this.writeVarInt(0);

        this.writeLFloat(0.0);
        this.writeLFloat(0.0);

        this.writeVarInt(0);
        this.writeLShort(0);
        this.writeString("");
        this.writeVarInt(0);
        this.writeVarInt(2);
        this.writeVarInt(0);
        this.writeVarInt(1);
        this.writeVarInt(0);
        this.writeUnsignedVarInt(4);
        this.writeVarInt(0);
        this.writeBool(true);
        this.writeVarInt(1000);
        this.writeVarInt(0);
        this.writeBool(false);
        this.writeString("");
        this.writeLFloat(0);
        this.writeLFloat(0);
        this.writeBool(false);
        this.writeBool(true);
        this.writeBool(true);
        this.writeVarInt(0);
        this.writeVarInt(0);
        this.writeBool(true);
        this.writeBool(false);
        this.writeUnsignedVarInt(0);
        this.writeLInt(0);
        this.writeString("");
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeVarInt(1);
        this.writeLInt(0);
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeBool(false);
        this.writeString(ProtocolInfo.MINECRAFT_VERSION);
        this.writeLInt(0);
        this.writeLInt(0);
        this.writeBool(false);
        this.writeString("");
        this.writeString("");
        this.writeBool(false);
        this.writeBool(false);

        this.writeString('');
        this.writeString('');
        this.writeString('');
        this.writeBool(false);
        this.writeVarInt(0);
        this.writeVarInt(0);
        this.writeBool(false);
        this.writeLLong(1);

        this.writeVarInt(1);

        this.writeUnsignedVarInt(0);
        this.writeUnsignedVarInt(0);

        this.writeString("");
        this.writeBool(false);
        this.writeString("BlueBird");
        this.writeLLong(0);
    }
}

export default StartGame;