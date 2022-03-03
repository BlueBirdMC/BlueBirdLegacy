const GamePacket = require("./network/mcpe/protocol/GamePacket");
const SessionManager = require("bluebirdmc-raknet/server/SessionManager");
const Config = require("./utils/Config");
const RakNetAdapter = require("./network/RakNetInterface");
const Logger = require("./utils/MainLogger");
const ConsoleCommandReader = require("./command/ConsoleCommandReader");
const fs = require("fs");

class Server {

    constructor(path) {
        let start_time = Date.now();
        this.id = 0;
        this.path = path;
        if (!fs.existsSync("BlueBird.json")) {
            fs.copyFileSync(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json");
        }
        this.logger = new Logger();
        this.raknet = new RakNetAdapter(this);
        this.getLogger().info("Starting Server...");
        this.getLogger().info("Loading BlueBird.json");
        this.getLogger().info("This Server Is Running BlueBird Version 1.0!");
        this.getLogger().info("BlueBird Is distributed under GPLv3 License");
        this.getLogger().info("Opening server on 0.0.0.0:" + new Config("BlueBird.json", Config.JSON).get("port"));
        this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).");
        let reader = new ConsoleCommandReader(this);
        reader.tick();
        setInterval(() => {
            if (!this.raknet.raknet.isShutdown()) {
                this.listen();
            } else {
                clearInterval();
            }
        }, SessionManager.RAKNET_TICK_LENGTH * 1000);
    }

    async listen() {
        try {
            await this.raknet.tick();
        } catch (e) {
            throw new Error("Failed to bind the server on the port " + new Config("BlueBird.json", Config.JSON).get("port"));
        }
    }

    getId() {
        return this.id;
    }

    batchPackets(players, packets, forceSync = false, immediate = false) {
        let targets = [];
        players.forEach(player => {
            if (player.isConnected()) targets.push(this.raknet.players.getPlayerIdentifier(player));
        });

        if (targets.length > 0) {
            let pk = new GamePacket();

            packets.forEach(packet => pk.addPacket(packet));

            if (!forceSync && !immediate) {
                this.broadcastPackets(pk, targets, false); //not sure if it's right
            } else {
                this.broadcastPackets(pk, targets, immediate);
            }
        }
    }

    getDataPath() {
        return this.path.data;
    }

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
            targets.forEach(id => {
                if (this.raknet.players.has(id)) {
                    this.raknet.players.getPlayer(id).directDataPacket(pk);
                }
            });
        } else {
            targets.forEach(id => {
                if (this.raknet.players.has(id)) {
                    this.raknet.players.getPlayer(id).dataPacket(pk);
                }
            });
        }
    }

    broadcastMessage(message) {
        let players = this.getOnlinePlayers();
        players.forEach(players => players.sendMessage(message));
        this.getLogger().info(message);

        return players.length;
    }
}

module.exports = Server;
