import { promises as fs } from "fs";
import { receive, send, error, validateObject } from "./utils.js";

const RANKING_SPEC = {
  group: "number",
  size: "number",
};

const RANKINGS_PATH = "./private/data/ranking.json";

export async function ranking(req, res) {
  const request = await receive(req);

  // Validate request
  const validationError = validateObject(notification, NOTIFY_SPEC);
  if (validationError) {
    return error(res, validationError);
  }

  if (request.size < 2 || request.size > 3) {
    error(res, `invalid size ${request.size}`);
    return;
  }

  // Read rankings from file
  let ranking = await readRankings();

  // Sort from largest to smallest
  ranking = ranking[request.size] || [];
  ranking.sort((a, b) => b.victories - a.victories);

  // Send response
  send(res, { ranking: ranking });
}

export async function updateRanking(winner, loser, size) {
  // Read rankings
  const rankings = await readRankings();
  let current = rankings[size];
  if (!current) {
    current = [];
    rankings[size] = current;
  }

  // Update winner entry
  const winner_entry = current.find((entry) => entry.nick === winner);
  if (winner_entry) {
    winner_entry.games += 1;
    winner_entry.victories += 1;
  } else {
    current.push({
      nick: winner,
      games: 1,
      victories: 1,
    });
  }

  // Update loser entry
  const loser_entry = current.find((entry) => entry.nick === loser);
  if (loser_entry) {
    loser_entry.games += 1;
  } else {
    current.push({
      nick: loser,
      games: 1,
      victories: 0,
    });
  }

  // Save changes
  await fs.writeFile(RANKINGS_PATH, JSON.stringify(rankings));
}

async function readRankings() {
  const ranking = await fs.readFile(RANKINGS_PATH, "utf8");
  return JSON.parse(ranking);
}
