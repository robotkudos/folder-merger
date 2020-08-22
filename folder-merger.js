#!/usr/local/bin/node
const fs = require('fs');
const path = require('path');

const outputFolder = 'Output';

if (!fs.existsSync('Output')) {
    fs.mkdirSync('Output');
}


fs.readdirSync('.').forEach(file => {
    moveFiles(file, outputFolder);
});

function moveFiles(srcFolder, destFolder) {
    let stats;
    fs.readdirSync(srcFolder).forEach(file => {
        if (file !== '.DS_Store') {
            stats = fs.statSync(path.join(srcFolder, file));
            if (stats.isFile()) {
                const availableFilename = getFilename(path.basename(file));
                fs.renameSync(path.join(srcFolder,file), path.join(destFolder, availableFilename));
            } else {
                moveFiles(file, destFolder);
            }

        }
    });

}

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