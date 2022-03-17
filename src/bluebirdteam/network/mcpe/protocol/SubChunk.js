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
const SubChunkPacketEntryWithCache = require("./types/SubChunkPacketEntryWithCache");
const SubChunkPacketEntryCommon = require("./types/SubChunkPacketEntryCommon");

class scpewcl {
    entries;
    constructor(entries) {
        this.entries = entries;
    }
}

class scpewicl {
    entries;
    constructor(entries) {
        this.entries = entries;
    }
}

class SubChunk extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SUB_CHUNK;

    dimension;
    baseSubChunkPosition;
    entries;

    decodePayload() {
        let cacheEnabled = this.readBool();
        this.dimension = this.readVarInt();
        this.baseSubChunkPosition = SubChunkPosition.read(this);
        let count = this.readUnsignedIntLE();
        if(cacheEnabled){
            let entries = [];
            for(let i = 0; i < count; i++){
                entries.push(SubChunkPacketEntryWithCache.read(this));
            }
            this.entries = new scpewcl(entries);
        }else{
            let entries = [];
            for(let i = 0; i < count; i++){
                entries.push(SubChunkPacketEntryCommon.read(this, false));
            }
            this.entries = new scpewicl(entries);
        }
    }

    encodePayload() {
        this.writeBool(this.entries instanceof SubChunkPacketEntryWithCache);
        this.writeSignedVarInt(this.dimension);
        this.baseSubChunkPosition.write(this);

        this.writeUnsignedIntLE(this.entries.getEntries().length);

        this.entries.entries.forEach(entry => {
            if(entry instanceof scpewcl){
                entry.write(this);
            }else if(entry instanceof scpewicl){
                entry.write(this, false);
            }
        });
    }
}

module.exports = SubChunk;