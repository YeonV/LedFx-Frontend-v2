const { execFile } = require('child_process');
const path = require('path');

const exePath = path.join(__dirname, 'path_to_dist_folder', 'media.exe');

execFile(exePath, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    try {
        const mediaInfo = JSON.parse(stdout);
        if (mediaInfo.error) {
            console.log(mediaInfo.error);
        } else {
            console.log(`Title: ${mediaInfo.title}`);
            console.log(`Artist: ${mediaInfo.artist}`);
            console.log(`Album: ${mediaInfo.album}`);
        }
    } catch (parseError) {
        console.error(`JSON Parse Error: ${parseError.message}`);
    }
});