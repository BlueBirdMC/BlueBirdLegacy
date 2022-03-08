const GamePacket = require("./network/mcpe/protocol/GamePacket");
const SessionManager = require("bluebirdmc-raknet/server/SessionManager");
const Config = require("./utils/Config");
const RakNetAdapter = require("./network/RakNetInterface");
const Logger = require("./utils/MainLogger");
const ConsoleCommandReader = require("./command/ConsoleCommandReader");
const fs = require("fs");
const version = "1.1";

class Server {

    constructor(path) {
        let start_time = Date.now();
        this.id = 0;
        this.logger = new Logger();
        this.raknet = new RakNetAdapter(this);
        this.getLogger().info("Starting Server...");
        this.getLogger().info("Loading BlueBird.json");
        this.path = path;
        if (!fs.existsSync("BlueBird.json")) {
            fs.copyFileSync(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json");
        }
        this.getLogger().info("This server is running BlueBird version " + version);
        this.getLogger().info("BlueBird is distributed under GPLv3 License");
        this.getLogger().info("Opening server on *:" + new Config("BlueBird.json", Config.JSON).get("port"));
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
        var err = true;
        try {
            await this.raknet.tick();
            err = false;
        } catch (e) {
            if(err == "true"){
                throw new Error("Failed to bind the server on the port " + new Config("BlueBird.json", Config.JSON).get("port"));
            }
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
                this.broadcastPackets(pk, targets, false);
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
