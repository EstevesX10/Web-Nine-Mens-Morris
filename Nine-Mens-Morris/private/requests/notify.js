import { receive, send, error, userExists, existsSession } from "./utils.js";
import { sessions } from "./join.js";
import {
  PlaceAction,
  DestroyAction,
  MoveAction,
} from "../../public/static/js/logicGame.js";
import { sendUpdate } from "./update.js";

function getPlayerNick(gameHash, playerID) {
  if (playerID === 1) {
    return sessions[gameHash].player1;
  } else if (playerID === 2) {
    return sessions[gameHash].player2;
  } else {
    console.log("TRYING TO FETCH A 3rd Player NICK");
  }
}

function chooseAction(gameSession, index) {
  const currentPlayer = gameSession.game.getCurrentPlayer();

  console.log("INDEX SELECTED " + index);

  // Get the phase of the current player
  const currentPlayerPhase =
    gameSession.game.currentState.board.getPlayerPhase(currentPlayer);

  // Check if a Mill was formed
  if (gameSession.game.isMillFormed()) {
    if (
      gameSession.game.currentState.board.getPiece(index) ===
      3 - currentPlayer
    ) {
      return new DestroyAction(index, currentPlayer);
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
      }

      // Check if the final place is empty
      if (gameSession.game.currentState.board.getPiece(index) === 0) {
        // Check if a movement is valid
        if (
          gameSession.game.currentState.board.isAdjacent(initialIndex, index) ||
          currentPlayerPhase === "flying"
        ) {
          // Define a new and clean Array
          gameSession.selected = [];

          // Perform the action
          return new MoveAction(initialIndex, index, currentPlayer);
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

async function handlePointClick(gameSession, cell) {
  if (
    !gameSession.game.checkGameOver() // Check if the game is over
  ) {
    // Convert the cell to our coordenates system
    let index = cell.square * 8 + cell.position;

    // Select player action
    const action = chooseAction(gameSession, index);

    console.log(action);

    if (typeof action !== "string") {
      // Execute the Action
      gameSession.game.currentState.execute(action);

      // Send update
      await sendUpdate(gameSession.game.gameHash, index);

      // Everything worked out
      return "";
    } else {
      return action;
    }
  }
}

export async function notify(req, res) {
  // Get the request
  let notification = await receive(req);

  console.log(notification);

  // Verify if all the parameters were given
  if (
    !notification.nick ||
    !notification.password ||
    !notification.game ||
    !notification.cell
  ) {
    // Missing Arguments
    return error(
      res,
      "[NOTIFY] Missing Arguments! Please ensure your request contains all the information!"
    );
  }

  // Check if the user exists
  if (!userExists(notification.nick, notification.password)) {
    // Send an Error
    return error(
      res,
      `Invalid User (${notification.nick})! Please perform Registration!`
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

  // Handle Point Click
  let possibleErrorString = handlePointClick(
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
