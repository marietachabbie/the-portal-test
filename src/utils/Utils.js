const { parse } = require('csv-parse');

const Transformer = require('../transformer/Transformer');


/**
 * 
 * @param {ReadableStream} inputStream
 * @param {WritableStream} outputStream
 */
module.exports.transformCSVStream = (inputStream, outputStream) => {
    const transformer = new Transformer();
    const parser = parse({
        delimiter: ',',
        columns: true,
        ignore_last_delimiters: true,
        bom: true,
    });

    inputStream
        .pipe(parser)
        .on('data', (record) => {
            transformer.putOnShelves(record);
        })
        .on('end', () => {
            transformer.transformCSVStream(outputStream);
        })
        .on('error', (error) => {
            throw error;
        });
}
