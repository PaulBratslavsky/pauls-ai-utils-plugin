"use strict";
const path = require("path");
const fs = require("fs");
const os = require("os");

module.exports = ({ strapi }) => ({
  async getTranscript(ctx) {
    const videoId = ctx.params.videoId;

    const found = await strapi
      .plugin("ai-utils")
      .service("transcript")
      .findTranscript(videoId);

    if (found) return { data: { text: found } };

    const systemTempDir = os.tmpdir();
    const newTempDirPath = path.join(systemTempDir, videoId);

    fs.mkdtemp(newTempDirPath, (err, directory) => {
      if (err) return console.error("Error creating temporary directory:", err);
      console.log("Temporary directory created:", directory);
    });

    try {
      const audioFilePath = await strapi
        .plugin("ai-utils")
        .service("utils")
        .downloadAudioFile(videoId, newTempDirPath);

      const transcription = await strapi
        .plugin("ai-utils")
        .service("aiUtils")
        .whisper(audioFilePath);

      if (transcription) {
        const payload = { videoId: videoId, transcript: transcription.text };

        await strapi
          .plugin("ai-utils")
          .service("transcript")
          .saveTranscript(payload);
      }

      // TODO: figure this out later - how to delete the temp directory
      // if (transcription) fs.rmdirSync(newTempDirPath, { recursive: true });

      return { data: transcription };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});
