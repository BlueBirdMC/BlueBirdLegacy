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
const SetTitle = require("../network/mcpe/protocol/SetTitle");
const DisconnectPacket = require("../network/mcpe/protocol/DisconnectPacket");

class Player {

    constructor(server, clientId, ip, port) {
        this.server = server;
        this.clientId = clientId;
        this.ip = ip;
        this.port = port;
        this.needACK = {};
        this.username = "";
        this.locale = "en_US";
        this.loggedIn = false;
        this.sessionAdapter = new PlayerSessionAdapter(this, server);
    }

    /**
     * @return {PlayerSessionAdapter}
     */

    getSessionAdapter() {
        return this.sessionAdapter;
    }

    isConnected() {
        return this.sessionAdapter !== null;
    }

    handleLogin(packet) {
        CheckTypes([LoginPacket, packet]);

        if (packet.protocol !== ProtocolInfo.CURRENT_PROTOCOL) {
            if (packet.protocol < ProtocolInfo.CURRENT_PROTOCOL) {
                let play_status = new PlayStatus();
                play_status.status = PlayStatus.LOGIN_FAILED_CLIENT;
                this.directDataPacket(play_status);
            } else {
                let play_status = new PlayStatus();
                play_status.status = PlayStatus.LOGIN_FAILED_SERVER;
                this.directDataPacket(play_status);
            }

            this.close("Incompatible protocol");
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
                this.close("You must accept resource packs to join this server.");
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

    onVerifyCompleted(packet, error, signedByMojang) {
        if (error !== null) {
            this.close("Invalid session");
            return;
        }

        let xuid = packet.xuid;

        if (!signedByMojang && xuid !== "") {
            this.server.getLogger().info(this.username + " has an XUID, but their login keychain is not signed by Mojang");
            if (new Config("BlueBird.json", Config.JSON).get("onlinemode") === true) {
                this.server.getLogger().debug(this.username + " is not logged into Xbox Live");
                this.close('To join this server you must login to your Xbox account')
            }
            xuid = "";
        }

        if (!this.username) {
            this.close('Username is required')
        }

        if (xuid === "" || !xuid instanceof String) {
            if (signedByMojang) {
                this.server.getLogger().warning(this.username + ' tried to join without XUID');
		if (new Config("BlueBird.json", Config.JSON).get('onlinemode') === true) {
                   this.close('To join this server you must login to your Xbox account')
                }
            }
	    this.server.getLogger().debug(this.username + ' is not logged into Xbox Live');
        } else {
            this.server.getLogger().debug(this.username + ' is logged into Xbox Live');
        }

        let play_status = new PlayStatus();
        play_status.status = PlayStatus.LOGIN_SUCCESS;
        this.dataPacket(play_status);

        let packsInfo = new ResourcePacksInfo();
        packsInfo.resourcePackEntries = [];
        packsInfo.mustAccept = false;
        packsInfo.forceServerPacks = false;
        this.dataPacket(packsInfo);

        this.server.getLogger().info('Player ' + this.username + ' joined the game');
        this.server.broadcastMessage('ยง6Player ' + this.username + ' joined the game');
    }

    handleText(packet) {
        CheckTypes([Text, packet]);
        if (packet.type === Text.TYPE_CHAT) {
            let message = TextFormat.clean(packet.message);
            message = message.split("\n");
            for (let i in message) {
                let messageElement = message[i];
                if (messageElement.trim() !== "" && messageElement.length <= 255) {
                     if (messageElement.startsWith("/")) {
                        //TODO: Add player commands
			return false;
                     }
                     let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messageElement);
                     this.server.broadcastMessage(msg);
                }
                if (messageElement.length > 255) {
                    this.close('Message is too long')
                }
            }
            return true;
        }
    }

    sendMessage(message) {
        let pk = new Text();
        pk.type = Text.TYPE_RAW;
        pk.message = message;
        this.dataPacket(pk);
    }

    sendTitle(title, subtitle = "", fadeIn = -1, stay = -1, fadeOut = -1) {
        this.setTitleDuration(fadeIn, stay, fadeOut);
        if (subtitle !== "") {
            this.sendSubTitle(subtitle);
        }
        this.sendTitleText(title, SetTitle.TYPE_SET_TITLE);
    }

    sendSubTitle(subtitle) {
        this.sendTitleText(subtitle, SetTitle.TYPE_SET_SUBTITLE);
    }

    clearTitles() {
        let pk = new SetTitle();
        pk.type = SetTitle.TYPE_CLEAR_TITLE;
        this.dataPacket(pk);
    }

    resetTitles() {
        let pk = new SetTitle();
        pk.type = SetTitle.TYPE_RESET_TITLE;
        this.dataPacket(pk);
    }

    setTitleDuration(fadeIn, stay, fadeOut) {
        if (fadeIn >= 0 && stay >= 0 && fadeOut >= 0) {
            let pk = new SetTitle();
            pk.type = SetTitle.TYPE_SET_ANIMATION_TIMES;
            pk.fadeInTime = fadeIn;
            pk.stayTime = stay;
            pk.fadeOutTime = fadeOut;
            this.dataPacket(pk);
        }
    }

    sendTitleText(title, type) {
        let pk = new SetTitle();
        pk.type = type;
        pk.text = title;
        this.dataPacket(pk);
    }

    close(reason, hide_disconnection_screen = false) {
        this.server.getLogger().info("Player " + this.username + " disconnected due to " + reason);
        this.server.broadcastMessage("ยง6Player " + this.username + " left the game");
        let pk = new DisconnectPacket();
        pk.hideDisconnectionScreen = hide_disconnection_screen;
        pk.message = reason;
        this.dataPacket(pk);
        this.server.raknet.close(this, reason);
        return;
    }

    getName() {
        return this.username;
    }

    dataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, false);
    }

    directDataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, true);
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
