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
const Config = require("../utils/Config");
const PlayerSkin = require("../network/mcpe/protocol/PlayerSkin");
const UUID = require("../utils/UUID");
const SkinAdapterSingleton = require("../network/mcpe/protocol/types/SkinAdapterSingleton");
const SkinImage = require("../network/mcpe/protocol/types/SkinImage");
const SkinAnimation = require("../network/mcpe/protocol/types/SkinAnimation");
const PersonaSkinPiece = require("../network/mcpe/protocol/types/PersonaSkinPiece");
const PersonaPieceTintColor = require("../network/mcpe/protocol/types/PersonaPieceTintColor");
const SkinData = require("../network/mcpe/protocol/types/SkinData");

class Player {

	username = "";
	loggedIn = false;
	locale = "en_US";
	needACK = {};

	constructor(server, clientId, ip, port, identifier) {
		this.server = server;
		this.clientId = clientId;
		this.ip = ip;
		this.port = port;
		this.identifier = identifier;
		this.sessionAdapter = new PlayerSessionAdapter(this);
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

	changeSkin(skin, oldSkinName, newSkinName) {
		if(!skin.isValid()){
			return;
		}

		this.setSkin(skin);
		this.sendSkin();
	}

	sendSkin(targets_1 = null){
		let targets = targets_1 === null ? this.server.getOnlinePlayers() : targets_1;
		let pk = new PlayerSkin();
		pk.uuid = this.uuid;
		pk.skin = SkinAdapterSingleton.get().toSkinData(this.skin);
		this.server.broadcastPacket(targets, pk);
	}

	setSkin(skin){
		skin.validate();
		this.skin = skin;
		this.skin.debloatGeometryData();
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

		this.uuid = UUID.fromString(packet.clientUUID);

		let animations = [];

		packet.clientData["AnimatedImageData"].forEach(animation => {
			animations.push(new SkinAnimation(
				new SkinImage(
					animation["ImageHeight"],
					animation["ImageWidth"],
					base64_decode(animation["Image"], true)),
				animation["Type"],
				animation["Frames"],
				animation["AnimationExpression"]
			));
		});

		let personaPieces = [];

		packet.clientData["PersonaPieces"].forEach(piece => {
			personaPieces.push(new PersonaSkinPiece(
				piece["PieceId"],
				piece["PieceType"],
				piece["PackId"],
				piece["IsDefault"],
				piece["ProductId"]
			));
		});

		let pieceTintColors = [];

		packet.clientData["PieceTintColors"].forEach(tintColors => {
			pieceTintColors.push(new PersonaPieceTintColor(tintColors["PieceType"], tintColors["Colors"]));
		});

		let skinData = new SkinData(
			packet.clientData["SkinId"],
			packet.clientData["PlayFabId"],
			base64_decode(packet.clientData["SkinResourcePatch"] ?? "", true),
			new SkinImage(
				packet.clientData["SkinImageHeight"],
				packet.clientData["SkinImageWidth"],
				base64_decode(packet.clientData["SkinData"], true)
			),
			animations,
			new SkinImage(
				packet.clientData["CapeImageHeight"],
				packet.clientData["CapeImageWidth"],
				base64_decode(packet.clientData["CapeData"] ?? "", true)
			),
			base64_decode(packet.clientData["SkinGeometryData"] ?? "", true),
			base64_decode(packet.clientData["SkinGeometryDataEngineVersion"], true),
			base64_decode(packet.clientData["SkinAnimationData"] ?? "", true),
			packet.clientData["CapeId"] ?? "",
			null,
			packet.clientData["ArmSize"] ?? SkinData.ARM_SIZE_WIDE,
			packet.clientData["SkinColor"] ?? "",
			personaPieces,
			pieceTintColors,
			true,
			packet.clientData["PremiumSkin"] ?? false,
			packet.clientData["PersonaSkin"] ?? false,
			packet.clientData["CapeOnClassicSkin"] ?? false,
			true,
		);

		let skin;
		try{
			skin = SkinAdapterSingleton.get().fromSkinData(skinData);
			skin.validate();
		}catch(e){
			console.log(e);
			this.close("Invalid Skin");
			return;
		}

		this.setSkin(skin);

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
				break;
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
				this.close("To join this server you must login to your Xbox account");
			}
			xuid = "";
		}

		if (!this.username) {
			this.close("Username is required");
		}

		if (xuid === "" || !xuid instanceof String) {
			if (signedByMojang) {
				this.server.getLogger().warning(this.username + " tried to join without XUID");
				if (new Config("BlueBird.json", Config.JSON).get("onlinemode") === true) {
					this.close("To join this server you must login to your Xbox account");
				}
			}
			this.server.getLogger().debug(this.username + " is not logged into Xbox Live");
		} else {
			this.server.getLogger().debug(this.username + " is logged into Xbox Live");
		}

		this.loggedIn = true;

		let play_status = new PlayStatus();
		play_status.status = PlayStatus.LOGIN_SUCCESS;
		this.dataPacket(play_status);

		let packsInfo = new ResourcePacksInfo();
		packsInfo.resourcePackEntries = [];
		packsInfo.mustAccept = false;
		packsInfo.forceServerPacks = false;
		this.dataPacket(packsInfo);

		this.server.getLogger().info("Player " + this.username + " joined the game");
		this.server.broadcastMessage("§6Player " + this.username + " joined the game");
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
					let msg = "<:player> :message"
						.replace(":player", this.getName())
						.replace(":message", messageElement);
					this.server.broadcastMessage(msg);
					this.server.getLogger().info(msg);
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
		this.server.broadcastMessage("§6Player " + this.username + " left the game");
		let pk = new DisconnectPacket();
		pk.hideDisconnectionScreen = hide_disconnection_screen;
		pk.message = reason;
		this.dataPacket(pk);
		this.server.raknet.close(this, reason);
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

		if (!this.loggedIn && !packet.canBeSentBeforeLogin) {
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
