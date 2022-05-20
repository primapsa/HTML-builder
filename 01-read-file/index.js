const libFs = require('fs');
const libPath = require('path');
const filename = 'text.txt';
const path = libPath.resolve(__dirname, filename);
const stdout = process.stdout;
const handle = libFs.ReadStream(path, 'utf-8');
let fullData = '';
handle.on('data', data => fullData += data);
handle.on('end', () => stdout.write(fullData));