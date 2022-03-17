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
const SubChunkPosition = require("./types/SubChunkPosition");
const SubChunkPositionOffset = require("./types/SubChunkPositionOffset");

class SubChunkRequest extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SUB_CHUNK_REQUEST;

    dimension;
    basePosition;
    entries;

    decodePayload() {
        this.dimension = this.readSignedVarInt();
        this.basePosition = SubChunkPosition.read(this);

        this.entries = [];
        for(let i = 0, count = this.readUnsignedIntLE(); i < count; i++){
            this.entries.push(SubChunkPositionOffset.read(this));
        }
    }

    encodePayload() {
        this.writeSignedVarInt(this.dimension);
        this.basePosition.write(this);

        this.writeUnsignedIntLE(this.entries.length);
        this.entries.forEach(entry => {
            entry.write(this);
        });
    }
}

module.exports = SubChunkRequest;