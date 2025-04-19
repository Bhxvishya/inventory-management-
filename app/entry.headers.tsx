export function headers() {
  const isDev = process.env.NODE_ENV === "development";

  return {
    "Content-Security-Policy": [
      "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.netlify.app data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'" + (isDev ? " http://localhost:*" : ""),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'" + (isDev
        ? " ws://localhost:* http://localhost:*"
        : " https://*.netlify.app"),
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; "),
  };
}
