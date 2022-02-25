const NetworkBinaryStream = require("../../NetworkBinaryStream");

class DataPacket extends NetworkBinaryStream{

    static get NETWORK_ID(){ return 0; }

    static get PID_MASK (){ return 0x3ff; }

    static get SUBCLIENT_ID_MASK(){ return 0x03; }
    static get SENDER_SUBCLIENT_ID_SHIFT(){ return 10; }
    static get RECIPIENT_SUBCLIENT_ID_SHIFT(){ return 12; }

    isEncoded = false;
    __encapsulatedPacket = null;
    senderSubId = 0;
    recipientSubId = 0;
    canBeBatched = true;

    pid(){
        return this.constructor.NETWORK_ID;
    }

    getName(){
        return this.constructor.name;
    }

    canBeSentBeforeLogin(){
        return false;
    }

    mayHaveUnreadBytes(){
        return false;
    }

    decode(){
        this.offset = 0;
        this.decodeHeader();
        this.decodePayload();
    }

    decodeHeader(){
        let header = this.readUnsignedVarInt();
        let pid = header & this.constructor.PID_MASK;
        if(pid !== this.constructor.NETWORK_ID){
            throw new Error(`Expected ${this.constructor.NETWORK_ID} for packet ID, got ${pid}`);
        }
        this.senderSubId = (header >> this.constructor.SENDER_SUBCLIENT_ID_SHIFT) & this.constructor.SUBCLIENT_ID_MASK;
        this.recipientSubId = (header >> this.constructor.RECIPIENT_SUBCLIENT_ID_SHIFT) & this.constructor.SUBCLIENT_ID_MASK;
    }

    decodePayload(){}

    encode(){
        this.reset();
        this.encodeHeader();
        this.encodePayload();
        this.isEncoded = true;
    }

    encodeHeader(){
        this.writeUnsignedVarInt(
            this.constructor.NETWORK_ID |
            (this.senderSubId << this.constructor.SENDER_SUBCLIENT_ID_SHIFT) |
            (this.recipientSubId << this.constructor.RECIPIENT_SUBCLIENT_ID_SHIFT)
        );
    }

    encodePayload(){}

    clean(){
        this.isEncoded = false;
        super.reset();
    }

    /**
     * @param handle {PlayerSessionAdapter}
     */
    handle(handle){
        return false;
    }
}

module.exports = DataPacket;
