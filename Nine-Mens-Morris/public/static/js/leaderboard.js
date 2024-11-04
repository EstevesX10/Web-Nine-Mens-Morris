class Leaderboard {
  constructor() {
    // Keys are "difficulty_size"
    // Values are list [wins, losses]
    this.singleplayer = {};

    // Keys are player names
    // Values are scores
    this.multiplayer = {};

    // Get Leaderboard buttons
    const singlePlayerButton = document.getElementById("single-player-btn");
    const multiPlayerButton = document.getElementById("multi-player-btn");

    // Get Leaderboards
    const singlePlayerLeaderboard = document.querySelector(
      ".leaderboard-singleplayer"
    );
    const multiPlayerLeaderboard = document.querySelector(
      ".leaderboard-multiplayer"
    );

    singlePlayerButton.addEventListener("click", () => {
      // Show the single-player leaderboard and hide the multi-player one
      singlePlayerLeaderboard.classList.remove("hidden");
      multiPlayerLeaderboard.classList.add("hidden");
    });

    multiPlayerButton.addEventListener("click", () => {
      // Show the multi-player leaderboard and hide the single-player one
      multiPlayerLeaderboard.classList.remove("hidden");
      singlePlayerLeaderboard.classList.add("hidden");
    });
  }

  update_singleplayer(winner, difficulty, size) {
    this.singleplayer[`${difficulty}_${size}`][winner - 1]++;

    cell = document.query(".leaderboard-singleplayer");
    cell.textContent = this.singleplayer[`${difficulty}_${size}`][winner - 1];
  }

  generate_row() {
    // TODO: this
  }
}

g_leaderboard = new Leaderboard();
