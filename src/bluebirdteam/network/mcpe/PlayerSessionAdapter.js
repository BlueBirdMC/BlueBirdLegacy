import DataPacket from './protocol/DataPacket.js';

class PlayerSessionAdapter{

    constructor(player){
        /** @type {Server} */
        this.server = player.server;
        /** @type {RakNetInterface} */
        this.raknetAdapter = player.server.raknet;
        /** @type {Player} */
        this.player = player;
    }

    sendPacket(packet, needACK = false, immediate = true){
        return this.raknetAdapter.sendPacket(this.player, packet, needACK, immediate);
    }

    handleDataPacket(packet){
        CheckTypes([DataPacket, packet]);

        if (!this.player.isConnected()) {
            return;
        }

        packet.decode();

        if (!packet.feof() && !packet.mayHaveUnreadBytes) {
            let remains = packet.buffer.slice(packet.offset);
            this.server.logger.debug("Still " + remains.length + " bytes unread in " + packet.getName() + ": 0x" + remains.toString("hex"));
        }

        packet.handle(this);
    }

    handleLogin(packet){
        return this.player.handleLogin(packet);
    }

    handleResourcePackClientResponse(packet){
        return this.player.handleResourcePackClientResponse(packet);
    }

    toString(){
        return this.player.username !== "" ? this.player.username : this.player.ip + ":" + this.player.port;
    }
}

export default PlayerSessionAdapter;