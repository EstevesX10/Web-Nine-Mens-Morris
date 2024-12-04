import { promises as fs } from "fs";
import { receive, send, error } from "./utils.js";

export const ranking = async (req, res) => {
  const request = await receive(req);
  if (!request.group || !request.size) {
    error(res, `malformed request ${request}`);
    return;
  }

  // Read rankings from file
  let ranking = await fs.readFile("./private/data/ranking.json", "utf8");

  // Sort from largest to smallest
  ranking = ranking[request.size];
  ranking.sort((a, b) => b.victories - a.victories);

  // Send response
  send(res, { ranking: ranking });
};

// async function ranking(group, size) {
//   const response = await fetchData(`${SERVER}/ranking`, {
//     method: "POST",
//     // headers: {
//     //   "Content-Type": "application/json",
//     // },
//     body: JSON.stringify({ group: group, size: size }),
//   }).catch((error) => {
//     console.error("Error:", error);
//   });
//   // console.log("responde", response);
//   return response;
// }
