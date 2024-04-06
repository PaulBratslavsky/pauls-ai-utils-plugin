module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/transcript/:videoId',
      handler: 'aiUtils.getTranscript',
      config: {
        middlewares: ["plugin::ai-utils.isUserAuthenticated"]
      }
    },
  ],
}