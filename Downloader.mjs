import https from 'https';
import fs from 'fs';

export default class Downloader {
    /**
     * @param {string} urlPattern Should contain "{index}" somewhere, that will be replaced with the indexes.
     */
    constructor(urlPattern) {
        this.urlPattern = urlPattern;
    }

    async downloadFiles(firstIndex, lastIndex, waitTimeBetweenRequestsInMilliseconds) {
        for(let i = firstIndex; i <= lastIndex; i++) {
            try {
                await this.downloadFile(this.getUrl(i), this.getPath(i));
                console.log(`Downloaded segment ${i}`);
                await this.sleep(waitTimeBetweenRequestsInMilliseconds);
            } catch(error) {
                console.log(error);
            }
        }
    }

    downloadFile(url, targetFilePath) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(targetFilePath);
            https.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(targetFilePath, () => {});
                reject(err.message);
            });
        });
    }

    getPath(index) {
        return `./data/segments/${index}`;
    }

    getUrl(index) {
        return this.urlPattern.replace(/{index}/g, index);
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
