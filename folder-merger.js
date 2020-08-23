#!/usr/local/bin/node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const outputFolder = 'Output';
let totalFiles = 0;

if (!fs.existsSync('Output')) {
    fs.mkdirSync('Output');
}

function success(msg) {
    console.log(chalk.bgGreen('Success:'), msg);
}

function error(msg, exitCode = 1) {
    console.log(chalk.white.bgRed('Error:'), msg);
    process.exit(exitCode);
}

moveFiles('.', outputFolder);

function moveFiles(src, destFolder) {
    let stats = fs.statSync(src);
    if (stats.isDirectory()) {
        // make sure we don't go through outputFolder which we are moving files to
        if (src == destFolder) return;
        fs.readdirSync(src).forEach(file => {
            moveFiles(path.join(src, file), outputFolder);
        });
    } else {
        const availableFilename = getFilename(path.basename(src));
        try {
            const dest = path.join(destFolder, availableFilename);
            fs.renameSync(src, dest);
            totalFiles++;
            success(src + chalk.yellow(' => ') + dest);
        } catch (err) {
            error(`Error occured: ${err}`);
        }
    }
}

console.log('------------------------');
console.log('Total files movied: ' + chalk.green(totalFiles));

// check if the filename is already exits in output 
// and return a new one with a number index
function getFilename(filename) {
    let file = filename;
    let ext;
    while (fs.existsSync(path.join(outputFolder, file))) {
        i = 0;
        ext = path.extname(file);
        file = path.basename(file, ext) + ' (' + ++i + ')' + ext;
    }
    return file;
}