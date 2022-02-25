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
        return self.NETWORK_ID;
    }

    getName(){
        return self.__filename.replace(".js", "");
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
        let pid = header & self.PID_MASK;
        if(pid !== self.NETWORK_ID){
            throw new Error(`Expected ${self.NETWORK_ID} for packet ID, got ${pid}`);
        }
        this.senderSubId = (header >> self.SENDER_SUBCLIENT_ID_SHIFT) & self.SUBCLIENT_ID_MASK;
        this.recipientSubId = (header >> self.RECIPIENT_SUBCLIENT_ID_SHIFT) & self.SUBCLIENT_ID_MASK;
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
            self.NETWORK_ID |
            (this.senderSubId << self.SENDER_SUBCLIENT_ID_SHIFT) |
            (this.recipientSubId << self.RECIPIENT_SUBCLIENT_ID_SHIFT)
        );
    }

    encodePayload(){}

    clean(){
        this.buffer = new Buffer("");
        this.isEncoded = false;
        this.offset = 0;
        return this;
    }

    /**
     * @param handle {PlayerSessionAdapter}
     * @returns {void}
     */
    handle(handle){
        return handle.handleDataPacket(this);
    }
}

module.exports = DataPacket;
