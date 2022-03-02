const TextFormat = require("./TextFormat");
const TimeStamp = require("time-stamp");

class MainLogger {

    debuggingLevel = 0;

    info(message){
        return this.log("INFO", message, TextFormat.WHITE);
    }

    alert(message){
        return this.log("ALERT", message, TextFormat.AQUA);
    }

    emergency(message){
        return this.log("EMERGENCY", message, TextFormat.RED);
    }

    critical(message){
        return this.log("CRITICAL", message, TextFormat.RED);
    }

    error(message){
        return this.log("ERROR", message, TextFormat.DARK_RED);
    }

    warning(message){
        return this.log("ERROR", message, TextFormat.YELLOW);
    }

    notice(message){
        return this.log("NOTICE", message, TextFormat.BLUE);
    }

    debug(message){
        if(this.debuggingLevel < 1)return false;
        return this.log("DEBUG", message);
    }

    debugExtensive(message){
        if(this.debuggingLevel < 2)return false;
        return this.log("DEBUG", message);
    }

    log(type, message, color = TextFormat.GRAY){
        color = TextFormat.toTerminal(color);
        message = TextFormat.toTerminal(message);
        console.log(TextFormat.toTerminal(TextFormat.BLUE) + "[" + TimeStamp("HH:MM:SS") + "]" + TextFormat.toTerminal(TextFormat.RESET) + " " + color + type + " >", message + TextFormat.toTerminal(TextFormat.RESET));
    }

    setDebuggingLevel(level){
        this.debuggingLevel = level;
    }
}

module.exports = MainLogger;