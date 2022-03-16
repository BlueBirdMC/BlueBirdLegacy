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

const readline = require("readline");
const Textformat = require("../utils/TextFormat");

class ConsoleCommandReader {
	constructor(server) {
		this.server = server;
	}

	read() {
		let rl = readline.createInterface({ input: process.stdin });
		rl.on("line", (input) => {
			switch (input) {
				case "help":
					this.server.getLogger().info("Commands list:");
					this.server.getLogger().info("help: shows this list");
					this.server.getLogger().info("stop: shutdowns the server");
					this.server.getLogger().info("reportbug: to report a bug");
					break;
				case "reportbug":
					this.server.getLogger().info("You can report bugs or issues here: https://github.com/BlueBirdMC/BlueBird/issues");
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
						this.server.getLogger().info(Textformat.RED + "Unknown command. Type 'help' for a list of commands");
					}
					break;
			}
		});
	}
}

module.exports = ConsoleCommandReader;
