import fs from 'fs';
import util from 'util';
import {exec} from 'child_process';

const execPromisified = util.promisify(exec);

export default class Assembler {
    /**
     * @param {string} fileListPath
     * @param {string} tsFilePath
     * @param {string} mp4FilePath
     */
    constructor(fileListPath, tsFilePath, mp4FilePath) {
        this.fileListPath = fileListPath;
        this.tsFilePath = tsFilePath;
        this.mp4FilePath = mp4FilePath;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {number} firstIndex
     * @param {number} lastIndex
     * @returns {Promise<void>}
     */
    async assembleAsSimpleBinaryFiles(firstIndex, lastIndex) {
        console.log('Using just simple merging for the assembly.');
        const targetStream = fs.createWriteStream(this.mp4FilePath, {flags: 'w'});
        for (let i = firstIndex; i <= lastIndex; i++) {
            await this.concatenateFile(this.getPath(i), targetStream);
        }
        console.log('Bytes written: ' + targetStream.bytesWritten);
        targetStream.close();
    }

    /**
     * @param {number} firstIndex
     * @param {number} lastIndex
     * @returns {Promise<void>}
     */
    async assembleWithFfmpeg(firstIndex, lastIndex) {
        console.log('Using Ffmpeg for the assembly.');
        await this.generateFileList(firstIndex, lastIndex);
        console.log('Generated file list.');
        await this.concatToTsWithFfmpeg();
        console.log('Concatenated files to a TS file.');
        await this.convertTsToMp4WithFfmpeg();
        console.log('Converted TS file to MP4 file.');
    }

    /**
     * @param {number} firstIndex
     * @param {number} lastIndex
     * @returns {Promise<void>}
     */
    async generateFileList(firstIndex, lastIndex) {
        const fileList = [];
        for (let i = firstIndex; i <= lastIndex; i++) {
            fileList.push(`./data/segments/${i}`);
        }
        const fileListAsString = fileList.join('\n');
        return fs.promises.writeFile(this.fileListPath, fileListAsString);
    }

    async concatToTsWithFfmpeg() {
        return execPromisified(`ffmpeg -f concat -i ${this.fileListPath} -c copy ${this.tsFilePath}`);
    }

    async convertTsToMp4WithFfmpeg() {
        return execPromisified(`ffmpeg -i ${this.tsFilePath} -acodec copy -vcodec copy ${this.mp4FilePath}`);
    }

    getPath(index) {
        return `./data/segments/${index}`;
    }

    async concatenateFile(filename, targetStream) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filename, {highWaterMark: 1024});

            readStream.on('data', function (chunk) {
                targetStream.write(chunk);
            });
            readStream.on('error', e => {
                reject(e);
            });
            readStream.on('close', function (err) {
            });
            readStream.on('end', function () {
                readStream.close();
                resolve();
            });
        });
    }
}