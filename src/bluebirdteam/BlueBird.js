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

require("./utils/methods/Globals");
const Path = require("path");
const Server = require("./Server");

class BlueBird {
	constructor() {
		let path = {
			file: Path.normalize(__dirname + "/../"),
			data: Path.normalize(__dirname + "/../../"),
		};
		this.server = new Server(path);
	}
}

module.exports = BlueBird;
