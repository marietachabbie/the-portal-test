#!/usr/bin/env node
const Aggregator = require('./aggregator');
const { pipeline } = require('stream');
const fs = require('fs');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');
const yargs = require('yargs');

(() => {
    try {
        const args = yargs
            .option('input', {
                alias: 'i',
                describe: 'Input CSV file path. The default will be stdin.',
                default: '-',
                type: 'string',
            })
            .option('output', {
                alias: 'o',
                describe: 'Output CSV file path. The default will be stdout.',
                default: '-',
                type: 'string',
            })
            .strict()
            .argv;

        let input = process.stdin;
        let output = process.stdout;

        if (args.input && args.input != '' && args.input != '-') {
            input = fs.createReadStream(args.input);
        }

        if (args.output && args.output != '' && args.output != '-') {
            output = fs.createWriteStream(args.output);
        }

        const csv_reader = parse({
            delimiter: ',',
            trim: true,
            relax_column_count_more: true,
            columns: true,
            bom: true,
        });

        const csv_writer = stringify({
            delimiter: ',',
            header: true,
            columns: [ 'product_code', 'quantity', 'pick_location' ],
            bom: false,
        });

        const aggregator = new Aggregator();

        pipeline(
            input,
            csv_reader,
            aggregator,
            csv_writer,
            output,
            (error) => {
                if (error) { throw error; }

            }
        );
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
})();
