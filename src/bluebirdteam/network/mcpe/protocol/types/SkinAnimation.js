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