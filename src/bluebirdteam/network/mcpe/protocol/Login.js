import DataPacket from './DataPacket.js';
import { ProtocolInfo } from './ProtocolInfo.js';

import BinaryStream from '../../NetworkBinaryStream.cjs';
import Utils from '../../../utils/Utils.js';

class Login extends DataPacket {

    static get NETWORK_ID() { return ProtocolInfo.LOGIN; }

    /** @type {string} */
    username = '';
    /** @type {number|undefined} */
    protocol;
    /** @type {string} */
    clientUUID;
    /** @type {string} */
    xuid;
    /** @type {string} */
    identityPublicKey;
    /** @type {string} */
    serverAddress;
    /** @type {string} */
    locale;
    /** @type {any} */
    chainData;
    /** @type {string} */
    clientDataJwt;
    /** @type {any} */
    clientData;

    canBeSentBeforeLogin() {
        return true;
    }

    mayHaveUnreadBytes = this.protocol !== ProtocolInfo.PROTOCOL;

    decodePayload() {
        this.protocol = this.readInt();

        try {
            this.decodeConnectionRequest();
        } catch (e) {
            throw new Error(`${this.constructor.name} was thrown while decoding connection request in login (protocol version ${this.protocol})`);
        }
    }

    decodeConnectionRequest() {
        let buffer = new BinaryStream(this.read(this.readUnsignedVarInt()));
        this.chainData = JSON.parse(buffer.read(buffer.readLInt()).toString());

        let hasExtraData = false;
        this.chainData["chain"].forEach(chain => {
            let webtoken = Utils.decodeJWT(chain);
            if (typeof webtoken["extraData"] !== "undefined") {

                if (hasExtraData) {
                    // error to handle
                    console.log("Found 'extraData' multiple times in key chain");
                }

                hasExtraData = true;

                if (typeof webtoken["extraData"]["displayName"] !== "undefined") {
                    this.username = webtoken["extraData"]["displayName"];
                }
                if (typeof webtoken["extraData"]["identity"] !== "undefined") {
                    this.clientUUID = webtoken["extraData"]["identity"];
                }
                if (typeof webtoken["extraData"]["XUID"] !== "undefined") {
                    this.xuid = webtoken["extraData"]["XUID"];
                }
            }

            if (typeof webtoken["identityPublicKey"] !== "undefined") {
                this.identityPublicKey = webtoken["identityPublicKey"];
            }
        });

        this.clientDataJwt = buffer.read(buffer.readLInt()).toString();
        this.clientData = Utils.decodeJWT(this.clientDataJwt);

        this.clientId = this.clientData["ClientRandomId"] ?? null;
        this.serverAddress = this.clientData["ServerAddress"] ?? null;

        this.locale = this.clientData["LanguageCode"] ?? null;
    }

    handle(handler) {
        return handler.handleLogin(this);
    }
}

export default Login;