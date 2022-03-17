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

class SubChunkPacketHeightMapInfo {

    constructor(heights) {
        this.heights = heights;
        if(heights.length !== 256){
            throw new Error("Expected 256 heightmap values");
        }
    }

    getHeight(x, z){
        return this.heights[((z & 0xf) << 4) | (x & 0xf)];
    }

    static read(stream){
        let heights = [];
        for(let i = 0; i < 256; ++i){
            heights.push(stream.readUnsignedByte() << 56 >> 56);
        }
        return new SubChunkPacketHeightMapInfo(heights);
    }

    write(stream){
        for(let i = 0; i < 256; ++i){
            stream.writeUnsignedByte(this.heights[i] & 0xff);
        }
    }

    static allTooLow(){
        return new self(array_fill(0, 256, -1));
    }

    static allTooHigh(){
        return new self(array_fill(0, 256, 16));
    }

    isAllTooLow(){
        this.heights.forEach(height => {
            if(height >= 0){
                return false;
            }
        });
        return true;
    }

    isAllTooHigh(){
        this.heights.forEach(height => {
            if(height <= 15){
                return false;
            }
        });
        return true;
    }
}

module.exports = SubChunkPacketHeightMapInfo;