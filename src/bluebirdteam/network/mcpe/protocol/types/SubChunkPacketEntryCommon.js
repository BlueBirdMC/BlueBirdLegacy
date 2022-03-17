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

const SubChunkPositionOffset = require("./SubChunkPositionOffset");
const SubChunkPacketHeightMapInfo = require("./SubChunkPacketHeightMapInfo");

class SubChunkPacketEntryCommon {

    offset;
    requestResult;
    terrainData;
    heightMap;

    constructor(offset, requestResult, terrainData, heightMap) {
        this.offset = offset;
        this.requestResult = requestResult;
        this.terrainData = terrainData;
        this.heightMap = heightMap;
    }

    static read(stream, cacheEnabled){
        let offset = SubChunkPositionOffset.read(stream);
        let requestResult = stream.readUnsignedByte();
        let data = !cacheEnabled || requestResult !== 6 ? stream.readString() : "";
        let heightMapDataType = stream.readUnsignedByte();
        let heightMapData;
        switch (heightMapDataType){
            case 0:
                heightMapData = null;
                break;
            case 1:
                heightMapData = SubChunkPacketHeightMapInfo.read(stream);
                break;
            case 2:
                heightMapData = SubChunkPacketHeightMapInfo.allTooHigh();
                break;
            case 3:
                heightMapData = SubChunkPacketHeightMapInfo.allTooLow();
                break;
            default:
                throw new Error("Unknown heightmap data");
        }
        return new self(offset, requestResult, data, heightMapData);
    }

    write(stream, cacheEnabled){
        this.offset.write(stream);
        stream.writeUnsignedByte(this.requestResult);
        if(!cacheEnabled || this.requestResult !== 6){
            stream.writeString(this.terrainData);
        }
        if(this.heightMap === null) {
            stream.writeUnsignedByte(0);
        }else if(this.heightMap.isAllTooHigh()){
            stream.writeUnsignedByte(2);
        }else if(this.heightMap.isAllTooLow()){
            stream.writeUnsignedByte(3);
        }else{
            stream.writeUnsignedByte(1);
            this.heightMap.write(stream);
        }
    }
}

module.exports = SubChunkPacketEntryCommon;