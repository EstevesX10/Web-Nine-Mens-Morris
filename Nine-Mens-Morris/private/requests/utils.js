import { readFileSync, writeFileSync, existsSync } from "fs";

let UsersData = [];

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

export function userExists(username) {
  // Check if a User already exists
  return UsersData.some((user) => user.nick === username);
}

export function getUser(username) {
  // Fetches a given user's data
  return UsersData.find((user) => user.nick === username);
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
