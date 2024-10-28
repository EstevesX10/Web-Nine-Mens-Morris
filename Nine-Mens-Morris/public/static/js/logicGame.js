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

  gameOver() {
    return this.playerPieces[1] <= 2 || this.playerPieces[2] <= 2;
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

  getOpponent(player) {
    return 3 - player;
  }

  switchPlayer() {
    // Update background Color of the previous player
    const previousPlayerInfo = document.querySelector(
      `.player${this.currentPlayer}-info`
    );
    previousPlayerInfo.classList.remove("active-player");

    // Update Current Player
    this.currentPlayer = 3 - this.currentPlayer;

    // Update background Color of the current player
    const currentPlayerInfo = document.querySelector(
      `.player${this.currentPlayer}-info`
    );
    currentPlayerInfo.classList.add("active-player");
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

  // Check valid movement

  highlightPossibleMoves(currentPlayer, index) {
    // Highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and can only go to the adjacent positions
    if (this.currentState.board.gamePhase[currentPlayer] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[index].forEach((pointIndex) => {
        if (points[pointIndex].classList.length === 1) {
          points[pointIndex].classList.add(
            `possible-move-player${currentPlayer}`
          );
        }
      });
    } else {
      // We can Fly and therefore go into any available position
      points.forEach((point) => {
        if (point.classList.length === 1) {
          point.classList.add(`possible-move-player${currentPlayer}`);
        }
      });
    }
  }

  removeHighlightPossibleMoves(currentPlayer, index) {
    // Remove highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and could have only gone to the adjacent positions
    if (this.currentState.board.gamePhase[currentPlayer] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[index].forEach((pointIndex) => {
        points[pointIndex].classList.remove(
          `possible-move-player${currentPlayer}`
        );
      });
    } else {
      // We could have fled and therefore we need to take into consideration the previously available positions
      points.forEach((point) => {
        point.classList.remove(`possible-move-player${currentPlayer}`);
      });
    }
  }

  handlePointClick(point, index) {
    // Get the phase of the current player
    var currentPlayerPhase =
      this.currentState.board.gamePhase[this.currentState.board.currentPlayer];

    // Check if a Mill was formed
    if (this.currentState.board.millFormed) {
      // Get Current Player
      var currentPlayer = this.currentState.board.currentPlayer;

      // Get Opponent
      var opponent = this.currentState.board.getOpponent(currentPlayer);

      // Check if the piece to remove corresponds to a opponent piece
      if (this.currentState.board.board[index] === opponent) {
        // If selected, remove the selection
        point.classList.remove("point-player1");
        point.classList.remove("point-player2");

        // Perform the action
        var action = new DestroyAction(index, currentPlayer);
        this.currentState.execute(action);
        console.log("executed");

        // Go back to the player's previous directive since a piece was already removed
        if (currentPlayer === 1) {
          document.getElementById(`player${currentPlayer}-notes`).textContent =
            lastPlayer1Note;
        } else {
          document.getElementById(`player${currentPlayer}-notes`).textContent =
            lastPlayer2Note;
        }

        // Check if the opponent has 3 pieces [Has transitioned into a flying phase]
        if (this.currentState.board.gamePhase[opponent] === "flying") {
          // Update the HTML text content for the current phase
          document.getElementById(`player${opponent}-phase`).textContent =
            "Flying Phase";

          // Update the HTML text content for the player messages
          document.getElementById(`player${opponent}-notes`).textContent =
            "Fly a Piece";

          // Update the last movement directive the player has received
          if (opponent === 1) {
            lastPlayer1Note = "Fly a Piece";
          } else {
            lastPlayer2Note = "Fly a Piece";
          }
        }
      }
      console.log("THERE IS A MILL");
    }

    // Separate the movements based on the current game phase of the player
    else if (currentPlayerPhase === "placing") {
      // Get the current Player - The one to perform a action
      var currentPlayer = this.currentState.board.currentPlayer;

      if (this.currentState.board.getPiece(index) === 0) {
        // Remove a piece from the pieces container
        var piecesContainer = document.getElementById(
          `player${currentPlayer}-pieces`
        );
        piecesContainer.removeChild(piecesContainer.firstElementChild);

        // Adds the selected player class to the HTML
        point.classList.add(`point-player${currentPlayer}`);

        // Perform the placing action
        var action = new PlaceAction(index, currentPlayer);
        this.currentState.execute(action);

        // Check if the game phase was changed
        if (this.currentState.board.gamePhase[currentPlayer] === "moving") {
          // Update the HTML text content for the current phase
          document.getElementById(`player${currentPlayer}-phase`).textContent =
            "Moving Phase";

          // Update the HTML text content for the player messages
          document.getElementById(`player${currentPlayer}-notes`).textContent =
            "Move a Piece";

          // Update the last movement directive the player has received
          if (currentPlayer === 1) {
            lastPlayer1Note = "Move a Piece";
          } else {
            lastPlayer2Note = "Move a Piece";
          }
        }

        // Check if a mill was formed
        if (this.currentState.board.millFormed) {
          // Update the HTML text content for the player messages - Inform that he has made a mill
          document.getElementById(`player${currentPlayer}-notes`).textContent =
            "[MILL FORMED]\nRemove a Enemy Piece";
        }
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

      // Check if any piece was previously selected
      if (selectedPoints.length > 0) {
        // Fetch previously selected piece [Starting piece] - The list with the selected points aims to have 1 point each time.
        var initialIndex = selectedPoints[0][1];
        var initialPoint = selectedPoints[0][0];

        // Check if the final place is empty
        if (this.currentState.board.getPiece(index) === 0) {
          // Check if a movement is valid
          if (
            this.currentState.board.isAdjacent(initialIndex, index) ||
            currentPlayerPhase === "flying"
          ) {
            // Remove the styling of the initial point [In the HTML]
            initialPoint.classList.remove(
              `point-player${currentPlayer}`,
              `selected-point-player${currentPlayer}`
            );

            // Adds the point to the new place [In the HTML]
            point.classList.add(`point-player${currentPlayer}`);

            // Perform the action
            var action = new MoveAction(initialIndex, index, currentPlayer);
            this.currentState.execute(action);

            // Check if a mill was formed
            if (this.currentState.board.millFormed) {
              // Update the HTML text content for the player messages - Inform that he has made a mill
              document.getElementById(
                `player${currentPlayer}-notes`
              ).textContent = "[MILL FORMED]\nRemove a Enemy Piece";
            }

            // Define a new and clean Array
            selectedPoints = [];

            // Remove highlight from the possible moves
            this.removeHighlightPossibleMoves(currentPlayer, initialIndex);
          } else {
            // The target place is not considered to be a valid move
            // Clear Previously Selected Piece
            selectedPoints = [];

            // Removes a highlight of the selected piece
            initialPoint.classList.remove(
              `selected-point-player${currentPlayer}`
            );

            // Remove highlight from the possible moves
            this.removeHighlightPossibleMoves(currentPlayer, initialIndex);
          }
        } else {
          console.log("OCUPADO MEUUU!!!");
          console.log(this.currentState.board.board);
        }
      } else {
        // We are selecting the initial piece
        // Check if the selected piece is valid
        if (currentPlayer === this.currentState.board.getPiece(index)) {
          // Saves the selected point
          selectedPoints.push([point, index]);

          // Adds a highlight to the piece to better visualize the one selected
          point.classList.add(`selected-point-player${currentPlayer}`);

          // Add a highlight for every possible move
          this.highlightPossibleMoves(currentPlayer, index);
        } else {
          // Clear Previously Selected Piece
          selectedPoints = [];

          console.log("WRONG Point SELECTED!");
        }
      }
    } else {
      console.log("DEU MERDA!");
    }
  }
}
