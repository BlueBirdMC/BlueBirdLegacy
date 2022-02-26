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
        this.registerPacket(ResourcePacksInfo);
        this.registerPacket(ResourcePackClientResponse);
        this.registerPacket(ResourcePackStack);
        this.registerPacket(StartGame);
        this.registerPacket(BiomeDefinitionList);
        this.registerPacket(CreativeContent);
    }

    registerPacket(packet){
        this.packetPool.set(packet.NETWORK_ID, packet);
    }

    getPacket(id){
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
    }
}

module.exports = PacketPool;