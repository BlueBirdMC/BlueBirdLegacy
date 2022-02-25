const LoginPacket = require("./LoginPacket");

class PacketPool{

    constructor() {
        this.packetPool = new Map();
    }

    init(){
        this.registerPacket(LoginPacket)
    }

    registerPacket(packet){
        this.packetPool.set(packet.NETWORK_ID, packet);
    }

    getPacket(id){
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : undefined;
    }

    isRegistered(packet){
        return this.packetPool.has(packet);
    }
}

module.exports = PacketPool;