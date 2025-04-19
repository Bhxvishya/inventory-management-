const { createRequestHandler } = require("@remix-run/netlify");
const build = require("../../build/server/index.js");

exports.handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: () => ({})
});