import { readUsers, writeUserData } from "./utils.js";

export const register = async (nickName, password) => {
  // Load the current Users
  let users = readUsers();
  console.log(users);
};

// async function register(nickName, password) {
//   const response = await fetchData(`${SERVER}/register`, {
//     method: "POST",
//     // headers: {
//     //   "Content-Type": "application/json",
//     // },
//     body: JSON.stringify({ nick: nickName, password: password }),
//   }).catch((error) => {
//     console.error("Error:", error);
//   });
//   // console.log("responde", response);
//   return response;
// }
