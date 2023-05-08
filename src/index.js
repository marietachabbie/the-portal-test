#!/usr/bin/env node

(() => {
    try {
        const Utils = require('./utils/Utils');
        const fs = require('fs');
        const args = require('yargs')
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

        let inputStream = process.stdin;
        let outputStream = process.stdout;

        if (args.input && args.input != '' && args.input != '-') {
            inputStream = fs.createReadStream(args.input);
        }

        if (args.output && args.output != '' && args.output != '-') {
            outputStream = fs.createWriteStream(args.output);
        }

        Utils.transformCSVStream(inputStream, outputStream);
    } catch (error) {
        console.error('Something went wrong.');
        console.error(error);
    }
})();
