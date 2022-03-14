const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");

class StartGame extends DataPacket {
	static NETWORK_ID = ProtocolInfo.START_GAME;

	canBeSentBeforeLogin = true;

	encodePayload() {
		this.writeVarLong(0); // Entity id
		this.writeUnsignedVarLong(0); // Runtime entity id
		this.writeVarInt(1); // Player gamemode

		this.writeLFloat(0.0); // Player x
		this.writeLFloat(4.0); // Player y
		this.writeLFloat(0.0); // PLayer z

		this.writeLFloat(0.0); // Pitch
		this.writeLFloat(0.0); // Yaw

		this.writeVarInt(0); // Seed
		this.writeLShort(0); // Biome type
		this.writeString(""); // Biome name
		this.writeVarInt(0); // Dimension
		this.writeVarInt(1); // Generator
		this.writeVarInt(1); // World gamemode
		this.writeVarInt(0); // Difficulty
		this.writeVarInt(0); // Spawn x
		this.writeUnsignedVarInt(4); // Spawn y
		this.writeVarInt(0); // Spawn z
		this.writeBool(false); // Achivements Disabled
		this.writeVarInt(0); // Day Cycle Stop Time
		this.writeVarInt(0); // Edu offser
		this.writeBool(false); // Edu features enabled
		this.writeString(""); // Edu product uuid
		this.writeLFloat(0.0); // Rain level
		this.writeLFloat(0.0); // Lightning level
		this.writeBool(false); // Has confirmed platform locked content
		this.writeBool(true); // Is multiplayer
		this.writeBool(true); // Broadcast to lan
		this.writeVarInt(4); // Xbox live broadcast mode
		this.writeVarInt(4); // Platform broadcast mode
		this.writeBool(true); // Enable commands
		this.writeBool(false); // Are texture packs required
		this.writeUnsignedVarInt(0); // Game rules count
		this.writeLInt(0); // Experiments count
		this.writeBool(false); // Experiments previously used
		this.writeBool(false); // Bonus chest enabled
		this.writeBool(false); // Map enabled
		this.writeVarInt(1); // Permission level
		this.writeLInt(0); // Server chunk tick range
		this.writeBool(false); // Has locked behavior pack
		this.writeBool(false); // Has locked texture pack
		this.writeBool(false); // Is from locked world template
		this.writeBool(false); // Msa gamertags only
		this.writeBool(false); // Is from world template
		this.writeBool(false); // Is world template option locked
		this.writeBool(false); // Only spawn v1 villagers
		this.writeString(ProtocolInfo.MINECRAFT_VERSION); // Game version
		this.writeLInt(0); // Limited world width
		this.writeLInt(0); // Limited world length
		this.writeBool(true); // Is new nether
		this.writeString(""); // Button name
		this.writeString(""); // Link uri
		this.writeBool(false); // Experimental gameplay override

		this.writeString(""); // Level id
		this.writeString(""); // World name
		this.writeString(""); // Premium world template id
		this.writeBool(false); // Is trial
		this.writeVarInt(0); // Movement authority
		this.writeVarInt(0); // Rewind history
		this.writeBool(false); // Server authorative block breaking
		this.writeLLong(0); // Current tick

		this.writeVarInt(0); // Enchantment seed

		this.writeUnsignedVarInt(0); // Block properties count
		this.writeUnsignedVarInt(0); // Item states count

		this.writeString(""); // Multiplayer correction id
		this.writeBool(false); // Server authorative inventory
		this.writeString("BlueBird"); // Engine
		this.writeLLong(0); // Block palette checksum
	}
}

module.exports = StartGame;
