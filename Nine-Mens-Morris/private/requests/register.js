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
import crypto from "crypto";

export async function register(req, res) {
  // Get the request
  let user = await receive(req);

  // Compute the Cypher Password
  const secretPassword = crypto
    .createHash("md5")
    .update(user.password)
    .digest("hex");

  // Check if the User Already exists
  if (userExists(user.nick)) {
    // Perform Login

    // Fetch the User
    let currentUser = getUser(user.nick);

    // Check if the Secret Password is the same as the one saved
    if (currentUser.password === secretPassword) {
      // Send empty message
      return send(res, {});
    } else {
      // User Already exist - Send error
      return error(res, "User already exists! Please check your Password!");
    }
  } else {
    // Perform Registration

    // Add the User to the Array
    addUser(user.nick, secretPassword);

    // Send empty message
    return send(res, {});
  }
}
