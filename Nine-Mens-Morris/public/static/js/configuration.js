document.addEventListener('DOMContentLoaded', function() {
    // Get Config Form
    const form = document.getElementById('config-form');

    // Load initial configs  
    loadSavedSettings();

    // Save the configuration when submiting the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão de submissão

        // Capturar os valores dos campos de configuração
        const boardSize = document.getElementById('board-size').value;
        const opponent = document.getElementById('opponent').value;
        const firstPlayer = document.getElementById('first-player').value;
        const aiLevel = document.getElementById('ai-level').value;

        // Save parameters in the local storage
        localStorage.setItem('boardSize', boardSize);
        localStorage.setItem('opponent', opponent);
        localStorage.setItem('firstPlayer', firstPlayer);
        localStorage.setItem('aiLevel', aiLevel);

        // Load a previous configuration when loading the page  
        loadSavedSettings();

        alert('Configuration saved successfuly!');
    });

    // Load previously saved configuration
    function loadSavedSettings() {
        const savedBoardSize = localStorage.getItem('boardSize');
        const savedOpponent = localStorage.getItem('opponent');
        const savedFirstPlayer = localStorage.getItem('firstPlayer');
        const savedAiLevel = localStorage.getItem('aiLevel');

        // Fill the brackets with the saved values
        if (savedBoardSize) document.getElementById('board-size').value = savedBoardSize;
        if (savedOpponent) document.getElementById('opponent').value = savedOpponent;
        if (savedFirstPlayer) document.getElementById('first-player').value = savedFirstPlayer;
        if (savedAiLevel) document.getElementById('ai-level').value = savedAiLevel;

        // Update game state
        gameState = {
            currentPlayer: savedFirstPlayer,  // Começa com o jogador 1
            player1Pieces: 3*savedBoardSize,          // 9 peças para cada jogador
            player2Pieces: 3*savedBoardSize,
            placedPieces: { Player1: 0, Player2: 0 },  // Contagem de peças colocadas
            board: {},  // Para armazenar o estado do tabuleiro
            gamePhase: "placing",  // Fase atual do jogo (placing ou moving)
        }
    }
});

// const selectBtn = document.getElementById('select-btn');
// const text = document.getElementById('text');
// const option = document.getElementsByClassName('option');

// selectBtn.addEventListener('click', function() {
//     selectBtn.classList.toggle('active');
// });

// for (options of option) {
//     options.onclick = function() {
//         text.innerHTML = this.textContent;
//         selectBtn.classList.remove('active')
//     }
// }