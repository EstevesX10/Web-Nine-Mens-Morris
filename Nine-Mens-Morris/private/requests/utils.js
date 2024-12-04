import { readFileSync, writeFileSync } from "fs";

let UsersData = [];

export function getUser(user) {}

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

export function writeUserData() {
  // Write the current state of the User Data Array
  writeFileSync("./private/data/users.json", JSON.stringify(UsersData));

  // Reload
  // readUsersData();
}

export function addUser(user) {
  if (!user.username || !user.hash) {
    return false;
  }
  // Add the User to the Array
  UsersData.push(user);

  // Save the User
  writeUserData();
  console.log("User added");
  return true;
}

export function checkUserExists(username) {
  let value;
  let useR;
  UsersData.some((user) => {
    value = user.username === username;
    useR = user;
  });
  let data = {
    value: value,
    user: useR,
  };
  return data;
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
