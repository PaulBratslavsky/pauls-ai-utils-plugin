"use strict";
const OpenAI = require("openai").OpenAI;
const fs = require("fs");

module.exports = ({ strapi }) => ({
  async whisper(audioFilePath) {
    const pluginSettings = await strapi.config.get("plugin.ai-utils");
    const openai = new OpenAI({ apiKey: pluginSettings.openAIApiKey });

    try {
      const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
      });
      return response; 
    } catch (error) {
      console.error("Error in the whisper function:", error);
      throw error; // Rethrow or handle the error as appropriate
    }
  },
});
