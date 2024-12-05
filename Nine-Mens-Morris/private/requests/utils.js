import { readFileSync, writeFileSync, existsSync } from "fs";
import crypto from "crypto";
import { sessions } from "./join.js";
let UsersData = [];

// [Login / Registration Functions]

export function getUsersData() {
  // Return the Users Data
  return UsersData;
}

export function readUsers() {
  let jsonData, Users;
  const filePath = "./private/data/users.json";

  // Check if the file already exists
  if (!existsSync(filePath)) {
    saveUsers();
  }
  // Read the saved data
  jsonData = readFileSync(filePath);

  // Check if there is any data
  if (jsonData != "") {
    // Parse the info
    Users = JSON.parse(jsonData.toString());
    // Update the main users list
    UsersData = Array.isArray(Users) ? Users : [];
  } else {
    // Create a Empty Array
    UsersData = [];
  }
  console.log(UsersData);
}

export function saveUsers() {
  // Write the current state of the User Data Array
  writeFileSync("./private/data/users.json", JSON.stringify(UsersData));

  // Reload the Users
  readUsers();
}

export function addUser(nick, secretPassword) {
  // Check if the nick and the password exist
  if (!nick || !secretPassword) {
    return false;
  }

  // Define the User
  const user = {
    nick: nick,
    password: secretPassword,
  };

  // Add the User to the Array
  UsersData.push(user);

  // Save the User
  saveUsers();
  console.log("User added");
  return true;
}

export function userExists(username, password) {
  // Compute the secret password
  let secretPassword = crypto.createHash("md5").update(password).digest("hex");

  // Check if a User already exists with the given username and password
  return UsersData.some(
    (user) => user.nick === username && user.password === secretPassword
  );
}

export function getUser(username) {
  // Fetches a given user's data
  return UsersData.find((user) => user.nick === username);
}

// [Session Related Functions]

export function existsSession(gameHash) {
  // check if the session already exists
  return gameHash in sessions;
}

export function isGameOnGoing(gameHash) {
  // Return if the game is ongoing
  return sessions[gameHash].ongoing;
}

export function removeSession(gameHash) {
  // Remove the selected session associated with the given game hash
  delete sessions[gameHash];
}

// [Game Related Functions]

export function getGameInstance(gameHash) {
  if (existsSession(gameHash)) {
    // Return the game instance of the selected game session
    return sessions[gameHash].game;
  }
}

// [REQUESTS AND RESPONSES]

export async function receive(req) {
  let data = "";

  // Accumulate data chunks
  req.on("data", (chunk) => {
    data += chunk;
  });

  // Wait for the 'end' event or handle errors
  await new Promise((resolve, reject) => {
    req.on("end", resolve);
    req.on("error", reject);
  });

  // Return accumulated data
  return JSON.parse(data);
}

export function send(res, body) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(JSON.stringify(body));
  res.end();
}

export function error(res, msg) {
  res.writeHead(400, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(JSON.stringify({ error: msg }));
  res.end();
}
