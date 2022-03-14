const UUID = require("../utils/UUID");
const PersonaPieceTintColor = require("./mcpe/protocol/types/PersonaPieceTintColor");
const SkinData = require("./mcpe/protocol/types/SkinData");
const PersonaSkinPiece = require("./mcpe/protocol/types/PersonaSkinPiece");
const SkinAnimation = require("./mcpe/protocol/types/SkinAnimation");
const {count} = require("locutus/php/array");
const SkinImage = require("./mcpe/protocol/types/SkinImage");

class NetworkBinaryStream extends require("bluebirdmc-binarystream") {
	/**
	 * @return {String}
	 */
	readString() {
		return this.read(this.readUnsignedVarInt()).toString();
	}

	/**
	 * @param v {String}
	 * @return {NetworkBinaryStream}
	 */
	writeString(v) {
		this.writeUnsignedVarInt(Buffer.byteLength(v));
		if (v.length === 0) {
			return this;
		}
		this.append(Buffer.from(v, "utf8"));
		return this;
	}

	/**
	 * @return {UUID}
	 */
	readUUID() {
		let [p1, p0, p3, p2] = [
			this.readLInt(),
			this.readLInt(),
			this.readLInt(),
			this.readLInt(),
		];

		return new UUID(p0, p1, p2, p3);
	}

	/**
	 * @param uuid {UUID}
	 * @return {NetworkBinaryStream}
	 */
	writeUUID(uuid) {
		this.writeLInt(uuid.getPart(1));
		this.writeLInt(uuid.getPart(0));
		this.writeLInt(uuid.getPart(3));
		this.writeLInt(uuid.getPart(2));

		return this;
	}

	readSkin() {
		let skinId = this.readString();
		let skinPlayFabId = this.readString();
		let skinResourcePatch = this.readString();
		let skinData = this.readSkinImage();
		let animationCount = this.readLInt();
		let animations = [];
		for(let i = 0; i < animationCount; ++i){
			let skinImage = this.readSkinImage();
			let animationType = this.readLInt();
			let animationFrames = this.readLFloat();
			let expressionType = this.readLInt();
			animations.push(new SkinAnimation(skinImage, animationType, animationFrames, expressionType));
		}
		let capeData = this.readSkinImage();
		let geometryData = this.readString();
		let geometryDataVersion = this.readString();
		let animationData = this.readString();
		let capeId = this.readString();
		let fullSkinId = this.readString();
		let armSize = this.readString();
		let skinColor = this.readString();
		let personaPieceCount = this.readLInt();
		let personaPieces = [];
		for(let i = 0; i < personaPieceCount; ++i){
			let pieceId = this.readString();
			let pieceType = this.readString();
			let packId = this.readString();
			let isDefaultPiece = this.readBool();
			let productId = this.readString();
			personaPieces.push(new PersonaSkinPiece(pieceId, pieceType, packId, isDefaultPiece, productId));
		}
		let pieceTintColorCount = this.readLInt();
		let pieceTintColors = [];
		for(let i = 0; i < pieceTintColorCount; ++i){
			let pieceType = this.readString();
			let colorCount = this.readLInt();
			let colors = [];
			for(let j = 0; j < colorCount; ++j){
				colors.push(this.readString());
			}
			pieceTintColors.push(new PersonaPieceTintColor(
				pieceType,
				colors
			));
		}
		let premium = this.readBool();
		let persona = this.readBool();
		let capeOnClassic = this.readBool();
		let isPrimaryUser = this.readBool();

		return new SkinData(skinId, skinPlayFabId, skinResourcePatch, skinData, animations, capeData, geometryData, geometryDataVersion, animationData, capeId, fullSkinId, armSize, skinColor, personaPieces, pieceTintColors, true, premium, persona, capeOnClassic, isPrimaryUser);
	}

	writeSkin(skin){
		this.writeString(skin.getSkinId());
		this.writeString(skin.getPlayFabId());
		this.writeString(skin.getResourcePatch());
		this.writeSkinImage(skin.getSkinImage());
		this.writeLInt(count(skin.getAnimations()));
		skin.getAnimations().forEach(animation => {
			this.writeSkinImage(animation.getImage());
			this.writeLInt(animation.getType());
			this.writeLFloat(animation.getFrames());
			this.writeLInt(animation.getExpressionType());
		});
		this.writeSkinImage(skin.getCapeImage());
		this.writeString(skin.getGeometryData());
		this.writeString(skin.getGeometryDataEngineVersion());
		this.writeString(skin.getAnimationData());
		this.writeString(skin.getCapeId());
		this.writeString(skin.getFullSkinId());
		this.writeString(skin.getArmSize());
		this.writeString(skin.getSkinColor());
		this.writeLInt(count(skin.getPersonaPieces()));
		skin.getPersonaPieces().forEach(piece => {
			this.writeString(piece.getPieceId());
			this.writeString(piece.getPieceType());
			this.writeString(piece.getPackId());
			this.writeBool(piece.isDefaultPiece());
			this.writeString(piece.getProductId());
		});
		this.writeLInt(count(skin.getPieceTintColors()));
		skin.getPieceTintColors().forEach(tint => {
			this.writeString(tint.getPieceType());
			this.writeLInt(count(tint.getColors()));
			tint.getColors().forEach(color => {
				this.writeString(color);
			});
		});
		skin.getPieceTintColors().forEach(tint => {
			this.writeString(tint.getPieceType());
			this.writeLInt(count(tint.getColors()));
			tint.getColors().forEach(color => {
				this.writeString(color);
			});
		});
		this.writeBool(skin.isPremium());
		this.writeBool(skin.isPersona());
		this.writeBool(skin.isPersonaCapeOnClassic());
		this.writeBool(skin.isPrimaryUser());
	}

	readSkinImage(){
		let width = this.readLInt();
		let height = this.readLInt();
		let data = this.readString();
		return new SkinImage(height, width, data);
	}

	writeSkinImage(image){
		this.writeLInt(image.getWidth());
		this.writeLInt(image.getHeight());
		this.writeString(image.getData());
	}
}
module.exports = NetworkBinaryStream;
