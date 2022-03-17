class Entity {

    static entityCount = 1;

    id;

    constructor() {
        this.id = Entity.entityCount++;
    }
}

module.exports = Entity;