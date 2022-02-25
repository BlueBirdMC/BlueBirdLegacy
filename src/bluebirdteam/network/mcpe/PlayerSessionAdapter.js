const DataPacket = require("./protocol/DataPacket");

class PlayerSessionAdapter{

    constructor(player, raknet){
        /** @type {Server} */
        this.server = player.server;
        /** @type {RakNetInterface} */
        this.raknetAdapter = raknet;
        /** @type {Player} */
        this.player = player;
    }

    sendPacket(packet, needACK = false, immediate = true){
        return this.raknetAdapter.sendPacket(this.player, packet, needACK, immediate);
    }

    handleDataPacket(packet){
        CheckTypes([DataPacket, packet]);

        packet.decode();

        if(!packet.feof() && !packet.mayHaveUnreadBytes()){
            let remains = packet.buffer.slice(packet.offset);
            console.log("Still "+ remains.length + " bytes unread in " + packet.getName() + ": 0x" + remains.toString("hex"));
        }

        console.log("Got " + packet.getName() + " from " + this.player.ip + ":" + this.player.port);
    }

    handleLogin(packet){
        return this.player.handleLogin(packet);
    }

    handleSetLocalPlayerAsInitialized(packet){
        console.log("PlayerInitialized handled!");
        this.player.doFirstSpawn();
        return true;
    }

    handlePlayerSkin(packet){
        //return this.player.changeSkin(packet.skin, packet.newSkinName, packet.oldSkinName);
    }

    handleResourcePackClientResponse(packet){
        //this.player.handleResourcePackClientResponse(packet);
    }

    handleResourcePackChunkRequest(packet){
        //TODO: add all
        return true;
    }

    handleRequestChunkRadius(packet) {
        console.log("new chunk radius request");
    }

    handleLevelSoundEvent(packet){
        //return this.player.handleLevelSoundEvent(packet);
    }

    handleSetTime(packet){
        return false;
    }

    handleAddPlayer(packet){
        return false;
    }

    handleMovePlayer(packet){
        //return this.player.handleMovePlayer(packet);
    }

    handlePlayerAction(packet){
        //return this.player.handlePlayerAction(packet);
    }

    handleSubClientLogin(packet){
        return false;
    }

    handleStructureBlockUpdate(){
        return false;
    }

    handleBlockEvent(packet){
        return false;
    }

    handleServerToClientHandshake(packet){
        return false;
    }

    handleClientToServerHandshake(packet){
        return false;
    }

    handleAnimate(packet){
        //return this.player.handleAnimate(packet);
    }

    handleSetEntityData(packet){
        return false;
    }

    handleUpdateAttributes(packet){
        return false;
    }

    handleSetDefaultGameType(){
        //return this.player.handleSetDefaultGameType(packet);
    }

    handlePlayStatus(packet){
        return false;
    }

    handleInteract(packet){
        //this.player.handleInteract(packet);
    }

    handleText(packet){
        return false;//TODO
    }

    toString(){
        //return this.player.getName() !== "" ? this.player.getName() : this.player.getAddress() + ":" + this.player.getPort();
    }
}

module.exports = PlayerSessionAdapter;