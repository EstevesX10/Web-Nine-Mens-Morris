// const http = new require("http");
import http from "http";

const PORT = 8004;

import { writeUserData } from "./private/UsersData.js";

class Server {
  constructor(routes) {
    this.routes = routes;
    this.server = http.createServer((req, res) => {
      const method = req.method;
      const url = req.url;
      const handler =
        (this.routes[method] && this.routes[method][url]) ||
        this.routes["default"];

      handler(req, res);
    });
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  on(event, callback) {
    this.server.on(event, callback);
  }
}

const routes = {
  GET: {},
  POST: {
    // "/register": register,
    // "/ranking": ranking,
    // "/join": join,
  },
  default: (req, res) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found\n");
  },
};

const server = new Server(routes);

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT + "...");
  //   readUsersData();
  //   writeUserData();
});

server.on("error", (err) => {
  console.error(err);
});

server.on("listening", () => {
  console.log("Server is listening...");
});

server.on("connection", (socket) => {
  console.log("IP address of client: ", socket.remoteAddress);
});
