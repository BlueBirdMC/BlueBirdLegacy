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

let ProtocolInfo = {
	/** Minecraft protocol */
	CURRENT_PROTOCOL: 486,
	/** the display version will be showed */
	MINECRAFT_VERSION: "1.18.11",
	/** packet ids */
	LOGIN: 0x01,
	PLAY_STATUS: 0x02,
	RESOURCE_PACKS_INFO: 0x06,
	RESOURCE_PACK_STACK: 0x07,
	RESOURCE_PACK_CLIENT_RESPONSE: 0x08,
	START_GAME: 0x0b,
	BIOME_DEFINITION_LIST: 0x7a,
	CREATIVE_CONTENT: 0x91,
	TEXT: 0x09,
	SET_TITLE: 0x58,
	DISCONNECT_PACKET: 0x05,
	PLAYER_SKIN: 0x5d
};

module.exports = ProtocolInfo;
