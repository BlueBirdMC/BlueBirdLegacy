const {base64_decode} = require("locutus/php/url");

class Utils{
    static decodeJWT(token){
        let [headB64, payloadB64, sigB64] = token.split(".");

        return JSON.parse(base64_decode(payloadB64.replace(/-/g, "+")).replace(/_/g, "/"));
    }
}

module.exports = Utils;