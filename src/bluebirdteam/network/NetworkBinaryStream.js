const UUID = use("utils/UUID");

'use strict'

class NetworkBinaryStream extends require("bluebirdmc-binarystream"){

    /**
     * @return {string}
     */
    readString(){
        return this.read(this.readUnsignedVarInt().toString());
    }

    /**
     * @param v {string}
     * @return {NetworkBinaryStream}
     */
    writeString(v){
        this.writeUnsignedVarInt(Buffer.byteLength(v));
        this.append(v);
        return this;
    }

    /**
     * @return {UUID}
     */
    readUUID(){
        let [p1, p0, p3, p2] = [this.readLInt(), this.readLInt(), this.readLInt(), this.readLInt()];

        return new UUID(p0, p1, p2, p3);
    }

    /**
     * @param uuid {UUID}
     * @return {NetworkBinaryStream}
     */
    writeUUID(uuid){
        this.writeLInt(uuid.getPart(1))
            .writeLInt(uuid.getPart(0))
            .writeLInt(uuid.getPart(3))
            .writeLInt(uuid.getPart(2));

        return this;
    }

    writeGameRules(rules){
        this.writeUnsignedVarInt(rules.length);
        rules.forEach(rule => {
            this.writeString(rule.getName());
            if (typeof rule.getValue() === "boolean") {
                this.writeByte(1);
                this.writeBool(rule.getValue());
            } else if (Number.isInteger(rule.getValue())) {
                this.writeByte(2);
                this.writeUnsignedVarInt(rule.getValue());
            } else if (typeof rule.getValue() === "number" && !Number.isInteger(rule.getValue())) {
                this.writeByte(3);
                this.writeLFloat(rule.getValue());
            }
        });

        return this;
    }
    //TODO: Add everything else
}
module.exports = NetworkBinaryStream
