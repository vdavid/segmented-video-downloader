## Intro

This is a little tool to download videos that are broken to segments, and assemble them into a single video.

## How to use

Call the script as follows:

`node index.mjs "<URL pattern>" <firstIndex> <lastIndex>`

The URL pattern must contain the string "{index}" which will be replaced by the index.

Example:
```
node index.mjs "https://www.videos.com/watch?v={index}.ts" 1 10
```

## Configuration

### Download

The wait time between downloads can be customized in `index.mjs`. By default, it's set to `300` milliseconds.

### Merge

For the merging, there is a simple concatenation algorithm, and one that uses ffmpeg.
By default, this tool uses ffmpeg.
For that to work, you'll need ffmpeg installed, and for it to be in the PATH.
Modify `index.mjs` (uncomment-comment the line that contains the algorithm you want to use) to use the simple algorithm.

## Thanks
For the assembly howto: https://superuser.com/questions/692990/use-ffmpeg-copy-codec-to-combine-ts-files-into-a-single-mp4