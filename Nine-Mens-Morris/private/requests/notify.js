import {
  receive,
  send,
  error,
  userExists,
  existsSession,
  validateObject,
} from "./utils.js";
import { sessions } from "./join.js";
import { PlaceAction, DestroyAction, MoveAction } from "../serverLogicGame.js";
import { sendUpdate } from "./update.js";

const NOTIFY_SPEC = {
  nick: "string",
  password: "string",
  game: "string",
  cell: {
    square: "number",
    position: "number",
  },
};

function chooseAction(gameSession, index) {
  const currentPlayer = gameSession.game.getCurrentPlayer();

  console.log("INDEX SELECTED " + index);

  // Get the phase of the current player
  const currentPlayerPhase = gameSession.game.currentState.board.getPlayerPhase(
    currentPlayer
  );

  // Check if a Mill was formed
  if (gameSession.game.isMillFormed()) {
    if (
      gameSession.game.currentState.board.getPiece(index) ===
      3 - currentPlayer
    ) {
      return new DestroyAction(index, currentPlayer);
    } else {
      return "Not an enemy piece";
    }
  }

  // Separate the movements based on the current game phase of the player
  else if (currentPlayerPhase === "placing") {
    // Check if it is a empty space
    if (gameSession.game.currentState.board.getPiece(index) === 0) {
      // Add a piece
      return new PlaceAction(index, currentPlayer);
    } else {
      console.log("OCUPADO MEUUU!!!");
      console.log(gameSession.game.currentState.board.board);
      // Non empty cell
      return "Invalid move: non empty cell";
    }
  }
  // Check if the current player phase corresponds to moving or flying
  else if (currentPlayerPhase === "moving" || currentPlayerPhase === "flying") {
    // Check if any piece was previously selected
    if (gameSession.selected.length > 0) {
      // Fetch previously selected piece [Starting piece] - The list with the selected points aims to have 1 point each time.
      const initialIndex = gameSession.selected[0];

      if (index === initialIndex[0]) {
        // Selected the same piece twice
        // Clear Previously Selected Piece
        gameSession.selected = [];
        return "";
      }

      // Check if the final place is empty
      if (gameSession.game.currentState.board.getPiece(index) === 0) {
        // Check if a movement is valid
        if (
          gameSession.game.currentState.board.isAdjacent(
            initialIndex[0],
            index
          ) ||
          currentPlayerPhase === "flying"
        ) {
          // Define a new and clean Array
          gameSession.selected = [];

          // Perform the action
          return new MoveAction(initialIndex[0], index, currentPlayer);
        } else {
          return "Invalid Move: cells are not adjacent";
        }
      } else {
        console.log("OCUPADO MEUUU!!!");
        console.log(gameSession.game.currentState.board.board);
        // Non empty cell
        return "Invalid move: non empty cell";
      }
    } else {
      // We are selecting the initial piece
      // Check if the selected piece is valid
      if (
        currentPlayer === gameSession.game.currentState.board.getPiece(index)
      ) {
        // Saves the index of a selected point
        gameSession.selected.push([index]);
      } else {
        // Clear Previously Selected Piece
        gameSession.selected = [];

        console.log("WRONG Point SELECTED!");
        // Tried to perform an invalid move
        return "Invalid move: not your piece";
      }
    }
  }
  return "";
}

function getPlayerNick(gameSession, playerNick) {
  // Gets the number of the player based on his nick
  if (gameSession.player1 === playerNick) {
    return 1;
  } else if (gameSession.player2 === playerNick) {
    return 2;
  } else {
    console.log("[INVALID NICK - IT WAS NOT FOUND]");
  }
}

function validCurrentPlayer(username, gameSession) {
  // Verifies the validity of the current player
  return (
    getPlayerNick(gameSession, username) === gameSession.game.getCurrentPlayer()
  );
}

async function handlePointClick(username, gameSession, cell) {
  if (
    !gameSession.game.checkGameOver() // Check if the game is over
  ) {
    // Make sure its the right player turn
    if (!validCurrentPlayer(username, gameSession)) {
      return "Not your turn motherfucker!";
    }

    // Convert the cell to our coordenates system
    let index = cell.square * 8 + cell.position;

    // Select player action
    const action = chooseAction(gameSession, index);

    console.log("Action:", action);

    if (typeof action !== "string") {
      // Execute the Action
      gameSession.game.currentState.execute(action);

      // Send update
      await sendUpdate(gameSession.game.gameHash, index);

      // Everything worked out
      return "";
    } else {
      if (action === "") {
        await sendUpdate(gameSession.game.gameHash, index);
      }
      return action;
    }
  }
}

export async function notify(req, res) {
  // Get the request
  let notification = await receive(req);

  console.log("Received Notify:", notification);

  // Verify if all the parameters were given
  const validationError = validateObject(notification, NOTIFY_SPEC);
  if (validationError) {
    return error(res, validationError);
  }

  // Check if the user exists
  if (!userExists(notification.nick, notification.password)) {
    // Send an Error
    return error(
      res,
      `Invalid User (${notification.nick})! Please perform Registration!`,
      401
    );
  }

  // Check if the game hash corresponds to an existing game
  if (!existsSession(notification.game)) {
    return error(
      res,
      `Invalid Game Session (game hash = ${notification.game})!`
    );
  }

  // Check for invalid values
  if (notification.cell.square < 0) {
    return error(res, "'square' is negative!");
  }

  if (notification.cell.square >= sessions[notification.game].size) {
    return error(res, "'square' is too big!");
  }

  // Handle Point Click
  let possibleErrorString = await handlePointClick(
    notification.nick,
    sessions[notification.game],
    notification.cell
  );

  // Check if we got any errors
  if (possibleErrorString === "") {
    return send(res, {});
  } else {
    return error(res, possibleErrorString);
  }
}
