class SkinAnimation {
    static TYPE_HEAD = 1;
    static TYPE_BODY_32 = 2;
    static TYPE_BODY_64 = 3;

    static EXPRESSION_TYPE_LINEAR = 0;
    static EXPRESSION_TYPE_BLINKING = 1;

    #image;
    #type;
    #frames;
    #expressionType;

    constructor(image, type, frames, expressionType) {
        this.#image = image;
        this.#type = type;
        this.#frames = frames;
        this.#expressionType = expressionType;
    }

    getImage(){
        return this.#image;
    }

    getType(){
        return this.#type;
    }

    getFrames(){
        return this.#frames;
    }

    getExpressionType(){
        return this.#expressionType;
    }
}

module.exports = SkinAnimation;