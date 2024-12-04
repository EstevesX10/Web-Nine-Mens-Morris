import { readFileSync, writeFileSync } from "fs";

let UsersData = [];

export function getUsersData() {
  // Return the Users Data
  return UsersData;
}

export function readUsers() {
  let jsonData, Users;

  // Read the saved data
  jsonData = readFileSync("./private/data/users.json");

  // Check if there is any data
  if (jsonData != "") {
    // Parse the info
    Users = JSON.parse(jsonData.toString());
  } else {
    // Create a Empty Array
    Users = [];
  }

  // Update the main users list
  UsersData = Array.isArray(Users) ? Users : [];
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

export function userExists(username) {
  // Check if a User already exists
  return UsersData.some((user) => {
    user.nick === nickToCheck;
  });
}

export function getUser(username) {
  // Fetches a given user's data
  return UsersData.find((user) => {
    user.nick === username;
  });
}

export function printUsers() {
  console.log(UsersData.toString());
}

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
  return data;
}

export function respond(res, body) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(Json.stringify(body));
  response.end();
}

export function error(res, msg) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(Json.stringify({ error: msg }));
  response.end();
}
