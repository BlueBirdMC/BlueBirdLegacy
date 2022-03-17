/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class RequestChunkRadius extends DataPacket {
    static NETWORK_ID = ProtocolInfo.REQUEST_CHUNK_RADIUS;

    radius;

    decodePayload() {
        this.radius = this.readSignedVarInt();
    }

    encodePayload() {
        this.writeSignedVarInt(this.radius);
    }

    handle(handler) {
        return handler.handleRequestChunkRadius(this);
    }
}

module.exports = RequestChunkRadius;