import {
  receive,
  send,
  error,
  readUsers,
  userExists,
  getUser,
  addUser,
  saveUsers,
} from "./utils.js";
import { sessions } from "./join.js";

function existsSession(gameHash) {
  // check if the session already exists
  return gameHash in sessions;
}

function isGameOnGoing(gameHash) {
  // Return if the game is ongoing
  return sessions[gameHash].ongoing;
}

function removeSession(gameHash) {
  // Remove the selected session associated with the given game hash
  delete sessions[gameHash];
}

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
