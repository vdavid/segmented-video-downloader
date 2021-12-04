import Downloader from './Downloader.mjs';
import Assembler from './Assembler.mjs';

/* Parse arguments */
const args = process.argv.slice(2);
const pattern = args[0];
const firstIndex = parseInt(args[1]);
const lastIndex = parseInt(args[2]);

console.log(`Downloading "${pattern}" from ${firstIndex} to ${lastIndex}.`);

/* Do a simple config */
const fileListPath = './data/file-list.txt';
const tsFilePath = './data/merged.ts';
const mp4FilePath = './data/merged.mp4';
const waitTimeBetweenRequestsInMilliseconds = 300;

/* Create tools */
const downloader = new Downloader(pattern);
const assembler = new Assembler(fileListPath, tsFilePath, mp4FilePath);

/* Download and assemble to file */
console.log(`Downloading files with a ${waitTimeBetweenRequestsInMilliseconds}ms wait between each.`);
await downloader.downloadFiles(firstIndex, lastIndex, waitTimeBetweenRequestsInMilliseconds);
console.log('Downloaded files.');
//await assembler.assembleAsSimpleBinaryFiles(firstIndex, lastIndex);
await assembler.assembleWithFfmpeg(firstIndex, lastIndex);
console.log('Assembled file, we\'re done here.');