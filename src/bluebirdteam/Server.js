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

const GamePacket = require("./network/mcpe/protocol/GamePacket");
const Config = require("./utils/Config");
const RakNetAdapter = require("./network/RakNetInterface");
const Logger = require("./utils/MainLogger");
const ConsoleCommandReader = require("./command/ConsoleCommandReader");
const fs = require("fs");

const version = "1.0.3";

class Server {
	constructor(path) {
		let start_time = Date.now();
		this.logger = new Logger();
		this.getLogger().info("Starting Server...");
		this.getLogger().info("Loading BlueBird.json");
		this.path = path;
		if (!fs.existsSync("BlueBird.json")) {
			fs.copyFileSync(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json");
		}
		this.getLogger().info("This server is running BlueBird " + version);
		this.getLogger().info("BlueBird is distributed under GPLv3 License");
		this.raknet = new RakNetAdapter(this);
		if (this.raknet.raknet.isRunning === true) {
			this.raknet.handle();
			this.getLogger().info("Opening server on " + new Config("BlueBird.json", Config.JSON).get("interface") + ":" + new Config("BlueBird.json", Config.JSON).get("port"));
		}
		this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).");
		let reader = new ConsoleCommandReader(this);
		reader.read();
	}

	batchPackets(players, packets, forceSync = false, immediate = false) {
		let targets = [];
		players.forEach((player) => {
			if (player.isConnected()){
				targets.push(this.raknet.players.getPlayerAddrNPort(player));
			}
		});

		if (targets.length > 0) {
			let pk = new GamePacket();

			packets.forEach((packet) => pk.addPacket(packet));

			if (!forceSync && !immediate) {
				this.broadcastPackets(pk, targets, false);
			} else {
				this.broadcastPackets(pk, targets, immediate);
			}
		}
	}

	getDataPath() {
		return this.path.data;
	}

	/**
	 * @returns {MainLogger}
	 */
	getLogger() {
		return this.logger;
	}

	shutdown() {
		this.raknet.shutdown();
		process.exit(1);
	}

	getOnlinePlayers() {
		return Array.from(this.raknet.players.values());
	}

	broadcastPackets(pk, targets, immediate) {
		if (!pk.isEncoded) {
			pk.encode();
		}

		if (immediate) {
			targets.forEach((id) => {
				if (this.raknet.players.has(id)) {
					this.raknet.players.getPlayer(id).sendDataPacket(pk, true);
				}
			});
		} else {
			targets.forEach((id) => {
				if (this.raknet.players.has(id)) {
					this.raknet.players.getPlayer(id).sendDataPacket(pk);
				}
			});
		}
	}

	broadcastPacket(targets, packet){
		packet.encode();
		this.batchPackets(targets, [packet]);
	}

	broadcastMessage(message) {
		let players = this.getOnlinePlayers();
		players.forEach(players => {
			players.sendMessage(message)
		});

		return players.length;
	}
}

module.exports = Server;
