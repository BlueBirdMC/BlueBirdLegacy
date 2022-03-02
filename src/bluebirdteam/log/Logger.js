const TimeStamp = require("time-stamp");

const TextFormat = use("utils/TextFormat");
const TerminalTextFormat = use("utils/TerminalTextFormat");

class Logger {

    debuggingLevel = 0;

    constructor(caller = "Server thread", subcaller = ""){
        this.caller = caller;
        this.subcaller = subcaller !== "" ? " " + subcaller : "";
    }

    emergency(){
        return this.log("EMERGENCY", arguments, TerminalTextFormat.RED);
    }

    alert(){
        return this.log("ALERT", arguments, TerminalTextFormat.RED);
    }

    critical(){
        return this.log("CRITICAL", arguments, TerminalTextFormat.RED);
    }

    error(){
        return this.log("ERROR", arguments, TerminalTextFormat.DARK_RED);
    }

    warning(){
        return this.log("WARNING", arguments, TerminalTextFormat.YELLOW);
    }

    notice(){
        return this.log("NOTICE", arguments, TerminalTextFormat.AQUA);
    }

    info(){
        return this.log("INFO", arguments, TerminalTextFormat.WHITE);
    }

    debug(){
        if(this.debuggingLevel < 1) return;
        return this.log("DEBUG", arguments, TerminalTextFormat.GRAY);
    }

    debugExtensive(){
        if(this.debuggingLevel < 2) return;
        return this.log("DEBUG", arguments, TerminalTextFormat.GRAY);
    }

    logError(error){
        error = error.stack.split("\n");
        this.error(error.shift());
        error.forEach(trace => this.debug(trace));
    }

    /**
     * @param level    String
     * @param messages Array
     * @param color    TerminalTextFormat.COLOR
     */
    log(level, messages, color = TerminalTextFormat.GRAY){
        if(messages.length === 0) return;

        messages = Array.from(messages).map(message => (typeof message === "string" ? TextFormat.toTerminal(message) : message) + TerminalTextFormat.RESET);

        log(TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat.RESET + " " + color +"[" + this.caller + "/" + level + "]:" + this.subcaller, messages);

        function log(prefix, args){
            console.log(prefix, ...args);
        }
    }

    setDebugging(level){
        this.debuggingLevel = level;

        return this;
    }
}

module.exports = Logger;
