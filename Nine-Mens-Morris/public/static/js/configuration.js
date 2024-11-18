DIFFICULTY_NAMES = { 0: "pvp", 2: "Easy", 3: "Medium", 5: "Hard" };

class Configuration {
  constructor() {
    // Get Config Form
    const form = document.getElementById("config-form");

    // For Testing Purposes
    // localStorage.clear();

    // Load initial board configuration
    this.loadBoard();

    // Save the configuration when submiting the form and loading a new board based on those new parameters
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Save board configuration parameters
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
      this.loadBoard();

      alert("Configuration saved successfuly!");
    });
  }

  loadBoard() {
    const savedBoardSize = parseInt(localStorage.getItem("boardSize") || "2");
    const savedOpponent = localStorage.getItem("opponent", "ai") || "ai";
    const savedFirstPlayer = parseInt(
      localStorage.getItem("firstPlayer", "1") || "1"
    );
    const savedAiLevel = parseInt(localStorage.getItem("aiLevel", "1") || "3");

    // Fill the brackets with the saved values
    if (savedBoardSize)
      document.getElementById("board-size").value = savedBoardSize;
    if (savedOpponent)
      document.getElementById("opponent").value = savedOpponent;
    if (savedFirstPlayer)
      document.getElementById("first-player").value = savedFirstPlayer;
    if (savedAiLevel) document.getElementById("ai-level").value = savedAiLevel;

    // Crate a new Board [On the FrontEnd] based on the board size
    canvas.generateBoard(savedBoardSize);

    // Remove all the player pieces if there were any previously
    var player1PiecesContainer = document.getElementById("player1-pieces");
    player1PiecesContainer.replaceChildren();
    var player2PiecesContainer = document.getElementById("player2-pieces");
    player2PiecesContainer.replaceChildren();

    // Generate the Each Player's Available Pieces
    canvas.generatePlayerPieces(savedBoardSize * 3);

    // Update background Color of the first player
    const firstPlayerInfo = document.querySelector(
      `.player${savedFirstPlayer}-info`
    );
    firstPlayerInfo.classList.add(`active-player${savedFirstPlayer}`);

    // Set the initial movement phases for both players
    const player1Phase = document.getElementById(`player1-phase`);
    player1Phase.textContent = "Placing Phase";

    const player2Phase = document.getElementById(`player2-phase`);
    player2Phase.textContent = "Placing Phase";

    // Set the initial players messages
    const player1Message = document.getElementById(`player1-notes`);
    player1Message.textContent = "Place a Piece";

    const player2Message = document.getElementById(`player2-notes`);
    player2Message.textContent = "Place a Piece";

    // Reset the winner container
    const winnerContainer = document.querySelector(".game-winner");
    winnerContainer.classList.remove(`active-player1`);
    winnerContainer.classList.remove(`active-player2`);

    // Get the player 2 sections
    const player2GiveUp = document.querySelector(".player2-resign-container");
    const player2Name = document.querySelector("#player2-name");

    // Get the restart button section
    const restartButtonSection = document.querySelector(
      "#restart-button-container"
    );

    // Update the game state
    var board = new Board(savedBoardSize, savedFirstPlayer);
    var gameState = new State(board);

    // Check for the Game Opponent
    if (savedOpponent === "ai") {
      game = new Game(gameState, savedAiLevel);

      player2GiveUp.style.display = "none";
      if (savedFirstPlayer === 2) {
        game.doAiMove(); // Trigger AI first move
      }

      // Check if the HTML element has a hidden class and remove it if so
      if (restartButtonSection.classList.contains("hidden")) {
        restartButtonSection.classList.remove("hidden");
      }

      player2Name.textContent = "AI";
    } else {
      game = new Game(gameState, 0);

      // Check if the HTML element already has a hidden class
      if (!restartButtonSection.classList.contains("hidden")) {
        restartButtonSection.classList.add("hidden");
      }

      player2GiveUp.style.display = "";
      player2Name.textContent = "Player 2";
    }
    // console.log(gameState)
  }
}

game = null;
const g_config = new Configuration();
