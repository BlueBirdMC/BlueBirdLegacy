class SkinImage {

    height;
    width;
    data;

    constructor(height, width, data) {
        if(height < 0 || width < 0){
            throw new Error("unknown height and width");
        }
        let expected, actual;
        if((expected = height * width * 4) !== (actual = data.length)){
            throw new Error(`data should be ${expected} got ${actual}`);
        }
        this.height = height;
        this.width = width;
        this.data = data;
    }

    static fromLegacy(data){
        switch (data.length){
            case 64 * 32 * 4:
                return new SkinImage(32, 64, data);
            case 64 * 64 * 4:
                return new SkinImage(64, 64, data);
            case 128 * 128 * 4:
                return new SkinImage(128, 128, data);
        }
        throw new Error("unknown size");
    }

    getHeight(){
        return this.height;
    }

    getWidth(){
        return this.width;
    }

    getData(){
        return this.data;
    }
}

module.exports = SkinImage;