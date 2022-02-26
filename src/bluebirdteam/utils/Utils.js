import Base64 from './Base64.js';

class Utils{
    static decodeJWT(token){
        let [headB64, payloadB64, sigB64] = token.split(".");

        return JSON.parse(Base64.decode(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), true));
    }
}

export default Utils;