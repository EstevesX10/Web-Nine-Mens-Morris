import { readFileSync, writeFileSync } from "fs";

let UsersData = [];

export function getUsersData() {
  return UsersData;
}

export function printUsers() {
  console.log(UsersData.toString());
}

export function getUser(user) {}

export function readUsersData() {
  let jsonData = readFileSync("./private/data/users.json");
  let Users;
  if (jsonData != "") {
    Users = JSON.parse(jsonData.toString());
    UsersData = Array.isArray(Users) ? Users : [];
  } else {
    UsersData = [];
  }
}

export function addUser(user) {
  if (user.username === undefined || user.hash === undefined) {
    return false;
  }
  UsersData.push(user);
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

export function writeUserData() {
  writeFileSync("./private/data/users.json", JSON.stringify(UsersData));
  readUsersData();
}
