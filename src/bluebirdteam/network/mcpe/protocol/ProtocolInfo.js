ProtocolInfo = {};

/** minecraft protocol */
ProtocolInfo.CURRENT_PROTOCOL = 486;
/** the display version will be showed */
ProtocolInfo.MINECRAFT_VERSION = '1.18.11';

ProtocolInfo.LOGIN = 0x01;
ProtocolInfo.PLAY_STATUS = 0x02;
ProtocolInfo.RESOURCE_PACKS_INFO = 0x06;
ProtocolInfo.RESOURCE_PACK_STACK = 0x07;
ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE = 0x08;
ProtocolInfo.START_GAME = 0x0b;
ProtocolInfo.BIOME_DEFINITION_LIST = 0x7A;
ProtocolInfo.CREATIVE_CONTENT = 0x91;

module.exports = ProtocolInfo;
