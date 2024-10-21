// TODO: thy this here?
let boardSize = document.getElementById('board-size').value
let selectedPoints = new Set(); // Usar um Set para armazenar os pontos selecionados

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
        if (gameBoard.placedPieces[this.player] >= gameBoard.playerPieces[this.player]) {
            gameBoard.gamePhase[this.player] = "moving";
        }
        console.log(this.pos);

        // Check for mills [If there is a mill we do not change player. We do it otherwise]
        if (!gameBoard.checkMillFormed(this.pos, this.player)){
            gameBoard.switchPlayer();
        } else {
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
        gameBoard.switchPlayer();
        if (gameBoard.placedPieces[gameBoard.currentPlayer] === 3){
            gameBoard.gamePhase[gameBoard.currentPlayer] = "moving";
        }
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
        if (!gameBoard.checkMillFormed(this.pos, this.player)){
            gameBoard.switchPlayer();
        }
    }
}

class Board {
    constructor(boardSize, firstPlayer) {
        this.currentPlayer = firstPlayer;
        this.boardSize = boardSize;
        this.playerPieces = { 1: 3*boardSize, 2: 3*boardSize };          // 9 peças para cada jogador
        this.placedPieces = { 1: 0, 2: 0 };  // Contagem de peças colocadas
        this.board = Array(boardSize*8).fill(0);;  // Para armazenar o estado do tabuleiro
        this.gamePhase = { 1:"placing", 2:"placing" };  // Fase atual do jogo (placing ou moving)
    }

    getPiece(i) {
        return this.board[i];
    }

    gameOver(){
        return this.playerPieces[1] <= 2 || this.playerPieces[2] <= 2;
    }

    getWinner(){
        // Returns the ID of the winner [Only execute this when the game is over!]
        if (this.playerPieces[1] > this.playerPieces[2]){
            return 1;
        }
        else if (this.playerPieces[1] === this.playerPieces[2]){
            return 0;
        }
        else{
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
    
        return mills.some(mill => mill.includes(point) && mill.every(pos => this.board[pos] === player));
    }    

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
        console.log(`É a vez de ${this.currentPlayer}`);
    }

    toString(){
        console.log("PRINT CENAS BONITAS")
    }
}

// Holds the board state and history
class State {
    constructor(board) {
        this.board = board
        this.history = []
        this.cur_hist = 0
    }

    // Executes a action and updates the history
    execute(action) {
        this.history.splice(this.cur_hist);
        this.history.push(action)
        this.cur_hist += 1
        action.execute(this.board)
    }

    // Undoes the last action and updates history
    // Returns False if there was no previous action
    undo(action) {
        if (this.cur_hist == 0){
            return False
        }

        this.cur_hist -= 1
        this.history[this.cur_hist].undo(this.board)
        return True
    }
}

class Game {
    constructor(state){
        this.currentState = state
    }

    handlePointClick(point, index) {
        // Get the phase of the current player
        var currentPlayerPhase = this.currentState.board.gamePhase[this.currentState.board.currentPlayer];

        // Separate the movements based on the current game pahse of the player
        if (currentPlayerPhase === "placing"){
            if (this.currentState.board.board[index] === 0) {
                // Adds the selected player class to the HTML
                point.classList.add(`selected-player${this.currentState.board.currentPlayer}`);

                // Perform the action
                var action = new PlaceAction(index, this.currentState.board.currentPlayer)
                this.currentState.execute(action);

                console.log("cur player:", this.currentState.board.currentPlayer);
            }
            else {
                console.log("OCUPADO MEUUU!!!");
                console.log(this.currentState.board.board);
            }
        }
        else if (currentPlayerPhase === "moving"){
            console.log("MOVING")
        }
        else if (currentPlayerPhase === "flying"){
            console.log("FlYING")
        }
        else{
            console.log("DEU MERDA!");
        }

        // Verificar se o ponto já está selecionado
        // if (selectedPoints.has(index)) {
        //     // Se já está selecionado, remove a seleção
        //     point.classList.remove('selected-player1');
        //     point.classList.remove('selected-player2');
        //     selectedPoints.delete(index);
        // } else {
        //     // Se não está selecionado, marca como selecionado
        //     if (this.currentState.board.currentPlayer == "1"){
        //         point.classList.add('selected-player1');
        //     }
        //     else {
        //         point.classList.add('selected-player2');
        //     }
        //     selectedPoints.add(index);
        // }
    }

    // startGame() {
    //     // Obter o jogador inicial da configuração guardada
    //     const firstPlayer = localStorage.getItem("firstPlayer");
    
    //     // Inicializar o estado do jogo
    //     this.currentState.board.currentPlayer = firstPlayer;
    // }
}


// board = Board(savedBoardSize, savedFirstPlayer)
// gameState = State(board)
