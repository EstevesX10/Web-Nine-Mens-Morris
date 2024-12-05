import { ranking } from "./requests/ranking.js";
import { register } from "./requests/register.js";
import { join } from "./requests/join.js";
import { leave } from "./requests/leave.js";
import { notify } from "./requests/notify.js";

export const routes = {
  GET: {},
  POST: {
    "/register": register,
    "/ranking": ranking,
    "/join": join,
    "/leave": leave,
    "/notify": notify,
  },
  default: (req, res) => {
    res.writeHead(404, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end("404 Not Found\n");
  },
};
