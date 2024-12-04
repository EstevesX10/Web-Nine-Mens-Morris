import { ranking } from "./requests/ranking.js";
import { register } from "./requests/register.js";

export const routes = {
  GET: {},
  POST: {
    "/register": register,
    "/ranking": ranking,
    // "/join": join,
  },
  default: (req, res) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found\n");
  },
};
