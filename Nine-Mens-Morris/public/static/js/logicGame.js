let boardSize = document.getElementById('board-size').value

var gameState = {};

// class square {
//     constructor(){
//         this.topLeft = 0;
//         this.topMiddle = 0;
//         this.topRight = 0;
//         this.middleLeft = 0;
//         this.middleRight = 0;
//         this.bottomLeft = 0;
//         this.bottomMiddle = 0;
//         this.bottomRight = 0;
//     }
// }

// class board {
//     constructor(boardSize) {
//         this.squares = 0
//     }
// }

function startGame() {
    // Obter o jogador inicial da configuração guardada
    const firstPlayer = localStorage.getItem("firstPlayer");

    // Inicializar o estado do jogo
    gameState.currentPlayer = firstPlayer;
}

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
    if (gameState.board[i]) {
        console.log("Este ponto já está ocupado!");
        return;
    }

    // Colocar a peça no ponto selecionado
    gameState.board[i] = gameState.currentPlayer;
    gameState.placedPieces[gameState.currentPlayer]++;

    if (gameState.currentPlayer == "1"){
        point.classList.add('selected-player1');
    }
    else {
        point.classList.add('selected-player2');
    }

    // Verificar se uma trilha foi formada
    if (checkMillFormed(i, gameState.currentPlayer)) {
        console.log(`${gameState.currentPlayer} formou uma trilha! Remova uma peça do adversário.`);
        // Aqui entra a lógica para remover uma peça do adversário
    }

    // Alternar para o próximo jogador
    switchPlayer();

    // Verificar se a fase de colocação terminou
    if (gameState.placedPieces.Player1 === 9 && gameState.placedPieces.Player2 === 9) {
        gameState.gamePhase = "moving";
        console.log("Fase de movimentação iniciada!");
    }
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