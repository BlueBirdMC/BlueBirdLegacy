const RakNetServer = require("bluebirdmc-raknet/server/RakNetServer");
const GamePacket = require("./mcpe/protocol/GamePacket");
const PlayerList = require("../player/PlayerList");
const Player = require("../player/Player");
const Logger = use("log/Logger");
const ProtocolInfo = use("network/mcpe/protocol/ProtocolInfo");
const PacketPool = require("./mcpe/protocol/PacketPool");
const Config = use("utils/Config");

class RakNetInterface {
    constructor(server) {
        this.server = server;
        this.bluebirdcfg = new Config("BlueBird.json", Config.JSON);
        this.playersCount = 0;
        this.logger = new Logger("RakNet");
        this.raknet = new RakNetServer(this.bluebirdcfg.get("port"), this.logger);
        setInterval(() => {
            this.raknet.getServerName()
                .setMotd(this.bluebirdcfg.get("motd"))
                .setName("BlueBird Server")
                .setProtocol(ProtocolInfo.CURRENT_PROTOCOL)
                .setVersion(ProtocolInfo.MINECRAFT_VERSION)
                .setOnlinePlayers(this.playersCount)
                .setMaxPlayers(this.bluebirdcfg.get("maxplayers"))
                .setServerId(server.getId())
                .setGamemode("Creative");
        }, 1000);
        this.packetPool = new PacketPool();
        this.packetPool.init();
        this.players = new PlayerList();
        this.logger.setDebugging(this.bluebirdcfg.get("debug_level"));
    }

    setName(name){
        return this.raknet.getServerName().setMotd(name);
    }

    sendPacket(player, packet, needACK, immediate){
        if(this.players.hasPlayer(player)){
            let identifier = this.players.getPlayerIdentifier(player);

            if(packet instanceof GamePacket){
                let session;
                if((session = this.raknet.getSessionManager().getSessionByIdentifier(identifier))){
                    session.queueConnectedPacketFromServer(packet, needACK, immediate);
                }
                return null;
            }else{
                this.server.batchPackets([player], [packet], true, immediate);
            }
        }
    }

    tick(){
        this.raknet.getSessionManager().readOutgoingMessages().forEach(message => this._handleIncomingMessage(message.purpose, message.data));

        this.raknet.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());

            session.packetBatches.getAllAndClear().forEach(packet => {
                let pk = new GamePacket();
                pk.setBuffer(packet.getStream().getBuffer(), 1);
                pk.decode();
                pk.handle(player.getSessionAdapter());
            });
        });
    }

    close(player, reason = "unknown reason"){
        if(this.players.hasPlayer(player.ip + ":" + player.port)){
            this.raknet.getSessionManager().removeSession(this.raknet.getSessionManager().getSession(player.ip, player.port), reason);
            this.players.removePlayer(player.ip + ":" + player.port);
        }
    }

    shutdown(){
        this.raknet.shutdown();
    }

    _handleIncomingMessage(purpose, data){
        switch(purpose){
            case "openSession":
                let player = new Player(this.server, data.clientId, data.ip, data.port);
                this.players.addPlayer(data.identifier, player);
                this.playersCount += 1;
                break;
            case "closeSession":
                if(this.players.has(data.identifier)){
                    this.close(this.players.getPlayer(data.identifier), data.reason);
                    this.playersCount -= 1;
                }
                break;
        }
    }
}
module.exports = RakNetInterface
