const readline = require('readline')
const TerminalTextformat = use("utils/TerminalTextFormat")

class ConsoleCommandReader {

    constructor(server) {
        this.server = server
    }

    tick(){
        let rl = readline.createInterface(
            {
                input: process.stdin
            }
        )
        rl.on("line", (input) => {
            switch (input){
                case "help":
                    this.server.getLogger().info("Commands List:")
                    this.server.getLogger().info("stop: shutdown the server")
                    break;
                case "stop":
                    this.server.getLogger().info("Stopping Server...")
                    try{
                        this.server.raknet.shutdown()
                        this.server.getLogger().info("Server Stopped!")
                    }catch (e){
                        this.server.getLogger().error("Cannot Stop the server reason: " + e.errorDetail)
                        this.server.getLogger().alert("Closing Server...")
                    }
                    process.exit(1)
                    break;
                default:
                    if(input.trim() !== ""){
                        this.server.getLogger().info(TerminalTextformat.RED + "Unknown command. Try /help for a list of commands")
                    }
                    break;
            }
        })
    }
}

module.exports = ConsoleCommandReader
