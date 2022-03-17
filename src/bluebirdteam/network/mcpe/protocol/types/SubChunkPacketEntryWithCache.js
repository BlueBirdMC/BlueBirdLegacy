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

const SubChunkPacketEntryCommon = require("./SubChunkPacketEntryCommon");

class SubChunkPacketEntryWithCache {

    base;
    usedBlobHash;

    constructor(base, usedBlobHash) {
        this.base = base;
        this.usedBlobHash = usedBlobHash;
    }

    static read(stream){
        let base = SubChunkPacketEntryCommon.read(stream, true);
        let usedBlobHash = stream.readUnsignedLongLE();
        return new SubChunkPacketEntryWithCache(base, usedBlobHash);
    }

    write(stream){
        this.base.write(stream, true);
        stream.writeUnsignedLongLE(typeof this.usedBlobHash === "bigint" ? this.usedBlobHash : BigInt(this.usedBlobHash));
    }
}

module.exports = SubChunkPacketEntryWithCache;