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

  updateSingleplayer(winner, difficulty, size) {
    const id = `${difficulty}_${size}`;
    if (this.singleplayer[id] === undefined) {
      this.singleplayer[id] = [0, 0];
    }
    this.singleplayer[id][winner - 1]++;

    const cell =
      document.getElementById(id) ||
      this.generateRow(difficulty, size, ".leaderboard-singleplayer tbody");
    cell.children[winner + 1].textContent = this.singleplayer[id][winner - 1];
  }

  generateRow(difficulty, size, parentId) {
    const rowElem = document.createElement("tr");
    const confElem = document.createElement("td");
    const aiElem = document.createElement("td");
    const winElem = document.createElement("td");
    const lossElem = document.createElement("td");

    const children = [confElem, aiElem, winElem, lossElem];
    children.forEach((element) => {
      rowElem.appendChild(element);
    });
    const parent = document.querySelector(parentId);
    parent.appendChild(rowElem);

    rowElem.id = `${difficulty}_${size}`;
    confElem.textContent = `${size} squares`;
    aiElem.textContent = difficulty !== 0 ? difficulty : "pvp";
    winElem.textContent = 0;
    lossElem.textContent = 0;
    return rowElem;
  }
}

g_leaderboard = new Leaderboard();
