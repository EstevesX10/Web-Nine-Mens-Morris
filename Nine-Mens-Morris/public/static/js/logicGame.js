// TODO: thy this here?
let boardSize = document.getElementById('board-size').value

class PlaceAction {
    constructor(pos, player) {
        this.pos = pos;
        this.player = player;
    }

    execute(state) {
        gameState.board[this.pos] = this.player;
        gameState.placedPieces[this.player]++;
        if (gameState.placedPieces[this.player] >= gameState.playerPieces[this.player]) {
            gameState.gamePhase[this.player] = "moving";
        }
        gameState.currentPlayer = 3 - this.player;
    }
}

// TODO: think when to switch the player in this case
class DestroyAction {
    constructor(pos, player) {
        this.pos = pos;
        this.player = player;
    }

    execute(state) {
        gameState.board[this.pos] = 0;
        gameState.playerPieces[3 - this.player]--;
        gameState.currentPlayer = 3 - this.player;
    }
}

class MoveAction {
    constructor(from, to, player) {
        this.from = from;
        this.to = to;
        this.player = player;
    }

    execute(state) {
        gameState.board[this.from] = 0;
        gameState.board[this.to] = this.player;
        gameState.currentPlayer = 3 - this.player;
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
        this.history.append(action)
        this.cur_hist += 1
        action.execute(this.board)
    }

    // Undoes the last action and updates history
    // Returns False if there was no previous action
    undo(this) {
        if (this.cur_hist == 0){
            return False
        }

        this.cur_hist -= 1
        this.history[this.cur_hist].undo(this.board)
        return True
    }
}

class Board {
    constructor(boardSize, firstPlayer) {
        this.currentPlayer = firstPlayer;
        this.boardSize = boardSize;
        this.playerPieces = { 1: 3*boardSize, 2: 3*boardSize };          // 9 peças para cada jogador
        this.placedPieces = { 1: 0, 2: 0 };  // Contagem de peças colocadas
        this.board = {};  // Para armazenar o estado do tabuleiro
        this.gamePhase = { 1:"placing", 2:"placing" };  // Fase atual do jogo (placing ou moving)
    }

    getPiece(i) {
        return this.board[i];
    }
}

// TODO: is this being used?
function startGame() {
    // Obter o jogador inicial da configuração guardada
    const firstPlayer = localStorage.getItem("firstPlayer");

    // Inicializar o estado do jogo
    gameState.currentPlayer = firstPlayer;
}

// TODO: idk if it should be the action or the game loop to do this
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === "1" ? "2" : "1";
    console.log(`É a vez de ${gameState.currentPlayer}`);
}


let selectedPoints = new Set(); // Usar um Set para armazenar os pontos selecionados

function handlePointClick(point, index) {
    // Verificar se o ponto já está selecionado
    if (selectedPoints.has(index)) {
        // Se já está selecionado, remove a seleção
        point.classList.remove('selected-player1');
        point.classList.remove('selected-player2');
        selectedPoints.delete(index);
    } else {
        // Se não está selecionado, marca como selecionado
        if (gameState.currentPlayer == "1"){
            point.classList.add('selected-player1');
        }
        else {
            point.classList.add('selected-player2');
        }
        switchPlayer()
        selectedPoints.add(index);
    }

    console.log(gameState);
}

// --------------------------------------------------------------------------------------------------------

function checkMillFormed(point, player) {
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

    return mills.some(mill => mill.includes(point) && mill.every(pos => gameState.board[pos] === player));
}

function placePiece(point, i) {
    // Verifica se o ponto já tem uma peça
    if (gameState.board.getPiece(i) != 0) {
        console.log("Este ponto já está ocupado!");
        return;
    }

    if (gameState.board.currentPlayer == "1"){
        point.classList.add('selected-player1');
    }
    else {
        point.classList.add('selected-player2');
    }

    // Execute the action
    // TODO: different actions
    action = PlaceAction(i, gameState.board.currentPlayer);
    gameState.execute(action);

    // Verificar se uma trilha foi formada
    if (checkMillFormed(i, gameState.board.currentPlayer)) {
        console.log(`${gameState.board.currentPlayer} formou uma trilha! Remova uma peça do adversário.`);
        // Aqui entra a lógica para remover uma peça do adversário
    }

    // Alternar para o próximo jogador
    // switchPlayer();
}

function movePiece(fromPoint, toPoint) {
    // Verificar se é a fase de movimentação
    if (gameState.gamePhase !== "moving") {
        console.log("Ainda estamos na fase de colocação!");
        return;
    }

    // Verificar se o ponto de destino está vazio
    if (gameState.board[toPoint]) {
        console.log("Este ponto já está ocupado!");
        return;
    }

    // Mover a peça
    if (gameState.board[fromPoint] === gameState.currentPlayer) {
        gameState.board[toPoint] = gameState.currentPlayer;
        delete gameState.board[fromPoint];

        // Verificar se uma trilha foi formada
        if (checkMillFormed(toPoint, gameState.currentPlayer)) {
            console.log(`${gameState.currentPlayer} formou uma trilha! Remova uma peça do adversário.`);
            // Aqui entra a lógica para remover uma peça do adversário
        }

        // Alternar para o próximo jogador
        switchPlayer();
    } else {
        console.log("Não é a tua peça para mover!");
    }
}

function removeOpponentPiece(point) {
    const opponent = gameState.currentPlayer === "1" ? "2" : "1";

    // Verificar se o ponto pertence ao adversário
    if (gameState.board[point] === opponent) {
        delete gameState.board[point];
        gameState[`${opponent}Pieces`]--;

        console.log(`Uma peça de ${opponent} foi removida!`);

        // Verificar se o jogo acabou
        if (gameState[`${opponent}Pieces`] < 3) {
            console.log(`${gameState.currentPlayer} venceu! ${opponent} tem menos de 3 peças.`);
        }
    } else {
        console.log("Este ponto não pertence ao adversário!");
    }
}

function checkGameOver() {
    if (gameState.Player1Pieces < 3 || gameState.Player2Pieces < 3) {
        console.log(`${gameState.currentPlayer} venceu o jogo!`);
        return true;
    }
    return false;
}
