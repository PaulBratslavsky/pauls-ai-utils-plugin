"use strict";

module.exports = {
  kind: "collectionType",
  collectionName: "transcripts",
  info: {
    singularName: "transcript",
    pluralName: "transcripts",
    displayName: "transcript",
  },

  pluginOptions: {
    "content-manager": {
      visible: true,
    },

    "content-type-builder": {
      visible: false,
    },
  },
  options: {
    draftAndPublish: false,
    comment: "",
  },
  attributes: {
    videoId: {
      type: "string",
    },
    transcript: {
      type: "richtext",
    },
  },
};
