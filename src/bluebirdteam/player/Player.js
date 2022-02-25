const PlayerSessionAdapter = require("../network/mcpe/PlayerSessionAdapter");
const DataPacket = require("../network/mcpe/protocol/DataPacket");
const LoginPacket = require("../network/mcpe/protocol/LoginPacket");
const ProtocolInfo = require("../network/mcpe/protocol/ProtocolInfo");

class Player {

    constructor(server, clientId, ip, port) {
        this.sessionAdapter = new PlayerSessionAdapter(server, server.raknet);
        this.server = server;
        this.clientId = clientId;
        this.ip = ip;
        this.port = port;
        this.needACK = {};
        this.username = "";
        server.logger.notice("Player: " + ip + ":" + port);
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter(){
        return this.sessionAdapter;
    }

    isConnected(){
        return this.getSessionAdapter() !== null;
    }

    handleLogin(packet){
        CheckTypes([LoginPacket, packet]);

        if(packet.protocol !== ProtocolInfo.PROTOCOL){
            console.log("player protocol is not the default");
        }else{
            console.log("player protocol is the default");
        }

        this.username = packet.username;
    }

    doFirstSpawn(){}

    dataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, false);
    }

    directDataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, true);
    }

    getName(){
        return this.username;
    }

    sendDataPacket(packet, needACK = false, immediate = false){
        CheckTypes([DataPacket, packet], [Boolean, needACK], [Boolean, immediate]);
        if (this.isConnected()) {
            if (!packet.canBeSentBeforeLogin()) {
                throw new Error("Attempted to send " + packet.getName() + " to " + this.ip + " before they got logged in.");
            }
            let identifier = this.getSessionAdapter().sendPacket(packet, needACK, immediate);
            if (!(needACK && identifier !== null)) {
                return true;
            } else {
                this.needACK[identifier] = false;
                return identifier;
            }
        } else {
            return false;
        }
    }
}

module.exports = Player;