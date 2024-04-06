const YTDL = require("@yohancolla/ytdl");
const path = require("path");
const fs = require("fs");

module.exports = ({ strapi }) => ({
  async downloadAudioFile(videoId, directoryPath) {
    console.log("Downloading Audio file to path...", directoryPath);

    const ytdl = new YTDL({
      outputPath: directoryPath,
      queueParallelism: 2,
      progressTimeout: 2000,
      deleteTimeout: 60,
    });

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return new Promise((resolve, reject) => {
      // Assuming toMp3 function accepts the video URL and quality directly
      ytdl.toMp3(videoUrl, "highestaudio");

      ytdl.on("finish", (err, data) => {
        if (err) {
          console.error("Download error:", err);
          return reject(err);
        }
        console.log("Download completed:", data);
        // Optionally verify the file here again if necessary
        resolve(data.output);
      });

      ytdl.on("error", (error) => {
        console.error("Error during download:", error);
        reject(error);
      });

      ytdl.on("progress", (progress) => {
        console.log("Download progress:", JSON.stringify(progress));
      });
    });
  },
});



// JSON.stringify(progress)



/*

fs.stat(downloadFilePath, (err, stats) => {
  if (err) {
    // Handle error (file might not exist or other errors)
    return reject(err);
  }
  if (stats.size > 0) {
    // File exists and is not empty
    resolve(downloadFilePath);
  } else {
    // File exists but is empty, may need to handle this case
    reject(new Error("File exists but is empty"));
  }
});

*/