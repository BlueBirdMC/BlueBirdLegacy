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

class ResourcePackChunkData extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_CHUNK_DATA;

    packId;

    chunkIndex;

    progress;

    data;

    decodePayload() {
        this.packId = this.readString();
        this.chunkIndex = this.readUnsignedIntLE();
        this.progress = this.readUnsignedLongLE();
        this.data = this.readString();
    }

    encodePayload() {
        this.writeString(this.chunkIndex);
        this.writeUnsignedIntLE(this.chunkIndex);
        this.readUnsignedLongLE(typeof this.progress instanceof "bigint" ? this.progress : BigInt(this.progress));
        this.writeString(this.data);
    }
}

module.exports = ResourcePackChunkData;