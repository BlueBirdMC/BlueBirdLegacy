import PlayerSessionAdapter from '../network/mcpe/PlayerSessionAdapter.js';
import LoginPacket from '../network/mcpe/protocol/Login.js';
import { ProtocolInfo } from '../network/mcpe/protocol/ProtocolInfo.js';
import PlayStatus from '../network/mcpe/protocol/PlayStatus.js';
import StartGame from '../network/mcpe/protocol/StartGame.js';
import ResourcePackClientResponse from '../network/mcpe/protocol/ResourcePackClientResponse.js';
import ResourcePackStack from '../network/mcpe/protocol/ResourcePackStack.js';
import TextFormat from '../utils/TextFormat.js';
import ResourcePacksInfo from '../network/mcpe/protocol/ResourcePacksInfo.js';
import BiomeDefinitionList from '../network/mcpe/protocol/BiomeDefinitionList.js';
import CreativeContent from '../network/mcpe/protocol/CreativeContent.js';

class Player {

    constructor(server, clientId, ip, port) {
        this.server = server;
        this.clientId = clientId;
        this.ip = ip;
        this.port = port;
        this.needACK = {};
        this.username = "";
        this.locale = "en_US"
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

        if (!packet.canBeSentBeforeLogin()) {
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

export default Player;