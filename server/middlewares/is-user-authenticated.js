module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const isAuthenticated = ctx.state.isAuthenticated;
    const customAuthType = ctx.state.auth.credentials.type === "custom";

    if (!isAuthenticated || !customAuthType) return ctx.unauthorized('You are not authenticated');
    console.log('state from middleware', isAuthenticated, customAuthType);
    await next();
  }
};