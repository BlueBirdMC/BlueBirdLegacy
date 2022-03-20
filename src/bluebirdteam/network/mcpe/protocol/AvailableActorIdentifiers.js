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
const fs = require("fs");
const Path = require("path");

class AvailableActorIdentifiers extends DataPacket {
    static NETWORK_ID = ProtocolInfo.AVAILABLE_ACTOR_IDENTIFIERS;

    /** @type {Buffer} */
    namedtag;

    decodePayload() {
	this.namedtag = this.readRemaining();
    }

    encodePayload() {
	this.write(this.namedtag ? this.namedtag : Buffer.from(fs.readFileSync(Path.normalize(__dirname + "/../../../resources/entity_identifiers.nbt")), "base64"));
    }
}

module.exports = AvailableActorIdentifiers;
