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

class SubChunkPosition {

    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static read(stream){
        let x = stream.readSignedVarInt();
        let y = stream.readSignedVarInt();
        let z = stream.readSignedVarInt();
        return new SubChunkPosition(x, y, z);
    }

    write(stream){
        stream.writeSignedVarInt(this.x);
        stream.writeSignedVarInt(this.y);
        stream.writeSignedVarInt(this.z);
    }
}

module.exports = SubChunkPosition;