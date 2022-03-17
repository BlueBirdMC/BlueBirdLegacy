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

class NetworkChunkPublisherUpdate extends DataPacket {
    static NETWORK_ID = ProtocolInfo.NETWORK_CHUNK_PUBLISHER_UPDATE;

    x;
    y;
    z;

    radius;

    decodePayload() {
        this.x = this.readSignedVarInt();
        this.y = this.readSignedVarInt();
        this.z = this.readSignedVarInt();
        this.radius = this.readVarInt();
    }

    encodePayload() {
        this.writeSignedVarInt(this.x);
        this.writeSignedVarInt(this.y);
        this.writeSignedVarInt(this.z);
        this.writeSignedVarInt(this.radius);
    }
}

module.exports = NetworkChunkPublisherUpdate;