// Adjancency List for the possible moves
const NEIGHBOR_TABLE = {
  0: [1, 3],
  1: [0, 2, 9],
  2: [1, 4],
  3: [0, 5, 11],
  4: [2, 7, 12],
  5: [3, 6],
  6: [5, 7, 14],
  7: [4, 6],
  8: [9, 11],
  9: [1, 8, 10, 17],
  10: [9, 12],
  11: [3, 8, 13, 19],
  12: [4, 10, 15, 20],
  13: [11, 14],
  14: [6, 13, 15, 22],
  15: [12, 14],
  16: [17, 19],
  17: [9, 16, 18, 25],
  18: [17, 20],
  19: [11, 16, 21, 27],
  20: [12, 18, 23, 28],
  21: [19, 22],
  22: [14, 21, 23, 30],
  23: [20, 22],
  24: [25, 27],
  25: [17, 24, 26],
  26: [25, 28],
  27: [19, 24, 29],
  28: [20, 26, 31],
  29: [27, 30],
  30: [22, 29, 31],
  31: [30, 28],
};

// Using a Array with a singular position in order to store the previously selected point
let selectedPoints = [];

// Define some strings to help keep track of the last directive of the player before he eliminates a enemy's piece
var lastPlayer1Note = "Place a Piece";
var lastPlayer2Note = "Place a Piece";

// Actions to be performed in he first phase of the game (Placing pieces)
class PlaceAction {
  constructor(pos, player) {
    this.pos = pos;
    this.player = player;
  }

  execute(gameBoard) {
    // Place a Piece
    gameBoard.board[this.pos] = this.player;

    // Update the number of placed pieces of the player
    gameBoard.placedPieces[this.player]++;

    if (
      // Checks if we changed from the current phase
      gameBoard.placedPieces[this.player] >= gameBoard.playerPieces[this.player]
    ) {
      // Update the game phase
      gameBoard.gamePhase[this.player] = "moving";
    }

    // Check for mills [If there is a mill we do not change player. We do it otherwise]
    if (!gameBoard.checkMillFormed(this.pos, this.player)) {
      gameBoard.switchPlayer();
    } else {
      gameBoard.millFormed = true;
    }
  }
}

// We suppose that the action is valid and good to be performed
// Can be performed anytime during the game loop
class DestroyAction {
  constructor(pos, player) {
    this.pos = pos;
    this.player = player;
  }

  execute(gameBoard) {
    // Remove piece from the selected position
    gameBoard.board[this.pos] = 0;

    // Update player pieces
    gameBoard.playerPieces[gameBoard.getOpponent(this.player)]--;
    gameBoard.placedPieces[gameBoard.getOpponent(this.player)]--;

    // Switch Player
    gameBoard.switchPlayer();

    // Check if the current player has transitioned into the flying phase
    if (gameBoard.playerPieces[gameBoard.currentPlayer] === 3) {
      // Update the game phase
      gameBoard.gamePhase[gameBoard.currentPlayer] = "flying";
    }
    gameBoard.millFormed = false;
  }
}

class MoveAction {
  constructor(from, to, player) {
    this.from = from;
    this.to = to;
    this.player = player;
  }

  execute(gameBoard) {
    gameBoard.board[this.from] = 0;
    gameBoard.board[this.to] = this.player;

    // Check for mills [If there is a mill we do not change player. We do it otherwise]
    if (!gameBoard.checkMillFormed(this.to, this.player)) {
      gameBoard.switchPlayer();
    } else {
      gameBoard.millFormed = true;
      console.log("Mill Formed");
    }
  }
}

class Board {
  constructor(boardSize, firstPlayer) {
    this.currentPlayer = firstPlayer;
    this.boardSize = boardSize;
    this.playerPieces = { 1: 3 * boardSize, 2: 3 * boardSize }; // 9 peças para cada jogador
    this.placedPieces = { 1: 0, 2: 0 }; // Contagem de peças colocadas
    this.board = Array(boardSize * 8).fill(0); // Para armazenar o estado do tabuleiro
    this.gamePhase = { 1: "placing", 2: "placing" }; // Fase atual do jogo (placing ou moving)
    this.millFormed = false;
  }

  getPiece(i) {
    return this.board[i];
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getOpponent(player) {
    return 3 - player;
  }

  getPlayerPhase(player) {
    return this.gamePhase[player];
  }

  hasAvailableMoves(player) {
    if (this.gamePhase[player] === "moving") {
      for (let index = 0; index < this.board.length; index++) {
        if (this.board[index] === player) {
          // Check Adjacent positions
          for (const adjacentPoint of NEIGHBOR_TABLE[index]) {
            // There is at least a possible move for one of the pieces
            if (this.board[adjacentPoint] === 0) {
              console.log("[POSSIBLE MOVE @]", index);
              // Empty Space
              return true;
            }
          }
        }
      }
      return false;
    } else {
      // Placing or Moving Phases - In both phases there are always possible moves
      // It is due to the fact that the board cannot be completely flooded with pieces
      return true;
    }
  }

  gameOver() {
    return (
      this.playerPieces[1] <= 2 || // Player 1 does not have enough pieces to continue
      !this.hasAvailableMoves(1) || // Player 1 does not have anymore valid moves
      this.playerPieces[2] <= 2 || // Player 2 does not have enough pieces to continue
      !this.hasAvailableMoves(2) // Player 2 does not have anymore valid moves
    );
  }

  getWinner() {
    // Returns the ID of the winner [Only execute this when the game is over!]
    if (this.playerPieces[1] > this.playerPieces[2]) {
      return 1;
    } else if (this.playerPieces[1] === this.playerPieces[2]) {
      return 0;
    } else {
      return 2;
    }
  }

  checkMillFormed(point, player) {
    var mills;
    // Possible mills for a 2 square game
    if (this.boardSize === 2) {
      mills = [
        // Horizontal
        [0, 1, 2],
        [5, 6, 7],
        [8, 9, 10],
        [13, 14, 15],

        // Vertical
        [0, 3, 5],
        [2, 4, 7],
        [8, 11, 13],
        [10, 12, 15],
      ];
    }

    // Possible mills for a 3 square game
    else if (this.boardSize === 3) {
      mills = [
        // Horizontal
        [0, 1, 2],
        [5, 6, 7],
        [8, 9, 10],
        [13, 14, 15],
        [16, 17, 18],
        [21, 22, 23],
        [3, 11, 19],
        [4, 12, 20],

        // Vertical
        [0, 3, 5],
        [2, 4, 7],
        [8, 11, 13],
        [10, 12, 15],
        [16, 19, 21],
        [18, 20, 23],
        [1, 9, 17],
        [6, 14, 22],
      ];
    }

    // Possible mills for a 4 square game
    else {
      mills = [
        // Horizontal
        [0, 1, 2],
        [5, 6, 7],
        [8, 9, 10],
        [13, 14, 15],
        [16, 17, 18],
        [21, 22, 23],
        [3, 11, 19],
        [4, 12, 20],
        [24, 25, 26],
        [29, 30, 31],
        [11, 19, 27],
        [12, 20, 28],

        // Vertical
        [0, 3, 5],
        [2, 4, 7],
        [8, 11, 13],
        [10, 12, 15],
        [16, 19, 21],
        [18, 20, 23],
        [1, 9, 17],
        [6, 14, 22],
        [24, 27, 29],
        [26, 28, 31],
        [9, 17, 25],
        [14, 22, 30],
      ];
    }

    console.log(mills);

    return mills.some(
      (mill) =>
        mill.includes(point) && mill.every((pos) => this.board[pos] === player)
    );
  }

  isAdjacent(initialIndex, newIndex) {
    return NEIGHBOR_TABLE[initialIndex].some((pos) => pos == newIndex);
  }

  switchPlayer() {
    // Update background Color of the previous player
    const previousPlayerInfo = document.querySelector(
      `.player${this.currentPlayer}-info`
    );
    previousPlayerInfo.classList.remove(`active-player${this.currentPlayer}`);

    // Update Current Player
    this.currentPlayer = 3 - this.currentPlayer;

    // Update background Color of the current player
    const currentPlayerInfo = document.querySelector(
      `.player${this.currentPlayer}-info`
    );
    currentPlayerInfo.classList.add(`active-player${this.currentPlayer}`);
  }
}

// Holds the board state and history
class State {
  constructor(board) {
    this.board = board;
    this.history = [];
    this.cur_hist = 0;
  }

  // Executes a action and updates the history
  execute(action) {
    this.history.splice(this.cur_hist);
    this.history.push(action);
    this.cur_hist += 1;
    action.execute(this.board);
  }

  // Undoes the last action and updates history
  // Returns False if there was no previous action
  undo(action) {
    if (this.cur_hist == 0) {
      return False;
    }

    this.cur_hist -= 1;
    this.history[this.cur_hist].undo(this.board);
    return True;
  }
}

class Game {
  constructor(state) {
    this.currentState = state;
  }

  addPlayerHighlight(player) {
    // Add current player highlight
    const currentPlayerInfo = document.querySelector(`.player${player}-info`);
    currentPlayerInfo.classList.add(`active-player${player}`);
  }

  removePlayerHighlight(player) {
    // Remove current player highlight
    const currentPlayerInfo = document.querySelector(`.player${player}-info`);
    currentPlayerInfo.classList.remove(`active-player${player}`);
  }

  informPlayer(player, message) {
    // Update the HTML text content for the player messages
    document.getElementById(`player${player}-notes`).textContent = message;
  }

  updatePlayerLastMessage(player, newMessage) {
    if (player === 1) {
      lastPlayer1Note = newMessage;
    } else {
      lastPlayer2Note = newMessage;
    }
  }

  updatePlayerInfo(player, newPhase, newMessage) {
    // Update the HTML text content for the current phase
    document.getElementById(`player${player}-phase`).textContent = newPhase;

    // Update the HTML text content for the player messages
    document.getElementById(`player${player}-notes`).textContent = newMessage;

    // Update player Last Message
    this.updatePlayerLastMessage(player, newMessage);
  }

  getPlayerLastMessage(player) {
    if (player === 1) {
      document.getElementById(`player${player}-notes`).textContent =
        lastPlayer1Note;
    } else {
      document.getElementById(`player${player}-notes`).textContent =
        lastPlayer2Note;
    }
  }

  usePiece(player) {
    // Remove a piece from the pieces container
    var piecesContainer = document.getElementById(`player${player}-pieces`);
    piecesContainer.removeChild(piecesContainer.firstElementChild);
  }

  addPiece(player, indexToAdd, pointToAdd) {
    // Remove a piece from the pieces container
    this.usePiece(player);

    // Adds the selected player class to the HTML
    pointToAdd.classList.add(`point-player${player}`);

    // Perform the placing action
    var action = new PlaceAction(indexToAdd, player);
    this.currentState.execute(action);

    // Check if the game phase was changed
    if (this.currentState.board.getPlayerPhase(player) === "moving") {
      // Update the HTML text content for the current phase
      this.updatePlayerInfo(player, "Moving Phase", "Move a Piece");
    }

    // Check if a mill was formed
    if (this.currentState.board.millFormed) {
      // Highlight possible pieces to remove
      this.highlightPossiblePieceRemovals(player);

      // Inform that he has made a mill [Change player notes]
      this.informPlayer(player, "[MILL FORMED]\nRemove a Enemy Piece");
    }
  }

  removeEnemyPiece(player, indexToRemove, pointToRemove) {
    // Get Opponent
    var opponent = this.currentState.board.getOpponent(player);

    // Check if the piece to remove corresponds to a opponent piece
    if (this.currentState.board.board[indexToRemove] === opponent) {
      // Remove highlights of the pieces that could have been removed
      this.removeHighlightPossiblePieceRemovals(player);

      // If selected, remove the selection
      pointToRemove.classList.remove("point-player1");
      pointToRemove.classList.remove("point-player2");

      // Perform the action
      var action = new DestroyAction(indexToRemove, player);
      this.currentState.execute(action);

      // Go back to the player's previous directive since a piece was already removed
      this.getPlayerLastMessage(player);

      // Check if the opponent has 3 pieces [Has transitioned into a flying phase]
      if (this.currentState.board.getPlayerPhase(opponent) === "flying") {
        // Update the opponent game phase
        this.updatePlayerInfo(opponent, "Flying Phase", "Fly a Piece");
      }
    }
  }

  movePiece(player, playerPhase, indexToMoveTo, pointToMoveTo) {
    // Check if any piece was previously selected
    if (selectedPoints.length > 0) {
      // Fetch previously selected piece [Starting piece] - The list with the selected points aims to have 1 point each time.
      var initialIndex = selectedPoints[0][1];
      var initialPoint = selectedPoints[0][0];

      // Check if the final place is empty
      if (this.currentState.board.getPiece(indexToMoveTo) === 0) {
        // Check if a movement is valid
        if (
          this.currentState.board.isAdjacent(initialIndex, indexToMoveTo) ||
          playerPhase === "flying"
        ) {
          // Remove the styling of the initial point [In the HTML]
          initialPoint.classList.remove(
            `point-player${player}`,
            `selected-point-player${player}`
          );

          // Adds the point to the new place [In HTML]
          pointToMoveTo.classList.add(`point-player${player}`);

          // Perform the action
          var action = new MoveAction(initialIndex, indexToMoveTo, player);
          this.currentState.execute(action);

          // Check if a mill was formed
          if (this.currentState.board.millFormed) {
            // Highlight possible pieces to remove
            this.highlightPossiblePieceRemovals(player);

            // Inform that he has made a mill [Change player notes]
            this.informPlayer(player, "[MILL FORMED]\nRemove a Enemy Piece");
          }

          // Define a new and clean Array
          selectedPoints = [];

          // Remove highlight from the possible moves
          this.removeHighlightPossibleMoves(player, initialIndex);
        } else {
          // The target place is not considered to be a valid move
          // Clear Previously Selected Piece
          selectedPoints = [];

          // Removes a highlight of the selected piece
          initialPoint.classList.remove(`selected-point-player${player}`);

          // Remove highlight from the possible moves
          this.removeHighlightPossibleMoves(player, initialIndex);
        }
      } else {
        console.log("OCUPADO MEUUU!!!");
        console.log(this.currentState.board.board);
      }
    } else {
      // We are selecting the initial piece
      // Check if the selected piece is valid
      if (player === this.currentState.board.getPiece(indexToMoveTo)) {
        // Saves the selected point
        selectedPoints.push([pointToMoveTo, indexToMoveTo]);

        // Adds a highlight to the piece to better visualize the one selected
        pointToMoveTo.classList.add(`selected-point-player${player}`);

        // Add a highlight for every possible move
        this.highlightPossibleMoves(player, indexToMoveTo);
      } else {
        // Clear Previously Selected Piece
        selectedPoints = [];

        console.log("WRONG Point SELECTED!");
      }
    }
  }

  highlightPossibleMoves(player, indexToHighlight) {
    // Highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and can only go to the adjacent positions
    if (this.currentState.board.gamePhase[player] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[indexToHighlight].forEach((pointIndex) => {
        // Checking for a valid and empty adjacent point in the current board configuration
        if (points[pointIndex] && points[pointIndex].classList.length === 1) {
          points[pointIndex].classList.add(`possible-move-player${player}`);
        }
      });
    } else {
      // We can Fly and therefore go into any available position
      points.forEach((point) => {
        if (point.classList.length === 1) {
          point.classList.add(`possible-move-player${player}`);
        }
      });
    }
  }

  removeHighlightPossibleMoves(player, indexToRemoveHighlight) {
    // Remove highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and could have only gone to the adjacent positions
    if (this.currentState.board.gamePhase[player] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[indexToRemoveHighlight].forEach((pointIndex) => {
        if (
          // Checking if we are not trying to access points from higher sided boards
          // [Since we are using a Adjacency list for all the different board sizes]
          points[pointIndex] &&
          points[pointIndex].classList.contains(`possible-move-player${player}`)
        ) {
          points[pointIndex].classList.remove(`possible-move-player${player}`);
        }
      });
    } else {
      // We could have fled and therefore we need to take into consideration the previously available positions
      points.forEach((point) => {
        point.classList.remove(`possible-move-player${player}`);
      });
    }
  }

  highlightPossiblePieceRemovals(player) {
    // Get opponent
    const opponent = this.currentState.board.getOpponent(player);

    // Grab all the points that match the oponnents
    var oponnentPoints = document.querySelectorAll(`.point-player${opponent}`);

    // Iterate through the opponent points and adding a class to help the user know which points he can remove
    oponnentPoints.forEach((opponnentPoint) => {
      console.log("[OPPONENT]", opponnentPoint);
      opponnentPoint.classList.add(`player${opponent}-removable-pieces`);
    });
  }

  removeHighlightPossiblePieceRemovals(player) {
    // Get opponent
    const opponent = this.currentState.board.getOpponent(player);

    // Grab all the points that match the oponnents
    var oponnentPoints = document.querySelectorAll(`.point-player${opponent}`);

    // Iterate through the opponent points and remove the previously added class
    oponnentPoints.forEach((opponnentPoint) => {
      opponnentPoint.classList.remove(`player${opponent}-removable-pieces`);
    });
  }

  triggerWinnerContainer(winner) {
    // Get Winner Container
    const gameWinnerContainer = document.querySelector(`.game-winner`);

    if (!gameWinnerContainer.classList.contains(`active-player${winner}`)) {
      gameWinnerContainer.classList.add(`active-player${winner}`);
    }

    // Get the winner text
    const winnerTxt = document.getElementById("current-winner");

    // Define a String to include the Winner name
    var Txt = "Draw";
    if (winner === 1) {
      Txt = "Player 1 Wins!";
    } else if (winner === 2) {
      Txt = "Player 2 Wins!";
    }

    // Update text inside the winner box according to the winner of the game
    winnerTxt.textContent = Txt;
  }

  // Check valid movement
  handlePointClick(point, index) {
    console.log("[GAME OVER?]", this.currentState.board.gameOver());

    // Storing a Variable to determine if the game is over (Might be helpful for the forfeit scenarios)
    var isGameOver = this.currentState.board.gameOver();

    if (!isGameOver) {
      // Get the phase of the current player
      var currentPlayerPhase = this.currentState.board.getPlayerPhase(
        this.currentState.board.currentPlayer
      );

      // Check if a Mill was formed
      if (this.currentState.board.millFormed) {
        // Get Current Player
        var currentPlayer = this.currentState.board.getCurrentPlayer();

        // Remove Enemy Piece with the necessary adjustments to the UI
        this.removeEnemyPiece(currentPlayer, index, point);
      }

      // Separate the movements based on the current game phase of the player
      else if (currentPlayerPhase === "placing") {
        // Get the current Player - The one to perform a action
        var currentPlayer = this.currentState.board.currentPlayer;

        // Check if it is a empty space
        if (this.currentState.board.getPiece(index) === 0) {
          // Add a piece
          this.addPiece(currentPlayer, index, point);
        } else {
          console.log("OCUPADO MEUUU!!!");
          console.log(this.currentState.board.board);
        }
      }
      // Check if the current player phase corresponds to moving or flying
      else if (
        currentPlayerPhase === "moving" ||
        currentPlayerPhase === "flying"
      ) {
        // Get Current Player
        var currentPlayer = this.currentState.board.currentPlayer;

        // Move Piece
        this.movePiece(currentPlayer, currentPlayerPhase, index, point);
      } else {
        console.log("DEU MERDA!");
      }
    } else {
      // -> Update Winner Stats on the HTML

      // Remove current player highlight
      this.removePlayerHighlight(this.currentState.board.currentPlayer);

      // Get Winner
      const winner = this.currentState.board.getWinner();

      // Toogle the game winner box
      this.triggerWinnerContainer(winner);

      console.log("[WINNER]", winner);
    }
  }
}
