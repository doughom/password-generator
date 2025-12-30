// Serve files during development

const finalhandler = require("finalhandler");
const http = require("http");
const serveStatic = require("serve-static");
const serve = serveStatic("src");

const port = 3000;
const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(port);
console.log(`Running on http://localhost:${port} (Press CTRL+C to quit)`);
