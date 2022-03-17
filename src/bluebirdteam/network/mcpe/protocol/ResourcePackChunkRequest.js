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

class ResourcePackChunkRequest extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_CHUNK_REQUEST;

    packId;
    chunkIndex;

    decodePayload() {
        this.packId = this.readString();
        this.chunkIndex = this.readUnsignedIntLE();
    }

    encodePayload() {
        this.writeString(this.packId);
        this.writeString(this.chunkIndex);
    }

    handle(handler) {
        return handler.handleResourcePackChunkRequest(this);
    }
}

module.exports = ResourcePackChunkRequest;