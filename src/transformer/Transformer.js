class Transformer {
    constructor() {
        this.bays = {};
        for (let i = 65; i < 91; i++) {
            this.bays[String.fromCharCode(i)] = Array(10);
        }

        const A = String.fromCharCode(65);
        for (let i = 65; i < 91; i++) {
            this.bays[A + String.fromCharCode(i)] = Array(10);
        }
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
     * @param {WritableStream} outputStream 
     */
    transformCSVStream (outputStream) {
        const columns = ['product_code', 'quantity', 'pick_location'];
        outputStream.write(columns.join(',') + '\n');
        for (const column in this.bays) {
            this.bays[column].forEach((shelf, i) => {
                if (shelf) {
                    const shelfName = `${column} ${i}`;
                    for (const product_code in shelf) {
                        outputStream.write(`${product_code},${shelf[product_code]},${shelfName}\n`);
                    }
                }
            });
        }

        outputStream.end();
    }
}

module.exports = Transformer;
