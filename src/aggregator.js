const { Transform } = require("stream");

class Aggregator extends Transform {
    constructor(options) {
        super(
            Object.assign({ objectMode: true }, options)
        );

        this._initBays();
    }

    _flush(callback) {
        try {
            this._flushAggregated();
            callback();
        } catch (error) {
            callback(error);
        }
    }

    _transform(record, encoding, callback) {
        try {
            this._putOnShelves(record);
            callback();
        } catch (error) {
            callback(error);
        }
    }

    _initBays() {
        this.bays = {};

        for (let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
            this.bays[String.fromCharCode(i)] = [];
        }

        for (let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
            this.bays['A' + String.fromCharCode(i)] = [];
        }
    }

    _parseLocation (location) {
        const regex = /^(A?[A-Z])\s+((10)|[1-9])$/g;
        const match = regex.exec(location);

        if (!match) {
            throw new Error(`Bad location: ${location}`);
        }

        return { bay: match[1], shelf: this._parseInt(match[2]) };
    }

    _parseInt (str) {
        const inum = + str;
        const pnum =parseInt(str);
        
        if (inum == NaN || pnum != inum) {
            throw new Error(`Not a number: ${str}`);
        }

        return pnum;
    }

    _putOnShelves (record) {
        const loc = this._parseLocation(record.pick_location);

        if (!this.bays[loc.bay][loc.shelf]) {
            this.bays[loc.bay][loc.shelf] = {};
        }

        if (!this.bays[loc.bay][loc.shelf][record.product_code]) {
            this.bays[loc.bay][loc.shelf][record.product_code] = 0;
        }

        this.bays[loc.bay][loc.shelf][record.product_code] += this._parseInt(record.quantity);
    }

    _flushAggregated () {
        for (const bay in this.bays) {
            for (const shelf in this.bays[bay]) {
                for (const product_code in this.bays[bay][shelf]) {
                    this.push({
                        product_code: product_code,
                        quantity: this.bays[bay][shelf][product_code],
                        pick_location: `${bay} ${shelf}`,
                    })
                }
            };
        }
    }
}

module.exports = Aggregator;
