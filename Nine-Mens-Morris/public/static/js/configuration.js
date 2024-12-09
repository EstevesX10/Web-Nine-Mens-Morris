export const DIFFICULTY_NAMES = { 0: "pvp", 2: "Easy", 3: "Medium", 5: "Hard" };

import { State, Board, Game } from "./logicGame.js";
import { Canvas } from "./canvas.js";
import { join } from "./serverRequests.js";
import { hookUpdate } from "./serverRequests.js";

class Configuration {
  constructor() {
    // Get Config Form
    const form = document.getElementById("config-form");

    // For Testing Purposes
    // localStorage.clear();

    // Load initial board configuration
    // this.loadBoard();

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

  async loadBoard() {
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

    // Remove all the player pieces if there were any previously
    var player1PiecesContainer = document.getElementById("player1-pieces");
    player1PiecesContainer.replaceChildren();
    var player2PiecesContainer = document.getElementById("player2-pieces");
    player2PiecesContainer.replaceChildren();

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
    player2GiveUp.style.display = "none";
    const player2Name = document.querySelector("#player2-name");

    // Get the restart button section
    const restartButtonSection = document.querySelector(
      "#restart-button-container"
    );

    // Update the game state
    var board = new Board(savedBoardSize, savedFirstPlayer);
    var gameState = new State(board);
    let canvas = null;

    // Check for the Game Opponent
    if (savedOpponent === "ai") {
      // Define a new instance for the game
      game = new Game(gameState, savedAiLevel, null);

      if (savedFirstPlayer === 2) {
        game.doAiMove(); // Trigger AI first move
      }

      // Check if the HTML element has a hidden class and remove it if so
      if (restartButtonSection.classList.contains("hidden")) {
        restartButtonSection.classList.remove("hidden");
      }

      player2Name.textContent = "AI";

      // Update Canvas
      canvas = new Canvas("", game);
    } else {
      // Activate the Throbber
      let throbber = document.getElementById("throbber");
      let throbber_bg = document.getElementById("throbber-bg");
      
      throbber.classList.add("active");
      throbber_bg.classList.add("active");

      // Get the current authenticated user
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      // Join a Session with the default configuration
      let joinResponse = await join(username, password, 4, savedBoardSize);

      // Create a instance of the game
      game = new Game(gameState, 0, joinResponse["game"]);

      // Check if the HTML element already has a hidden class
      if (!restartButtonSection.classList.contains("hidden")) {
        restartButtonSection.classList.add("hidden");
      }

      player2Name.textContent = "Player 2";

      // Update Canvas
      canvas = new Canvas("", game);
      console.log(`Connect to ${joinResponse.game} as ${username}`);
      game.setupUpdateEvents(canvas.createNetworkUpdate());
    }

    // Crate a new Board [On the FrontEnd] based on the board size
    canvas.generateBoard(savedBoardSize);

    // Generate the Each Player's Available Pieces
    canvas.generatePlayerPieces(savedBoardSize * 3);
  }
}

let game = null;
export let g_config = new Configuration();
