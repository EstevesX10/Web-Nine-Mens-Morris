import { receive, send, error, userExists } from "./utils.js";
import { sessions } from "./join.js";
import {
  PlaceAction,
  DestroyAction,
  MoveAction,
} from "../../public/static/js/logicGame.js";

function movePiece(gameSession, action, initialPoint, pointToMoveTo) {
  const player = action.player;
  const initialIndex = action.from;

  // Check if the game is over
  checkGameOver(gameSession);
}

function chooseAction(gameSession, index) {
  let game = gameSession.game;
  const currentPlayer = game.getCurrentPlayer();

  // Get the phase of the current player
  const currentPlayerPhase =
    game.currentState.board.getPlayerPhase(currentPlayer);

  // Check if a Mill was formed
  if (game.isMillFormed()) {
    if (game.currentState.board.getPiece(index) === 3 - currentPlayer) {
      return new DestroyAction(index, currentPlayer);
    }
  }

  // Separate the movements based on the current game phase of the player
  else if (currentPlayerPhase === "placing") {
    // Check if it is a empty space
    if (game.currentState.board.getPiece(index) === 0) {
      // Add a piece
      return new PlaceAction(index, currentPlayer);
    } else {
      console.log("OCUPADO MEUUU!!!");
      console.log(game.currentState.board.board);
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
      if (game.currentState.board.getPiece(index) === 0) {
        // Check if a movement is valid
        if (
          game.currentState.board.isAdjacent(initialIndex, index) ||
          currentPlayerPhase === "flying"
        ) {
          // Define a new and clean Array
          gameSession.selected = [];

          // Perform the action
          return new MoveAction(initialIndex, index, currentPlayer);
        }
      } else {
        console.log("OCUPADO MEUUU!!!");
        console.log(game.currentState.board.board);
      }
    } else {
      // We are selecting the initial piece
      // Check if the selected piece is valid
      if (currentPlayer === game.currentState.board.getPiece(index)) {
        // Saves the index of a selected point
        gameSession.selected.push([index]);
      } else {
        // Clear Previously Selected Piece
        gameSession.selected = [];

        console.log("WRONG Point SELECTED!");
      }
    }
  } else {
    console.log("DEU MERDA!");
  }

  return null;
}

async function handlePointClick(gameSession, index) {
  let game = gameSession.game;

  // Check if the game is over
  if (game.checkGameOver()) {
    return;
  }

  // Chck if the players turn
  if (game.currentState.board.currentPlayer === 2) {
    return;
  }

  // Select player action
  const action = chooseAction(index);

  // Check if we are in PVP Mode
  if (game.gameHash !== null) {
    await notify(username, password, game.gameHash, index);
    return;
  }

  // Playing singleplayer
  // performe the action
  if (action === null) {
    return;
  }
  game.currentState.execute(action);
}

function checkGameOver(gameSession) {
  let game = gameSession.game;

  // Check if the game is over
  if (game.checkGameOver()) {
    // Get Winner
    const winner = game.currentState.board.getWinner();

    // Toogle the game winner box
    triggerWinnerContainer(winner);
  }
}

function triggerWinnerContainer(gameSession, winner) {
  let game = gameSession.game;

  if (game.gameHash === null) {
    // Update Single Player Leaderboard
    game.updateSingleplayerLeaderboard(winner);
  }
  if (game.serverEventSource !== null) {
    console.log("Closing server connection...");
    game.serverEventSource.close();
  }
}

export async function notify(req, res) {
  return;
  // Get the request
  let notification = await receive(req);

  // nick, password, game (hash), move (casa do tabuleiro (?))

  // Verify if all the parameters were given
  if (
    !notification.nick ||
    !notification.password ||
    !notification.game ||
    !notification.move
  ) {
    // Missing Arguments
    return error(
      res,
      "Missing Arguments! Please ensure your request contains all the information!"
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

  // Get current game Session
  let gameSession = sessions[notification.game];

  // Handle Point Click
  handlePointClick(gameSession, notification.move);

  // (O QUE ENVIAR) SESSAO (HASH DO JOGO) + INDICE ONDE SE CLICOU
}
