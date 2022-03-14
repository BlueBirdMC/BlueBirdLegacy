class PersonaPieceTintColor {
    static PIECE_TYPE_PERSONA_EYES = "persona_eyes";
    static PIECE_TYPE_PERSONA_HAIR = "persona_hair";
    static PIECE_TYPE_PERSONA_MOUTH = "persona_mouth";

    #pieceType;

    #colors;

    constructor(pieceType, colors) {
        this.#pieceType = pieceType;
        this.#colors = colors;
    }

    getPieceType(){
        return this.#pieceType;
    }

    getColors(){
        return this.#colors;
    }
}

module.exports = PersonaPieceTintColor;