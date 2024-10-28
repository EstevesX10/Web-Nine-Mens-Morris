document.addEventListener("DOMContentLoaded", function () {
  // Get Config Form
  const form = document.getElementById("config-form");

  // For Testing Purposes
  // localStorage.clear();

  // Load initial board configuration
  loadBoard();

  // Save the configuration when submiting the form and loading a new board based on those new parameters
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Previne o comportamento padrão de submissão

    // Capturar os valores dos campos de configuração
    const boardSize = document.getElementById("board-size").value;
    const opponent = document.getElementById("opponent").value;
    const firstPlayer = document.getElementById("first-player").value;
    const aiLevel = document.getElementById("ai-level").value;

    // Save parameters in the local storage
    localStorage.setItem("boardSize", boardSize);
    localStorage.setItem("opponent", opponent);
    localStorage.setItem("firstPlayer", firstPlayer);
    localStorage.setItem("aiLevel", aiLevel);

    // Load a previous configuration when loading the page
    loadBoard();

    alert("Configuration saved successfuly!");
  });

  // Load a Board based on the configuration (Default or previously saved)
  function loadBoard() {
    const savedBoardSize = parseInt(localStorage.getItem("boardSize") || "2");
    const savedOpponent = parseInt(
      localStorage.getItem("opponent", "ai") || "ai"
    );
    const savedFirstPlayer = parseInt(
      localStorage.getItem("firstPlayer", "1") || "1"
    );
    const savedAiLevel = parseInt(localStorage.getItem("aiLevel", "1") || "1");

    // Fill the brackets with the saved values
    if (savedBoardSize)
      document.getElementById("board-size").value = savedBoardSize;
    if (savedOpponent)
      document.getElementById("opponent").value = savedOpponent;
    if (savedFirstPlayer)
      document.getElementById("first-player").value = savedFirstPlayer;
    if (savedAiLevel) document.getElementById("ai-level").value = savedAiLevel;

    // Crate a new Board [On the FrontEnd] based on the board size
    generateBoard(savedBoardSize);

    // Remove all the player pieces if there were any previously
    var player1PiecesContainer = document.getElementById("player1-pieces");
    player1PiecesContainer.replaceChildren();
    var player2PiecesContainer = document.getElementById("player2-pieces");
    player2PiecesContainer.replaceChildren();

    // Generate the Each Player's Available Pieces
    generatePlayerPieces(savedBoardSize * 3);

    // Update background Color of the first player
    const firstPlayerInfo = document.querySelector(
      `.player${savedFirstPlayer}-info`
    );
    firstPlayerInfo.classList.add(`active-player${savedFirstPlayer}`);

    // Set the initial movement phases for both players
    const player1Phase = document.querySelector(`#player1-phase`);
    player1Phase.textContent = "Placing Phase";

    const player2Phase = document.querySelector(`#player2-phase`);
    player2Phase.textContent = "Placing Phase";

    // Update the game state
    board = new Board(savedBoardSize, savedFirstPlayer);
    gameState = new State(board);
    game = new Game(gameState);
    // console.log(gameState)
  }
});
