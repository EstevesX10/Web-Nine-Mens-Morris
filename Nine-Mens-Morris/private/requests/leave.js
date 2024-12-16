import {
  receive,
  send,
  error,
  userExists,
  existsSession,
  isGameOnGoing,
  removeSession,
  validateObject,
} from "./utils.js";

const LEAVE_SPEC = {
  nick: "string",
  password: "string",
  game: "string",
};

export async function leave(req, res) {
  // Get the request
  let userLeave = await receive(req);

  console.log(userLeave);

  // Check if any argument was ommised
  const validationError = validateObject(userLeave, LEAVE_SPEC);
  if (validationError) {
    return error(res, validationError);
  }

  // Check if the received nick exists
  if (!userExists(userLeave.nick, userLeave.password)) {
    // Inexistent User
    return error(
      res,
      `Invalid User (${userLeave.nick})! Please perform Registration!`,
      401
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
