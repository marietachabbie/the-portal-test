const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

const Transformer = require('../transformer/Transformer');
const CONSTANTS = require('./Constants');

/**
 * 
 * @param {Array<string>} itemsToPickUp
 * @param {WritableStream} writeStream
 */
const outputIntoCSV = (itemsToPickUp, writeStream) => {
    const columns = {
        product_code: CONSTANTS.PRODUCT_CODE,
        quantity: CONSTANTS.QUANTITY,
        pick_location: CONSTANTS.PICK_LOCATION,
    }
    const stringifier = stringify({ header: true, columns: columns });

    itemsToPickUp.forEach(item => {
        stringifier.write(item);
    });
    stringifier.pipe(writeStream);
}

/**
 * 
 * @param {ReadableStream} inputStream
 * @param {WritableStream} outputStream
 */
module.exports.transformCSVStream = (inputStream, outputStream) => {
    const transformer = new Transformer();
    inputStream
        .pipe(csv())
        .on('data', (record) => {
            transformer.putOnShelves(record);
        })
        .on('end', () => {
            const itemsToPickUp = transformer.listItemsToPickUp();
            outputIntoCSV(itemsToPickUp, outputStream);
        })
        .on('error', (error) => {
            throw error;
        });
}
