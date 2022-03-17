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

const ProtocolInfo = require("../ProtocolInfo");
const UUID = require("../../../../utils/UUID");

class SkinData {
    
    static ARM_SIZE_SLIM = "slim";
    static ARM_SIZE_WIDE = "wide";

    skinId;
    playFabId;
    resourcePatch;
    skinImage;
    animations;
    capeImage;
    geometryData;
    #geometryDataEngineVersion;
    animationData;
    capeId;
    fullSkinId;
    armSize;
    skinColor;
    personaPieces;
    pieceTintColors;
    isVerified_1;
    persona;
    premium;
    personaCapeOnClassic;
    isPrimaryUser_1;

    constructor(skinId, playFabId, resourcePatch, skinImage, animations = [], capeImage = null, geometryData = "", geometryDataEngineVersion = ProtocolInfo.MINECRAFT_VERSION, animationData = "", capeId = "", fullSkinId = null, armSize = SkinData.ARM_SIZE_WIDE, skinColor = "", personaPieces = [], pieceTintColors = [], isVerified = true, premium = false, persona = false, personaCapeOnClassic = false, isPrimaryUser = true) {
        this.skinId = skinId;
        this.playFabId = playFabId;
        this.resourcePatch = resourcePatch;
        this.skinImage = skinImage;
        this.animations = animations;
        this.capeImage = capeImage;
        this.geometryData = geometryData;
        this.#geometryDataEngineVersion = geometryDataEngineVersion;
        this.animationData = animationData;
        this.capeId = capeId;
        this.fullSkinId = fullSkinId ? fullSkinId : UUID.fromRandom().toString();
        this.armSize = armSize;
        this.skinColor = skinColor;
        this.personaPieces = personaPieces;
        this.pieceTintColors = pieceTintColors;
        this.isVerified_1 = isVerified;
        this.persona = persona;
        this.premium = premium;
        this.personaCapeOnClassic = personaCapeOnClassic;
        this.isPrimaryUser_1 = isPrimaryUser;
    }

    getSkinId(){
        return this.skinId;
    }

    getPlayFabId(){
        return this.playFabId;
    }

    getResourcePatch(){
        return this.resourcePatch;
    }

    getSkinImage(){
        return this.skinImage;
    }

    getAnimations(){
        return this.animations;
    }

    getCapeImage(){
        return this.capeImage;
    }

    getGeometryData(){
        return this.geometryData;
    }

    getGeometryDataEngineVersion() {
        return this.#geometryDataEngineVersion;
    }

    getAnimationData(){
        return this.animationData;
    }

    getCapeId(){
        return this.capeId;
    }

    getFullSkinId(){
        return this.fullSkinId;
    }

    getArmSize(){
        return this.armSize;
    }

    getSkinColor(){
        return this.skinColor;
    }

    getPersonaPieces(){
        return this.personaPieces;
    }

    getPieceTintColors(){
        return this.pieceTintColors;
    }

    isPersona(){
        return this.persona;
    }

    isPremium(){
        return this.premium;
    }

    isPersonaCapeOnClassic(){
        return this.personaCapeOnClassic;
    }

    isPrimaryUser(){
        return this.isPrimaryUser_1;
    }

    isVerified(){
        return this.isVerified_1;
    }

    setVerified(verified){
        this.isVerified_1 = verified;
    }
}

module.exports = SkinData;
