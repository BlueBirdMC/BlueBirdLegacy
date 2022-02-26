const Path = require("path")

global.use = function (path){
    return require(Path.normalize(__dirname + "/../../" + path))
}
