const BatchPacket = require("./network/mcpe/protocol/GamePacket");
const SessionManager = require("bluebirdmc-raknet/server/SessionManager");
const Config = use("utils/Config");
const RakNetAdapter = use("network/RakNetInterface")
const Fs = use("utils/SimpleFileSystem")
const Logger = use("log/Logger")
const ConsoleCommandReader = use("command/ConsoleCommandReader")

class Server{

    constructor(path) {
        let start_time = Date.now()
        this.id = 1;
        this.path = path
        if(!Fs.fileExists("BlueBird.json")){
            Fs.copy(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json")
        }
        this.logger = new Logger();
        this.raknet = new RakNetAdapter(this);
        this.getLogger().info("Starting Server...");
        this.getLogger().info("Loading BlueBird.json");
        this.getLogger().info("This Server Is Running BlueBird Version 1.0!");
        this.getLogger().info("BlueBird Is distributed under MIT License");
        this.getLogger().info("Opening server on " + new Config("BlueBird.json", Config.JSON).get("interface") + ":" + new Config("BlueBird.json", Config.JSON).get("port"));
        this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).");
	    let reader = new ConsoleCommandReader(this);
        reader.tick();
        setInterval(() => {
            if(!this.raknet.raknet.isShutdown()){
                this.listen();
            }else{
                clearInterval();
            }
        }, SessionManager.RAKNET_TICK_LENGTH * 1000);
    }

    async listen(){
	    try {
	      await this.raknet.tick();
	    }catch(e){
            console.warn("Failed to bind the server");
            throw e;
	    }
    }

    getId(){
        return this.id;
    }

    batchPackets(players, packets, forceSync = false, immediate = false){
        let targets = [];
        players.forEach(player => {
            if(player.isConnected()) targets.push(this.raknet.players.getPlayerIdentifier(player));
        });

        if(targets.length > 0){
            let pk = new BatchPacket();

            packets.forEach(packet => pk.addPacket(packet));

            if(!forceSync && !immediate){
                //TODO
            }else{
                this.broadcastPackets(pk, targets, immediate);
            }
        }
    }
    
    getDataPath(){
        return this.path.data;
    }

    getLogger(){
        return this.logger;
    }

    shutdown(){
        this.raknet.shutdown();
        process.exit(1);
    }

    broadcastPackets(pk, targets, immediate) {
        if(!pk.isEncoded){
            pk.encode();
        }

        if(immediate){
            targets.forEach(id => {
                if(this.raknet.players.has(id)){
                    this.raknet.players.getPlayer(id).directDataPacket(pk);
                }
            });
        }else{
            targets.forEach(id => {
                if(this.raknet.players.has(id)){
                    this.raknet.players.getPlayer(id).dataPacket(pk);
                }
            });
        }
    }
}

module.exports = Server
