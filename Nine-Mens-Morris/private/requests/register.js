import {
  receive,
  send,
  error,
  readUsers,
  userExists,
  getUser,
  addUser,
  saveUsers,
  validateObject,
} from "./utils.js";
import crypto from "crypto";

const REGISTER_SPEC = {
  nick: "string",
  password: "string",
};

export async function register(req, res) {
  // Get the request
  let user = await receive(req);

  // Compute the Cypher Password
  const secretPassword = crypto
    .createHash("md5")
    .update(user.password)
    .digest("hex");

  // Validate request
  const validationError = validateObject(user, REGISTER_SPEC);
  if (validationError) {
    return error(res, validationError);
  }

  // Check if the User Already exists
  let currentUser = getUser(user.nick);
  if (currentUser) {
    // Perform Login

    // Check if the Secret Password is the same as the one saved
    if (currentUser.password === secretPassword) {
      // Send empty message
      return send(res, {});
    } else {
      // User Already exist - Send error
      return error(
        res,
        "User already exists! Please check your Password!",
        401
      );
    }
  } else {
    // Perform Registration

    // Add the User to the Array
    addUser(user.nick, secretPassword);

    // Send empty message
    return send(res, {});
  }
}
