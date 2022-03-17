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

class LevelChunk extends DataPacket {
    static NETWORK_ID = ProtocolInfo.LEVEL_CHUNK;

    static CLIENT_REQUEST_FULL_COLUMN_FAKE_COUNT = 0xff_ff_ff_ff
    static CLIENT_REQUEST_TRUNCATED_COLUMN_FAKE_COUNT = 0xff_ff_ff_fe;

    chunkX;
    chunkZ;
    subChunkCount;
    clientSubChunkRequestsEnabled;
    usedBlobHashes = null;
    extraPayload;

    decodePayload() {
        this.chunkX = this.readSignedVarInt();
        this.chunkZ = this.readSignedVarInt();
        let subchunkcount = this.readVarInt();
        if(subchunkcount === LevelChunk.CLIENT_REQUEST_FULL_COLUMN_FAKE_COUNT){
            this.clientSubChunkRequestsEnabled = true;
            this.subChunkCount = 0x7fffffff;
        }else if(subchunkcount === LevelChunk.CLIENT_REQUEST_TRUNCATED_COLUMN_FAKE_COUNT){
            this.clientSubChunkRequestsEnabled = true;
            this.subChunkCount = this.readUnsignedShortLE()
        }else{
            this.clientSubChunkRequestsEnabled = true;
            this.subChunkCount = subchunkcount;
        }
        let cacheEnabled = this.readBool();
        if(cacheEnabled === true){
            this.usedBlobHashes = [];
            for(let i = 0, count = this.readVarInt(); i < count; ++i){
                this.usedBlobHashes.push(this.readUnsignedLongLE());
            }
        }
        this.extraPayload = this.readString();
    }

    encodePayload() {
        this.writeSignedVarInt(this.chunkX);
        this.writeSignedVarInt(this.chunkZ);
        if(this.clientSubChunkRequestsEnabled === true){
            if(this.subChunkCount === 0x7fffffff){
                this.writeVarInt(LevelChunk.CLIENT_REQUEST_FULL_COLUMN_FAKE_COUNT);
            }else{
                this.writeVarInt(LevelChunk.CLIENT_REQUEST_TRUNCATED_COLUMN_FAKE_COUNT);
                this.writeUnsignedShortLE(this.subChunkCount);
            }
        }else{
            this.writeVarInt(this.subChunkCount);
        }
        this.writeBool(this.usedBlobHashes !== null);
        if(this.usedBlobHashes !== null){
            this.writeVarInt(this.usedBlobHashes.length);
            this.usedBlobHashes.forEach(hash => {
                this.writeUnsignedLongLE(typeof hash instanceof "bigint" ? hash : BigInt(hash));
            });
        }
        this.writeString(this.extraPayload);
    }
}

module.exports = LevelChunk;