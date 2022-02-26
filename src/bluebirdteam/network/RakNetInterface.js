import RakNetServer from 'bluebirdmc-raknet';
import PlayerList from '../player/PlayerList.js';
import Player from "../player/Player.js";
import Logger from '../log/Logger.js';
import { ProtocolInfo } from './mcpe/protocol/ProtocolInfo.js';
import PacketPool from './mcpe/protocol/PacketPool.js';
import EncapsulatedPacket from 'bluebirdmc-raknet/protocol/EncapsulatedPacket.js';
import PacketReliability from 'bluebirdmc-raknet/protocol/PacketReliability.js';
import Config from '../utils/Config.js';
import GamePacket from './mcpe/protocol/GamePacket.js';

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

    identifiersACK = [];

    setName(name){
        return this.raknet.getServerName().setMotd(name);
    }

    sendPacket(player, packet, needACK, immediate){
        if (this.players.hasPlayer(player)) {
            let identifier = this.players.getPlayerIdentifier(player);
            if (!packet.isEncoded) {
                packet.encode();
            }

            if (packet instanceof GamePacket) {
                if (needACK) {
                    let pk = new EncapsulatedPacket();
                    pk.identifierACK = this.identifiersACK[identifier]++;
                    pk.stream.buffer = packet.buffer;
                    pk.reliability = PacketReliability.RELIABLE_ORDERED;
                    pk.orderChannel = 0;
                }

                let session;
                if ((session = this.raknet.getSessionManager().getSessionByIdentifier(identifier))) {
                    session.queueConnectedPacketFromServer(packet, needACK, immediate);
                }
                return null;
            } else {
                this.server.batchPackets([player], [packet], true, immediate);
                return null;
            }
        }
    }

    tick(){
        this.raknet.getSessionManager().readOutgoingMessages().forEach(message => this._handleIncomingMessage(message.purpose, message.data));

        this.raknet.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());

            session.packetBatches.getAllAndClear().forEach(packet => {
                let pk = new GamePacket();
                pk.setBuffer(packet.getStream().getBuffer());
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

export default RakNetInterface;
