const CONSTANTS = require('../utils/Constants');

class Transformer {
    constructor() {
        const alphabet = CONSTANTS.ALPHABET;
        this.bays = {};

        alphabet.forEach(char => {
            this.bays[char] = Array(10);
        })

        alphabet.forEach(char => {
            this.bays[alphabet[0] + char] = Array(10);
        })
    }

    /**
     * 
     * @param {{product_code: string, quantity: number, pick_location: string }} record 
     */
    putOnShelves (record) {
        const [column, shelf] = record.pick_location.split(' ');
        if (!this.bays[column][shelf]) {
            this.bays[column][shelf] = {};
        }

        if (!this.bays[column][shelf][record.product_code]) {
            this.bays[column][shelf][record.product_code] = 0;
        }

        this.bays[column][shelf][record.product_code] += parseInt(record.quantity);
    }

    /**
     * 
     * @returns {Array<string>}
     */
    listItemsToPickUp () {
        const itemsToPickUp = [];
        for (const column in this.bays) {
            this.bays[column].forEach((shelf, i) => {
                if (shelf) {
                    let item = [];
                    const shelfName = `${column} ${i}`;
                    for (const product_code in shelf) {
                        item.push(product_code);
                        item.push(shelf[product_code]);
                        item.push(shelfName);
                        itemsToPickUp.push(item);
                        item = [];
                    }
                }
            });
        }

        return itemsToPickUp;
    }
}

module.exports = Transformer;
