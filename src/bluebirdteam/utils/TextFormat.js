const TextFormat = {};

TextFormat.ESCAPE = "\u00A7";
TextFormat.BLACK = TextFormat.ESCAPE + "0";
TextFormat.DARK_BLUE = TextFormat.ESCAPE + "1";
TextFormat.DARK_GREEN = TextFormat.ESCAPE + "2";
TextFormat.DARK_AQUA = TextFormat.ESCAPE + "3";
TextFormat.DARK_RED = TextFormat.ESCAPE + "4";
TextFormat.DARK_PURPLE = TextFormat.ESCAPE + "5";
TextFormat.GOLD = TextFormat.ESCAPE + "6";
TextFormat.GRAY = TextFormat.ESCAPE + "7";
TextFormat.DARK_GRAY = TextFormat.ESCAPE + "8";
TextFormat.BLUE = TextFormat.ESCAPE + "9";
TextFormat.GREEN = TextFormat.ESCAPE + "a";
TextFormat.AQUA = TextFormat.ESCAPE + "b";
TextFormat.RED = TextFormat.ESCAPE + "c";
TextFormat.LIGHT_PURPLE = TextFormat.ESCAPE + "d";
TextFormat.YELLOW = TextFormat.ESCAPE + "e";
TextFormat.WHITE = TextFormat.ESCAPE + "f";
TextFormat.OBFUSCATED = TextFormat.ESCAPE + "k";
TextFormat.BOLD = TextFormat.ESCAPE + "l";
TextFormat.STRIKETHROUGH = TextFormat.ESCAPE + "m";
TextFormat.UNDERLINE = TextFormat.ESCAPE + "n";
TextFormat.ITALIC = TextFormat.ESCAPE + "o";
TextFormat.RESET = TextFormat.ESCAPE + "r";

const TerminalColors = {};

TerminalColors.ESCAPE = "\u001b";
TerminalColors.BLACK = TerminalColors.ESCAPE + "[30m";
TerminalColors.DARK_BLUE = TerminalColors.ESCAPE + "[34m";
TerminalColors.DARK_GREEN = TerminalColors.ESCAPE + "[32m";
TerminalColors.DARK_AQUA = TerminalColors.ESCAPE + "[36m";
TerminalColors.DARK_RED = TerminalColors.ESCAPE + "[31m";
TerminalColors.DARK_PURPLE = TerminalColors.ESCAPE + "[35m";
TerminalColors.GOLD = TerminalColors.ESCAPE + "[33m";
TerminalColors.GRAY = TerminalColors.ESCAPE + "[37m";
TerminalColors.DARK_GRAY = TerminalColors.ESCAPE + "[30;1m";
TerminalColors.BLUE = TerminalColors.ESCAPE + "[34;1m";
TerminalColors.GREEN = TerminalColors.ESCAPE + "[32;1m";
TerminalColors.AQUA = TerminalColors.ESCAPE + "[36;1m";
TerminalColors.RED = TerminalColors.ESCAPE + "[31;1m";
TerminalColors.LIGHT_PURPLE = TerminalColors.ESCAPE + "[35;1m";
TerminalColors.YELLOW = TerminalColors.ESCAPE + "[33;1m";
TerminalColors.WHITE = TerminalColors.ESCAPE + "[37;1m";
TerminalColors.OBFUSCATED = TerminalColors.ESCAPE + "[47m";
TerminalColors.BOLD = TerminalColors.ESCAPE + "[1m";
TerminalColors.STRIKETHROUGH = TerminalColors.ESCAPE + "[9m";
TerminalColors.UNDERLINE = TerminalColors.ESCAPE + "[4m";
TerminalColors.ITALIC = TerminalColors.ESCAPE + "[3m";
TerminalColors.RESET = TerminalColors.ESCAPE + "[0m";

TextFormat.tokenize = function (str) {
    return str.split(new RegExp("(" + TextFormat.ESCAPE + "[0123456789abcdefklmnor])")).filter(v => v !== "");
};

TextFormat.clean = function (str, removeFormat = true) {
    if (removeFormat) {
        return str.replace(new RegExp(TextFormat.ESCAPE + "[0123456789abcdefklmnor]", "g"), "").replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(new RegExp(TextFormat.ESCAPE, "g"), "");
    }
    return str.replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(/\x1b/g, "");
}

TextFormat.toTerminal = function (str) {
    str = TextFormat.tokenize(str);
    str.forEach((v, k) => {
        switch (v) {
            case TextFormat.BLACK:
                str[k] = TerminalColors.BLACK;
                break;
            case TextFormat.DARK_BLUE:
                str[k] = TerminalColors.DARK_BLUE;
                break;
            case TextFormat.DARK_GREEN:
                str[k] = TerminalColors.DARK_GREEN;
                break;
            case TextFormat.DARK_AQUA:
                str[k] = TerminalColors.DARK_AQUA;
                break;
            case TextFormat.DARK_RED:
                str[k] = TerminalColors.DARK_RED;
                break;
            case TextFormat.DARK_PURPLE:
                str[k] = TerminalColors.DARK_PURPLE;
                break;
            case TextFormat.GOLD:
                str[k] = TerminalColors.GOLD;
                break;
            case TextFormat.GRAY:
                str[k] = TerminalColors.GRAY;
                break;
            case TextFormat.DARK_GRAY:
                str[k] = TerminalColors.DARK_GRAY;
                break;
            case TextFormat.BLUE:
                str[k] = TerminalColors.BLUE;
                break;
            case TextFormat.GREEN:
                str[k] = TerminalColors.GREEN;
                break;
            case TextFormat.AQUA:
                str[k] = TerminalColors.AQUA;
                break;
            case TextFormat.RED:
                str[k] = TerminalColors.RED;
                break;
            case TextFormat.LIGHT_PURPLE:
                str[k] = TerminalColors.LIGHT_PURPLE;
                break;
            case TextFormat.YELLOW:
                str[k] = TerminalColors.YELLOW;
                break;
            case TextFormat.WHITE:
                str[k] = TerminalColors.WHITE;
                break;
            case TextFormat.BOLD:
                str[k] = TerminalColors.BOLD;
                break;
            case TextFormat.OBFUSCATED:
                str[k] = TerminalColors.OBFUSCATED;
                break;
            case TextFormat.ITALIC:
                str[k] = TerminalColors.ITALIC;
                break;
            case TextFormat.UNDERLINE:
                str[k] = TerminalColors.UNDERLINE;
                break;
            case TextFormat.STRIKETHROUGH:
                str[k] = TerminalColors.STRIKETHROUGH;
                break;
            case TextFormat.RESET:
                str[k] = TerminalColors.RESET;
                break;
        }
    });

    return str.join("");
};

module.exports = TextFormat;
