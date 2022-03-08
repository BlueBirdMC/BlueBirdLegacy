const readline = require('readline')
const Textformat = require("../utils/TextFormat")

class ConsoleCommandReader {

    constructor(server) {
        this.server = server;
    }

    tick() {
        let rl = readline.createInterface({ input: process.stdin });
        rl.on("line", (input) => {
            switch (input) {
                case "help":
                    this.server.getLogger().info("Commands list:");
                    this.server.getLogger().info("help: shows this list");
                    this.server.getLogger().info("stop: shutdowns the server");
                    break;
                case "stop":
                    this.server.getLogger().info("Stopping server...");
                    try {
                        this.server.shutdown();
                        this.server.getLogger().info("Server stopped!");
                    } catch (e) {
                        this.server.getLogger().error("Cannot shutdown server!");
                        this.server.getLogger().error(e);
                        this.server.getLogger().info("Closing server...");
                    }
                    process.exit(1);
                    break;
                default:
                    if (input.trim() !== "") {
                        this.server.getLogger().info(Textformat.RED + "Unknown command. Type /help for a list of commands");
                    }
                    break;
            }
        });
    }
}

module.exports = ConsoleCommandReader;
