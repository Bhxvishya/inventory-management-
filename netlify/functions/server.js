const { createRequestHandler } = require("@remix-run/netlify");
const build = require("../../build/server");

exports.handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV || "production",
});