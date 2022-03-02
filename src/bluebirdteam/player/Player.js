const PlayerSessionAdapter = require("../network/mcpe/PlayerSessionAdapter");
const LoginPacket = require("../network/mcpe/protocol/Login");
const ProtocolInfo = require("../network/mcpe/protocol/ProtocolInfo");
const PlayStatus = require("../network/mcpe/protocol/PlayStatus");
const StartGame = require("../network/mcpe/protocol/StartGame");
const ResourcePackClientResponse = require("../network/mcpe/protocol/ResourcePackClientResponse");
const ResourcePackStack = require("../network/mcpe/protocol/ResourcePackStack");
const TextFormat = require("../utils/TextFormat");
const ResourcePacksInfo = require("../network/mcpe/protocol/ResourcePacksInfo");
const BiomeDefinitionList = require("../network/mcpe/protocol/BiomeDefinitionList");
const CreativeContent = require("../network/mcpe/protocol/CreativeContent");
const Text = require("../network/mcpe/protocol/Text");

class Player {

    constructor(server, clientId, ip, port) {
        this.server = server;
        this.clientId = clientId;
        this.ip = ip;
        this.port = port;
        this.needACK = {};
        this.username = "";
        this.locale = "en_US";
        this.loggedIn = false; //todo handle leaving to set it to false again when he joins
        this.sessionAdapter = new PlayerSessionAdapter(this, server);
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter(){
        return this.sessionAdapter;
    }

    isConnected(){
        return this.sessionAdapter !== null;
    }

    handleLogin(packet){
        CheckTypes([LoginPacket, packet]);

        if(packet.protocol !== ProtocolInfo.CURRENT_PROTOCOL){
            if(packet.protocol < ProtocolInfo.CURRENT_PROTOCOL){
                let play_status = new PlayStatus();
                play_status.status = PlayStatus.LOGIN_FAILED_CLIENT;
                this.directDataPacket(play_status);
            }else{
                let play_status = new PlayStatus();
                play_status.status = PlayStatus.LOGIN_FAILED_SERVER;
                this.directDataPacket(play_status);
            }

            this.sessionAdapter.raknetAdapter.close(this, "Incompatible Protocol");

            return;
        }

        this.username = TextFormat.clean(packet.username);

        if (packet.locale !== null) {
            this.locale = packet.locale;
        }

        this.onVerifyCompleted(packet, null, true);
    }

    handleResourcePackClientResponse(packet) {
        switch (packet.status) {
            case ResourcePackClientResponse.STATUS_REFUSED:
                this.sessionAdapter.raknetAdapter.close(this, "You must accept resource packs to join this server.");
                break;

            case ResourcePackClientResponse.STATUS_SEND_PACKS:
                break;

            case ResourcePackClientResponse.STATUS_HAVE_ALL_PACKS:
                let pk = new ResourcePackStack();
                pk.resourcePackStack = [];
                pk.mustAccept = false;
                this.dataPacket(pk);
                break;

            case ResourcePackClientResponse.STATUS_COMPLETED:
                let startgame = new StartGame();
                this.dataPacket(startgame);

                this.dataPacket(new BiomeDefinitionList());
                this.dataPacket(new CreativeContent());

                let play_status = new PlayStatus();
                play_status.status = PlayStatus.PLAYER_SPAWN;
                this.dataPacket(play_status);
                this.loggedIn = true;
                break;

            default:
                return false;
        }
        return true;
    }

    onVerifyCompleted(packet, error, signedByMojang){
        if (error !== null) {
            this.sessionAdapter.raknetAdapter.close("", "Invalid Session");
            return;
        }

        let xuid = packet.xuid;

        if (!signedByMojang && xuid !== "") {
            this.server.getLogger().info(this.username + " has an XUID, but their login keychain is not signed by Mojang");
            xuid = "";
        }

        if (xuid === "" || !xuid instanceof String) {
            if (signedByMojang) {
                this.server.getLogger().error(this.username + " should have an XUID, but none found");
            }

            this.server.getLogger().debug(this.username + " is NOT logged into Xbox Live");
        } else {
            this.server.getLogger().debug(this.username + " is logged into Xbox Live");
        }

        let play_status = new PlayStatus();
        play_status.status = PlayStatus.LOGIN_SUCCESS;
        this.dataPacket(play_status);

        let packsInfo = new ResourcePacksInfo();
        packsInfo.resourcePackEntries = [];
        packsInfo.mustAccept = false;
        packsInfo.forceServerPacks = false;
        this.dataPacket(packsInfo);

        this.server.logger.notice("Player: " + this.username);
    }

    handleText(packet){
        CheckTypes([Text, packet]);
        if (packet.type === Text.TYPE_CHAT) {
            let message = TextFormat.clean(packet.message, false);

            message = message.split("\n");
            for (let i in message) {
                let messagePart = message[i];
                if (messagePart.trim() !== "" && messagePart.length <= 255) {
                        if (messagePart.startsWith("/")) {
                            this.server.getCommandMap().dispatchCommand(this, messagePart.substr(1));
                        } else {
                            let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messagePart);
                            this.server.broadcastMessage(msg);
                    }
                }
            }
            return true;
        }
    }

    sendMessage(message){
        let pk = new Text();
        pk.type = Text.TYPE_RAW;
        pk.message = message;
        this.dataPacket(pk);
    }

    dataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, false);
    }

    directDataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, true);
    }

    getName(){
        return this.username;
    }

    sendDataPacket(packet, needACK = false, immediate = false) {
        if (!this.isConnected()) return false;

        if (!packet.canBeSentBeforeLogin() && !this.loggedIn) {
            throw new Error("Attempted to send " + packet.getName() + " to " + this.getName() + " before they got logged in.");
        }

        let identifier = this.server.raknet.sendPacket(this, packet, needACK, immediate);

        if (needACK && identifier !== null) {
            this.needACK[identifier] = false;
            return identifier;
        }

        return true;
    }
}

module.exports = Player;
