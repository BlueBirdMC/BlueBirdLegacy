import Login from './Login.js';
import PlayStatus from './PlayStatus.js';
import ResourcePackClientResponse from './ResourcePackClientResponse.js';
import ResourcePacksInfo from './ResourcePacksInfo.js';
import ResourcePackStack from './ResourcePackStack.js';
import StartGame from './StartGame.js';
import CreativeContent from './CreativeContent.js';
import BiomeDefinitionList from './BiomeDefinitionList.js';

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

export default PacketPool;