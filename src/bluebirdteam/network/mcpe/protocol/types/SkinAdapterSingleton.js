const LegacySkinAdapter = require("./LegacySkinAdapter");

class SkinAdapterSingleton {
    static #instance = null;

    /**
     * @returns {LegacySkinAdapter}
     */
    static get(){
        if(this.#instance === null){
            this.#instance = new LegacySkinAdapter();
        }
        return this.#instance;
    }

    /**
     * @param adapter {LegacySkinAdapter}
     */
    static set(adapter){
        this.#instance = adapter;
    }
}

module.exports = SkinAdapterSingleton;