const http = require("http");
const serverHandle = require("./app");

const port = 8000;

const server = http.createServer(serverHandle);

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`);
});
