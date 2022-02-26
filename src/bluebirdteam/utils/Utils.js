const Base64 = require("./Base64");

class Utils{
    static decodeJWT(token){
        let [headB64, payloadB64, sigB64] = token.split(".");

        return JSON.parse(Base64.decode(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), true));
    }
}

module.exports = Utils;