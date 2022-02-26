const Login = require("./Login");
const PlayStatus = require("./PlayStatus");
const ResourcePackClientResponse = require("./ResourcePackClientResponse");
const ResourcePacksInfo = require("./ResourcePacksInfo");
const ResourcePackStack = require("./ResourcePackStack");
const StartGame = require("./StartGame");
const CreativeContent = require("./CreativeContent");
const BiomeDefinitionList = require("./BiomeDefinitionList");

class PacketPool{

    constructor() {
        this.packetPool = new Map();
    }

    init(){
        this.registerPacket(Login);
        this.registerPacket(PlayStatus);
        this.registerPacket(ResourcePackClientResponse);
        this.registerPacket(ResourcePacksInfo);
        this.registerPacket(ResourcePackStack);
        this.registerPacket(StartGame);
        this.registerPacket(CreativeContent);
        this.registerPacket(BiomeDefinitionList);
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