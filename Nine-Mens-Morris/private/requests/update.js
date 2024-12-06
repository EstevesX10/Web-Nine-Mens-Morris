import { receive, send, error, getUser } from "./utils.js";
import { sessions } from "./join.js";

const SSE_HEADERS = {
  "Access-Control-Allow-Origin": "*", // CORS
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

export async function update(req, res, query) {
  if (!query.game || !query.nick) {
    error(res, `missing arguments ${query}`);
    return;
  }

  if (!query.game in sessions) {
    error(res, `game does not exist: ${query.game}`);
    return;
  }

  if (!getUser(query.nick)) {
    error(res, `no user with nick ${query.nick}`);
    return;
  }

  sessions[query.game].stream = res;
  res.writeHead(200, SSE_HEADERS);
  res.write("{}");
  res.end();
}

export async function sendUpdate(gameHash, clickIndex) {
  const session = sessions[gameHash];
  const response = {};
  const game = session.game;
  const players = [session.player1, session.player2];

  // Add winner
  if (session.player2 === null) {
    response.winner = null;
    send(session.stream, response);
    return;
  }
  if (session.game.checkGameOver()) {
    const winner = game.currentState.board.getWinner();
    response.winner = players[winner - 1];
    send(session.stream, response);
    return;
  }

  // Add cell
  response.cell = {
    square: Math.floor(clickIndex / 8),
    position: clickIndex % 8,
  };

  // Add board
  response.board = convertBoard(game);

  // Add phase
  response.phase =
    game.currentState.board.gamePhase === "place" ? "drop" : "move";

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

  send(session.stream, response);
}

function convertBoard(game) {
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
