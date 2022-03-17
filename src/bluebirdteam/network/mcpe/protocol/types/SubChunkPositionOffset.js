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

class SubChunkPositionOffset {

    xOffset;
    yOffset;
    zOffset;

    constructor(xOffset, yOffset, zOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.zOffset = zOffset;
        this.clampOffset(xOffset);
        this.clampOffset(yOffset);
        this.clampOffset(zOffset);
    }

    clampOffset(value){
        if(value < -128 || value > 127){
            throw new Error("not in range SubChunkPosOffset");
        }
    }

    static read(stream){
        let xOffset = stream.readUnsignedByte() << 56 >> 56;
        let yOffset = stream.readUnsignedByte() << 56 >> 56;
        let zOffset = stream.readUnsignedByte() << 56 >> 56;
        return new SubChunkPositionOffset(xOffset, yOffset, zOffset);
    }

    write(stream){
        stream.writeUnsignedByte(this.xOffset);
        stream.writeUnsignedByte(this.yOffset);
        stream.writeUnsignedByte(this.zOffset);
    }
}

module.exports = SubChunkPositionOffset;