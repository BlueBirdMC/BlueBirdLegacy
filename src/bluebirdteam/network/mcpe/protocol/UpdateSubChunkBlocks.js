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

class UpdateSubChunkBlocks extends DataPacket {
    static NETWORK_ID = ProtocolInfo.UPDATE_SUB_CHUNK_BLOCKS;

    subChunkX;
    subChunkY;
    subChunkZ;

    layer0Updates;
    layer1Updates;

    decodePayload() {
        this.subChunkX = this.subChunkY = this.subChunkY = 0;
        this.subChunkX = this.readSignedVarInt();
        this.subChunkY = this.readVarInt();
        this.subChunkZ = this.readSignedVarInt();
        this.layer0Updates = [];
        for(let i = 0, count = this.readVarInt(); i < count; ++i){
            this.layer0Updates.push(UpdateSubChunkBlocksPacketEntry.read(this));
        }
        for(let i = 0, count = this.readVarInt(); i < count; ++i){
            this.layer1Updates.push(UpdateSubChunkBlocksPacketEntry.read(this));
        }
    }

    encodePayload() {
        this.writeSignedVarInt(this.subChunkX);
        this.writeVarInt(this.subChunkY);
        this.writeSignedVarInt(this.subChunkZ);
        this.writeVarInt(this.layer0Updates.length);
        this.layer0Updates.forEach(layer => {
            layer.write(this);
        });
        this.writeVarInt(this.layer1Updates.length);
        this.layer1Updates.forEach(layer => {
            layer.write(this);
        });
    }
}

module.exports = UpdateSubChunkBlocks;