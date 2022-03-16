/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
 \******************************************/

const Login = require("./Login");
const PlayStatus = require("./PlayStatus");
const ResourcePackClientResponse = require("./ResourcePackClientResponse");
const ResourcePacksInfo = require("./ResourcePacksInfo");
const ResourcePackStack = require("./ResourcePackStack");
const StartGame = require("./StartGame");
const CreativeContent = require("./CreativeContent");
const BiomeDefinitionList = require("./BiomeDefinitionList");
const Text = require("./Text");
const SetTitle = require("./SetTitle");
const DisconnectPacket = require("./DisconnectPacket");
const PlayerSkin = require("./PlayerSkin");

class PacketPool {
	packetPool = new Map();

	init() {
		this.registerPacket(Login);
		this.registerPacket(PlayStatus);
		this.registerPacket(ResourcePacksInfo);
		this.registerPacket(ResourcePackClientResponse);
		this.registerPacket(ResourcePackStack);
		this.registerPacket(StartGame);
		this.registerPacket(BiomeDefinitionList);
		this.registerPacket(CreativeContent);
		this.registerPacket(Text);
		this.registerPacket(SetTitle);
		this.registerPacket(DisconnectPacket);
		// this.registerPacket(PlayerSkin);
	}

	registerPacket(packet) {
		this.packetPool.set(packet.NETWORK_ID, packet);
	}

	getPacket(id) {
		return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
	}
}

module.exports = PacketPool;
