import { receive, send, error, userExists } from "./utils.js";
import { Board, State, Game } from "../serverLogicGame.js";
import crypto from "crypto";

/*
[NOTE - Sessions Structuring ]
sessions = {
    hash: {         <game Hash>
        ongoing:    <true || false>
        finished:   <true || false>
        size:       < 2 || 3 || 4 >
        player1:    <player 1 Nick>
        player2:    <player 2 Nick>
        stream1:    <player 1 update response stream>
        stream2:    <player 2 update response stream>
    }
}
*/

export let sessions = {};
let finishedSessions = {};

function lookUpSessions(selectedSize) {
  // Fetch available sessions
  let openSessions = Object.entries(sessions)
    .filter(
      ([hash, details]) =>
        details.size === selectedSize && !details.ongoing && !details.finished
    )
    .map(([hash]) => hash);

  // Return the joinable sessions
  return openSessions;
}

function generateGameHash(username, boardSize) {
  // Get the plaintext to use for the hash (Uses the username, board size and current date)
  const plainText = username + boardSize + Date.now().toString();
  // Compute and return the game hash
  return crypto.createHash("sha256").update(plainText).digest("hex");
}

function addNewSession(username, selectedSize) {
  // Generate a new game hash
  let newGameHash = generateGameHash(username, selectedSize);

  // Create a game state
  let board = new Board(selectedSize, 1);
  var gameState = new State(board);

  // Define a new session
  let newSession = {
    ongoing: false,
    finished: false,
    size: selectedSize,
    selected: [],
    player1: username,
    player2: null,
    game: new Game(gameState, 0, newGameHash),
    stream1: null,
    stream2: null,
  };

  // Add the new session
  sessions[newGameHash] = newSession;

  // return game hash
  return newGameHash;
}

function joinExistingSession(sessionGameHash, username) {
  // Update the existing session
  if (sessions[sessionGameHash]) {
    sessions[sessionGameHash].ongoing = true;
    sessions[sessionGameHash].player2 = username;
  }
  // Return the session game hash
  return sessionGameHash;
}

export async function join(req, res) {
  // Get the request
  let userJoin = await receive(req);

  // Check if any argument was ommised
  if (
    !userJoin.nick ||
    !userJoin.password ||
    !userJoin.group ||
    !userJoin.size
  ) {
    // Missing Arguments
    return error(
      res,
      "Missing Arguments! Please ensure your request contains all the information!"
    );
  }

  // Verify the integrity of Board Size
  if (userJoin.size < 2 && userJoin.size > 4) {
    // Invalid Board Size
    return error(
      res,
      `Invalid Board Size (${userJoin.size})! Please choose between [2, 3, 4] !`
    );
  }

  // Check if the received nick exists
  if (!userExists(userJoin.nick, userJoin.password)) {
    // Inexistent User
    return error(
      res,
      `Invalid User (${userJoin.nick})! Please perform Registration!`
    );
  }

  // Create variables for the available sessions and the current game hash
  let availableSessions, gameHash;

  // Look Up Available Sessions
  availableSessions = lookUpSessions(userJoin.size);

  // Check if there are any available sessions
  if (availableSessions.length > 0) {
    gameHash = joinExistingSession(availableSessions[0], userJoin.nick);
  } else {
    // Create a new session
    gameHash = addNewSession(userJoin.nick, userJoin.size);
  }

  console.log(sessions);

  // Send the final message with the game hash
  return send(res, { game: gameHash });
}
