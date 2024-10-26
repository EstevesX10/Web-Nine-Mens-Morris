// BY chatGPT
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
    17: [9, 16, 18],
    18: [17, 20],
    19: [11, 16, 21],
    20: [12, 18, 23],
    21: [19, 22],
    22: [14, 21, 23],
    23: [20, 22],
};

// TODO: thy this here?
let boardSize = document.getElementById("board-size").value;
let selectedPoints = []; // Using a Array with a singular position in order to store the previously selected point
let game = null;

// Actions to be performed in he first phase of the game (Placing pieces)
class PlaceAction {
    constructor(pos, player) {
        this.pos = pos;
        this.player = player;
    }

    execute(gameBoard) {
        gameBoard.board[this.pos] = this.player;
        gameBoard.placedPieces[this.player]++;
        if (
            gameBoard.placedPieces[this.player] >=
            gameBoard.playerPieces[this.player]
        ) {
            gameBoard.gamePhase[this.player] = "moving";
        }
        console.log(this.pos);

        // Check for mills [If there is a mill we do not change player. We do it otherwise]
        if (!gameBoard.checkMillFormed(this.pos, this.player)) {
            gameBoard.switchPlayer();
        } else {
            gameBoard.millFormed = true;
            console.log("Mill Formed");
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
        gameBoard.board[this.pos] = 0;
        gameBoard.playerPieces[3 - this.player]--;
        gameBoard.placedPieces[3 - this.player]--;
        gameBoard.switchPlayer();
        if (gameBoard.placedPieces[gameBoard.currentPlayer] === 3) {
            gameBoard.gamePhase[gameBoard.currentPlayer] = "moving";
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
        if (!gameBoard.checkMillFormed(this.pos, this.player)) {
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
        // Exemplo básico: Verifica linhas horizontais e verticais
        const mills = [
            // ["A1", "A4", "A7"],  // Exemplo de linha horizontal
            // ["D1", "D4", "D7"],  // Outra linha horizontal
            // ["A1", "D1", "G1"],  // Exemplo de linha vertical
            // Adicionar todas as possíveis combinações de trilhas

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

        return mills.some(
            (mill) =>
                mill.includes(point) &&
                mill.every((pos) => this.board[pos] === player)
        );
    }

    isAdjacent(initialIndex, newIndex) {
        return NEIGHBOR_TABLE[initialIndex].some((pos) => pos == newIndex);
    }

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
        console.log(`É a vez de ${this.currentPlayer}`);
    }

    toString() {
        console.log("PRINT CENAS BONITAS");
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

    handlePointClick(point, index) {
        // Get the phase of the current player
        var currentPlayerPhase = this.currentState.board.gamePhase[
            this.currentState.board.currentPlayer
        ];

        if (this.currentState.board.millFormed) {
            if (
                this.currentState.board.board[index] ===
                3 - this.currentState.board.currentPlayer
            ) {
                // Se já está selecionado, remove a seleção
                point.classList.remove("selected-player1");
                point.classList.remove("selected-player2");

                // Perform the action
                var action = new DestroyAction(
                    index,
                    this.currentState.board.currentPlayer
                );
                this.currentState.execute(action);
            }
            console.log("THERE IS A MILL");
        }

        // Separate the movements based on the current game pahse of the player
        else if (currentPlayerPhase === "placing") {
            if (this.currentState.board.getPiece(index) === 0) {
                // Adds the selected player class to the HTML
                point.classList.add(
                    `selected-player${this.currentState.board.currentPlayer}`
                );

                // Perform the action
                var action = new PlaceAction(
                    index,
                    this.currentState.board.currentPlayer
                );
                this.currentState.execute(action);

                console.log(
                    "cur player:",
                    this.currentState.board.currentPlayer
                );
            } else {
                console.log("OCUPADO MEUUU!!!");
                console.log(this.currentState.board.board);
            }
        }

        // [IN PROGRESS]
        // [TODO] THERE IS A PROBLEM WHEN WE REMOVE A PIECE FROM A PREVIOUS MILL, IF THE ENEMY PUTS ONE BACK IN ITS PLACE, THE GAME
        // IS NOT ALLOWING TO REMOVE A PIECE AS IT SHOULD
        else if (currentPlayerPhase === "moving") {
            // Check if any piece was previously selected
            if (selectedPoints.length > 0) {
                // Fetch previously selected piece [Starting piece] - The list with the selected points aims to have 1 point each time.
                var initialIndex = selectedPoints[0][1];
                var initialPoint = selectedPoints[0][0];

                // Check if the final place is empty
                if (this.currentState.board.getPiece(index) === 0) {
                    // Define the new position
                    var newIndex = index;
                    var newPoint = point;

                    // Check if a movement is valid
                    if (
                        this.currentState.board.isAdjacent(
                            initialIndex,
                            newIndex
                        )
                    ) {
                        // Remove point from previous place [In the HTML]
                        initialPoint.classList.remove(
                            `selected-player${this.currentState.board.currentPlayer}`
                        );

                        // Adds the point to the new place [In the HTML]
                        newPoint.classList.add(
                            `selected-player${this.currentState.board.currentPlayer}`
                        );

                        // Perform the action
                        var action = new MoveAction(
                            index,
                            this.currentState.board.currentPlayer
                        );
                        this.currentState.execute(action);

                        // Define a new and clean Array
                        selectedPoints = [];
                    }
                } else {
                    console.log("OCUPADO MEUUU!!!");
                    console.log(this.currentState.board.board);
                }
            } else {
                // We are selecting the initial piece
                // Check if the selected piece is valid
                if (
                    this.currentState.board.currentPlayer ===
                    this.currentState.board.getPiece(index)
                ) {
                    selectedPoints.push([point, index]);
                } else {
                    console.log("WRONG Point SELECTED!");
                }
            }
        } else if (currentPlayerPhase === "flying") {
            console.log("FlYING");
        } else {
            console.log("DEU MERDA!");
        }
    }
}

// board = Board(savedBoardSize, savedFirstPlayer)
// gameState = State(board)
