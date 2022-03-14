const {in_array} = require("locutus/php/array");

class Skin {
    static ACCEPTED_SKIN_SIZES = [
        64 * 32 * 4,
        64 * 64 * 4,
        128 * 128 * 4
    ];

    #skinId;

    #skinData;

    #capeData;

    #geometryName;

    #geometryData;

    constructor(skinId, skinData, capeData = "", geometryName = "", geometryData = "") {
        this.#skinId = skinId;
        this.#skinData = skinData;
        this.#capeData = capeData;
        this.#geometryName = geometryName;
        this.#geometryData = geometryData;
    }

    isValid(){
        try {
            this.validate();
            return true;
        }catch (e){
            return false;
        }
    }

    static #checkLength(thing, name, maxLength){
        if(thing.length > maxLength){
            throw new Error(`${name} must be at most ${maxLength} but have ${thing.length}`);
        }
    }

    validate(){
        this.constructor.#checkLength(this.#skinId, "Skin ID", 32767);
        this.constructor.#checkLength(this.#geometryName, "Geometry name", 32767);
        this.constructor.#checkLength(this.#geometryData, "Geometry data", 0x7fffffff);

        if(this.#skinId === ""){
            throw new Error("Skin id must not be empty");
        }
        let length = this.#skinData.length;

        if(!in_array(length, Skin.ACCEPTED_SKIN_SIZES, true)){
            throw new Error(`Invalid skin data size ${length} bytes (allowed sizes: ${Skin.ACCEPTED_SKIN_SIZES.join(', ')})`);
        }
        if(this.#capeData !== "" && this.#capeData.length !== 8192){
            throw new Error("Invalid cape data size " + this.#capeData.length + " bytes (must be exactly 8192 bytes)");
        }
    }

    /** @return {String} */
    getSkinId() {
        return this.#skinId;
    }

    /** @return {String} */
    getSkinData() {
        return this.#skinData;
    }

    /** @return {String} */
    getCapeData() {
        return this.#capeData;
    }

    /** @return {String} */
    getGeometryName() {
        return this.#geometryName;
    }

    /** @return {String} */
    getGeometryData() {
        return this.#geometryData;
    }

    debloatGeometryData() {
        if (this.#geometryData !== "") {
            this.#geometryData = JSON.stringify(JSON.parse(this.#geometryData));
        }
    }
}

module.exports = Skin;