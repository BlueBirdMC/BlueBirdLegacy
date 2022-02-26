import DataPacket from './DataPacket.js';
import { ProtocolInfo } from './ProtocolInfo.js';

class CreativeContent extends DataPacket {
    static NETWORK_ID = ProtocolInfo.CREATIVE_CONTENT;

    canBeSentBeforeLogin(){
        return true;
    }

    encodePayload() {
        this.writeUnsignedVarInt(0);
    }

    handle(handler) {
        return false;
    }
}

export default CreativeContent;