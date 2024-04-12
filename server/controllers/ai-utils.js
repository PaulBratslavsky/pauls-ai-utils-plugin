"use strict";
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;
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

        console.log("Transcription:", transcription.segments)
        const payload = { 
          videoId: videoId, 
          transcript: transcription.text, 
          language: transcription.language,
          duration: transcription.duration,
          json: JSON.stringify(transcription.segments),
        };

        const transcript = await strapi
          .plugin("ai-utils")
          .service("transcript")
          .saveTranscript(payload);

        if (transcript.id) {
          fsPromise.rm(newTempDirPath, { recursive: true }).catch(() => {
            console.log("failed to delete.");
          });
        }
      }

      return ctx.send({ data: transcription.text });
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});
