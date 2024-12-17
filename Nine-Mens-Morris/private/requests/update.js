import {
  receive,
  send,
  error,
  getUser,
  validateObject,
  removeSession,
} from "./utils.js";
import { sessions } from "./join.js";
import { updateRanking } from "./ranking.js";

const SSE_HEADERS = {
  "Access-Control-Allow-Origin": "*", // CORS
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const UPDATE_SPEC = {
  game: "string",
  nick: "string",
};

export async function update(req, res, query) {
  // Validate request
  const validationError = validateObject(query, UPDATE_SPEC);
  if (validationError) {
    return error(res, validationError);
  }

  if (!(query.game in sessions)) {
    error(res, `game does not exist: ${query.game}`);
    return;
  }

  const session = sessions[query.game];
  res.writeHead(200, SSE_HEADERS);
  if (session.stream1 === null) {
    session.stream1 = res;
    res.write(`data: {}\n\n`);
  } else {
    session.stream2 = res;
    const data = { turn: session.player1, phase: "drop" };
    session.stream1.write(`data: ${JSON.stringify(data)}\n\n`);
    session.stream2.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  req.on("close", async () => {
    console.log(`${query.nick} Connection closed`);

    if (!session.ongoing) return;

    // Send end game
    const players = [session.player1, session.player2];
    const winner = session.player1 === query.nick ? 2 : 1;
    const response = {};
    response.winner = players[winner - 1];
    sseSend(session, response);
    removeSession(query.game);

    await updateRanking(response.winner, players[3 - winner - 1], session.size);
  });
}

export async function sendUpdate(gameHash, clickIndex) {
  const session = sessions[gameHash];
  const response = {};
  const game = session.game;
  const players = [session.player1, session.player2];

  // Add winner
  if (session.player2 === null) {
    response.winner = null;
    sseSend(session, response);
    return;
  }
  if (session.game.checkGameOver()) {
    const winner = game.currentState.board.getWinner();
    response.winner = players[winner - 1];
    sseSend(session, response);
    await updateRanking(response.winner, players[3 - winner - 1], session.size);
    return;
  }

  // Add cell
  response.cell = {
    square: Math.floor(clickIndex / 8),
    position: clickIndex % 8,
  };

  // Add board
  response.board = convertBoard(session, game);

  // Add phase
  console.log("gamephase is", game.currentState.board.gamePhase);
  response.phase =
    game.currentState.board.gamePhase[game.currentState.board.currentPlayer] ===
    "placing"
      ? "drop"
      : "move";

  // Add step
  if (response.phase === "move") {
    if (game.isMillFormed()) {
      response.step = "take";
    } else {
      if (session.selected.length === 1) {
        response.step = "to";
      } else {
        response.step = "from";
      }
    }
  }

  // Add turn
  response.turn = players[game.currentState.board.currentPlayer - 1];

  // Add players
  response.players = players;

  sseSend(session, response);
}

function sseSend(session, msg) {
  console.log("SSE sending:", msg);
  if (session.stream1)
    session.stream1.write(`data: ${JSON.stringify(msg)}\n\n`);

  if (session.stream2)
    session.stream2.write(`data: ${JSON.stringify(msg)}\n\n`);
}

function convertBoard(session, game) {
  const numToColor = ["empty", "blue", "red"];
  let board = game.currentState.board.board.map((p) => numToColor[p]);
  board = reshapeArray(board, session.size, 8);
  return board;
}

function reshapeArray(arr, rows, cols) {
  if (arr.length !== rows * cols) {
    throw new Error("Total elements do not match the specified dimensions");
  }

  const reshaped = new Array(rows);
  for (let i = 0; i < rows; i++) {
    reshaped[i] = arr.slice(i * cols, (i + 1) * cols);
  }

  return reshaped;
}
