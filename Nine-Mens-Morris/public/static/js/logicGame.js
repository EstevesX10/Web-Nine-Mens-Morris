const MILLS = [
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

// Actions to be performed in he first phase of the game (Placing pieces)
class PlaceAction {
  constructor(pos, player) {
    this.pos = pos;
    this.player = player;

    this.switchedPlayer = false;
    this.previousPhase = "place";
  }

  execute(gameBoard) {
    // Place a Piece
    gameBoard.board[this.pos] = this.player;

    // Update the number of placed pieces of the player
    gameBoard.placedPieces[this.player]++;

    this.previousPhase = gameBoard.gamePhase[this.player];
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
      this.switchedPlayer = true;
    } else {
      gameBoard.millFormed = true;
    }
  }

  undo(gameBoard) {
    // Place a Piece
    gameBoard.board[this.pos] = 0;

    // Update the number of placed pieces of the player
    gameBoard.placedPieces[this.player]--;

    // Update player phase
    gameBoard.gamePhase[this.player] = this.previousPhase;

    // Check for mills [If there is a mill we do not change player. We do it otherwise]
    if (this.switchedPlayer) {
      gameBoard.switchPlayer();
    }
    gameBoard.millFormed = false;
  }
}

// We suppose that the action is valid and good to be performed
// Can be performed anytime during the game loop
class DestroyAction {
  constructor(pos, player) {
    this.pos = pos;
    this.player = player;

    this.previousPhase = "destroy";
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
    this.previousPhase = gameBoard.gamePhase[gameBoard.currentPlayer];
    if (
      gameBoard.playerPieces[gameBoard.currentPlayer] === 3 &&
      gameBoard.getPlayerPhase(gameBoard.currentPlayer) !== "placing"
    ) {
      // Update the game phase
      gameBoard.gamePhase[gameBoard.currentPlayer] = "flying";
    }
    gameBoard.millFormed = false;
  }

  undo(gameBoard) {
    // Remove piece from the selected position
    gameBoard.board[this.pos] = gameBoard.getOpponent(this.player);

    // Update player pieces
    gameBoard.playerPieces[gameBoard.getOpponent(this.player)]++;
    gameBoard.placedPieces[gameBoard.getOpponent(this.player)]++;

    // Update player phase
    gameBoard.gamePhase[gameBoard.getOpponent(this.player)] =
      this.previousPhase;

    // Switch Player
    gameBoard.switchPlayer();

    gameBoard.millFormed = true;
  }
}

class MoveAction {
  constructor(from, to, player) {
    this.from = from;
    this.to = to;
    this.player = player;

    this.switchedPlayer = false;
  }

  execute(gameBoard) {
    gameBoard.board[this.from] = 0;
    gameBoard.board[this.to] = this.player;

    // Check for mills [If there is a mill we do not change player. We do it otherwise]
    if (!gameBoard.checkMillFormed(this.to, this.player)) {
      gameBoard.switchPlayer();
      this.switchedPlayer = true;
    } else {
      gameBoard.millFormed = true;
    }
  }

  undo(gameBoard) {
    gameBoard.board[this.from] = this.player;
    gameBoard.board[this.to] = 0;

    if (this.switchedPlayer) {
      gameBoard.switchPlayer();
    }
    gameBoard.millFormed = false;
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
    return MILLS.some(
      (mill) =>
        mill.includes(point) && mill.every((pos) => this.board[pos] === player)
    );
  }

  isAdjacent(initialIndex, newIndex) {
    return NEIGHBOR_TABLE[initialIndex].some((pos) => pos == newIndex);
  }

  switchPlayer() {
    // Update Current Player
    this.currentPlayer = 3 - this.currentPlayer;
  }

  getValidActions() {
    if (this.gameOver()) return [];

    if (this.millFormed) {
      // Every enemy piece can be destroyed
      return this.board
        .map((v, i) =>
          // This is ridiculous...
          v === this.getOpponent(this.currentPlayer)
            ? new DestroyAction(i, this.currentPlayer)
            : null
        )
        .filter((item) => item !== null); // Filter out null values
    }

    if (this.getPlayerPhase(this.currentPlayer) === "placing") {
      // Can place piece in every available slot
      return this.board
        .map((v, i) =>
          v === 0 ? new PlaceAction(i, this.currentPlayer) : null
        )
        .filter((item) => item !== null); // Filter out null values
    }

    return this.board
      .map((v, i) => {
        if (v === this.currentPlayer) {
          const candidateDestinations =
            this.getPlayerPhase(this.currentPlayer) === "flying"
              ? Array.from({ length: this.board.length }, (_, index) => index) // Can move anywhere
              : NEIGHBOR_TABLE[i]; // Can move to neighbors
          return candidateDestinations
            .filter((neighbor_i) => this.board[neighbor_i] === 0)
            .map((to) => new MoveAction(i, to, this.currentPlayer));
        } else {
          return null;
        }
      })
      .filter((item) => item !== null) // Filter out null values
      .flat();
  }

  /// Get game result
  /// 0 - Not terminal continue game
  /// 1 - Player_1 wins
  /// 2 - Player_2 wins
  /// 3 - Draw
  isTerminal() {
    if (this.gameOver()) {
      let winner = this.getWinner();
      if (winner === 0) {
        winner = 3;
      }
      return winner;
    }
    return 0;
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
      return false;
    }

    this.cur_hist -= 1;
    this.history[this.cur_hist].undo(this.board);
    return true;
  }
}

class Game {
  constructor(state, levelAI) {
    this.currentState = state;
    this.levelAI = levelAI;
    this.selectedPoints = [];
  }

  getCurrentPlayer() {
    return this.currentState.board.getCurrentPlayer();
  }

  isMillFormed() {
    // Checks if a Mill is formed
    return this.currentState.board.millFormed;
  }

  getSelectedPieces() {
    return this.selectedPoints;
  }

  checkGameOver() {
    // Check if the game is over
    if (
      this.currentState.board.gameOver() ||
      this.player1GaveUp ||
      this.player2GaveUp
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateSingleplayerLeaderboard(winner) {
    // Update Single Player Leaderboard
    g_leaderboard.updateSingleplayer(
      winner,
      this.levelAI,
      this.currentState.board.boardSize
    );
  }

  async doAiMove() {
    // Check if game is over
    if (this.checkGameOver()) {
      return;
    }

    // wait a bit but dont block everything
    await new Promise((r) => setTimeout(r, 750));

    // Compute the action to be performed by the MinMax
    const aiAction = executeMinimaxMove(
      heuristic1,
      this.levelAI
    )(this.currentState);

    return aiAction;
  }
}
