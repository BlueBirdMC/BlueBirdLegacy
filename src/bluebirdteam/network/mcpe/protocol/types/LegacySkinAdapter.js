const {is_array} = require("locutus/php/var");
const SkinData = require("./SkinData");
const SkinImage = require("./SkinImage");
const Skin = require("../../../../entity/Skin");
const crypto = require('crypto');

class LegacySkinAdapter {

    toSkinData(skin) {
        let capeData = skin.getCapeData();
        let capeImage = capeData === "" ? new SkinImage(0, 0, "") : new SkinImage(32, 64, capeData);
        let geometryName = skin.getGeometryName();
        if (geometryName === "") {
            geometryName = "geometry.humanoid.custom";
        }
        return new SkinData(
            skin.getSkinId(),
            "", //playfabid
            JSON.stringify({'geometry': {'default': geometryName}}),
            SkinImage.fromLegacy(skin.getSkinData()), [],
            capeImage,
            skin.getGeometryData()
        );
    }

    fromSkinData(data) {

        if (data.isPersona()) {
            return new Skin('Standard_Custom', crypto.randomBytes(3).toString('hex') + '\xff'.repeat(4096));
        }

        let capeData = data.isPersonaCapeOnClassic() ? "" : data.getCapeImage().getData();

        let geometryName = "";
        let resourcePatch = JSON.parse(data.getResourcePatch(), true);

        if (is_array(resourcePatch) && typeof resourcePatch['geometry']['default'] !== 'undefined' && typeof resourcePatch['geometry']['default'] === 'string') {
            geometryName = resourcePatch['geometry']['default'];
        } else {
            throw new Error("Missing geometry name field");
        }

        return new Skin(data.getSkinId(), data.getSkinImage().getData(), capeData, geometryName, data.getGeometryData());
    }
}

module.exports = LegacySkinAdapter;
