import { receive, send, error } from "./utils.js";
import sessions from "./join.js";
import { Game } form "../../public/static/js/logicGame.js"

export async function notify(req, res) {
  const request = await receive(req);
  if (!request.nick || !request.password || !request.game || !request.move) {
    error(res, `missing arguments ${request}`);
    return;
  }

  if (!request.game in sessions) {
    error(res, `game does not exist: ${request.game}`);
    return;
  }
}
