const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/Primary/?FlowAlias=portal_api_sgin_sign_in&action=api', {
      target: 'https://decisions.truebpm.vn/',
      changeOrigin: true,
    })
  );
};
