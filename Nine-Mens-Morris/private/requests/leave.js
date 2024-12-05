import {
  receive,
  send,
  error,
  userExists,
  existsSession,
  isGameOnGoing,
  removeSession,
} from "./utils.js";

export async function leave(req, res) {
  // Get the request
  let userLeave = await receive(req);

  console.log(userLeave);

  // Check if any argument was ommised
  if (!userLeave.nick || !userLeave.password || !userLeave.game) {
    // Missing Arguments
    return error(
      res,
      "Missing Arguments! Please ensure your request contains all the information!"
    );
  }

  // Check if the received nick exists
  if (!userExists(userLeave.nick, userLeave.password)) {
    // Inexistent User
    return error(
      res,
      `Invalid User (${userLeave.nick})! Please perform Registration!`
    );
  }

  // Check if the game hash corresponds to an existing game
  if (!existsSession(userLeave.game)) {
    return error(res, `Invalid Game Session (game hash = ${userLeave.game})!`);
  }

  // Check if the session is not ongoing and remove it
  if (!isGameOnGoing(userLeave.game)) {
    // Remove Non Going Session
    removeSession(userLeave.game);
  }

  // Everything looks good and the user left
  return send(res, {});
}
