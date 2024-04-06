"use strict";

module.exports = ({ strapi }) => ({
  async saveTranscript(payload) {
    return await strapi.entityService.create("plugin::ai-utils.transcript", {
      data: { ...payload },
    });
  },

  async findTranscript(videoId) {
    const transcript = await strapi.entityService.findMany("plugin::ai-utils.transcript", {
      filters: { videoId },
    });

    console.log("Transcript found:", transcript);

    if (transcript.length === 0) return null;
    return transcript[0].transcript;
  },
});
