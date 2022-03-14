const DataPacket = require("./protocol/DataPacket");
const SessionManager = require("bluebirdmc-raknet/server/SessionManager");

class PlayerSessionAdapter{

    /**
     * @param player {Player}
     */
    constructor(player){
        /** @type {Server} */
        this.server = player.server;
        /** @type {RakNetInterface} */
        this.raknetAdapter = player.server.raknet;
        /** @type {Player} */
        this.player = player;
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

    handleText(packet){
        return this.player.handleText(packet);
    }

    handleResourcePackClientResponse(packet){
        return this.player.handleResourcePackClientResponse(packet);
    }

    toString(){
        return this.player.getName() !== "" ? this.player.getName() : SessionManager.hashAddress(this.player.ip, this.player.port);
    }
}

module.exports = PlayerSessionAdapter;