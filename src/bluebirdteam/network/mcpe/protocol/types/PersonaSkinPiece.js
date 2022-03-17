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

class PersonaSkinPiece {
    static PIECE_TYPE_PERSONA_BODY = "persona_body";
    static PIECE_TYPE_PERSONA_BOTTOM = "persona_bottom";
    static PIECE_TYPE_PERSONA_EYES = "persona_eyes";
    static PIECE_TYPE_PERSONA_FACIAL_HAIR = "persona_facial_hair";
    static PIECE_TYPE_PERSONA_FEET = "persona_feet";
    static PIECE_TYPE_PERSONA_HAIR = "persona_hair";
    static PIECE_TYPE_PERSONA_MOUTH = "persona_mouth";
    static PIECE_TYPE_PERSONA_SKELETON = "persona_skeleton";
    static PIECE_TYPE_PERSONA_SKIN = "persona_skin";
    static PIECE_TYPE_PERSONA_TOP = "persona_top";

    #pieceId;

    #pieceType;

    #packId;

    #isDefaultPiece;

    #productId;

    constructor(pieceId, pieceType, packId, isDefaultPiece, productId) {
        this.#pieceId = pieceId;
        this.#pieceType = pieceType;
        this.#packId = packId;
        this.#isDefaultPiece = isDefaultPiece;
        this.#productId = productId;
    }

    getPieceId(){
        return this.#pieceId;
    }

    getPieceType(){
        return this.#pieceType;
    }

    getPackId(){
        return this.#packId;
    }

    isDefaultPiece(){
        return this.#isDefaultPiece;
    }

    getProductId(){
        return this.#productId;
    }
}

module.exports = PersonaSkinPiece;