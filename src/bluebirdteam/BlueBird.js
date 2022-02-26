require('./utils/methods/Globals')
const Path = require("path")
const Server = use("Server")

class BlueBird{

    constructor() {
        let path = {
            file: Path.normalize(__dirname + "/../"),
            data: Path.normalize(__dirname + "/../../")
        };
        this.server = new Server(path);
    }
}

module.exports = BlueBird