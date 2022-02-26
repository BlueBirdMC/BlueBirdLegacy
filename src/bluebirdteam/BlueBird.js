import Path from 'path';
import {Server} from './Server.js';
import {dirname} from "locutus/php/filesystem/index.js";

class BlueBird{

    constructor() {
        let path = {
            file: Path.normalize(dirname("/../")),
            data: Path.normalize(dirname("/../../"))
        };
        new Server(path);
    }
}

export default BlueBird;
