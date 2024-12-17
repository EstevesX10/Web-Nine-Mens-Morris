import { ranking } from "./serverRequests.js";

export const DIFFICULTY_NAMES = { 0: "pvp", 2: "Easy", 3: "Medium", 5: "Hard" };

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

    multiPlayerButton.addEventListener("click", async () => {
      // Show the multi-player leaderboard and hide the single-player one
      multiPlayerLeaderboard.classList.remove("hidden");
      singlePlayerLeaderboard.classList.add("hidden");

      // Get the board Size
      let size = parseInt(document.getElementById("board-size").value);

      // Perform a Request to the Server for the Rankings
      let rankingResponse = await ranking(4, size);

      // Update the Multiplayer table
      this.createMultiPlayerTable(rankingResponse);
    });
  }

  // Function to dynamically create a table
  async createMultiPlayerTable(rankingResponse) {
    // Fetch the Leaderboard Container and remove any previous tables that may be inside it
    let container = document.querySelector(".leaderboard-multiplayer");
    let oldTable = document.querySelector(".leaderboard-multiplayer table");
    container.removeChild(oldTable);

    // Create a table element
    const table = document.createElement("table");

    // Create a table header row
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    let th, cell;
    // Create the Ranking Header
    th = document.createElement("th");
    th.textContent = "Ranking";
    headerRow.appendChild(th);

    // Create the UserName Header
    th = document.createElement("th");
    th.textContent = "UserName";
    headerRow.appendChild(th);

    // Create the Victories Header
    th = document.createElement("th");
    th.textContent = "Victories";
    headerRow.appendChild(th);

    // Create the Games Header
    th = document.createElement("th");
    th.textContent = "Games";
    headerRow.appendChild(th);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    let rows = rankingResponse["ranking"].length;

    // Create the table body
    const tbody = document.createElement("tbody");
    for (let r = 0; r < rows; r++) {
      const row = document.createElement("tr");

      // Add the Ranking Value
      cell = document.createElement("td");
      cell.textContent = r + 1;
      row.appendChild(cell);

      // Add the UserName Value
      cell = document.createElement("td");
      cell.textContent = rankingResponse["ranking"][r]["nick"];
      row.appendChild(cell);

      // Add the Victories Value
      cell = document.createElement("td");
      cell.textContent = rankingResponse["ranking"][r]["victories"];
      row.appendChild(cell);

      // Add the Games Value
      cell = document.createElement("td");
      cell.textContent = rankingResponse["ranking"][r]["games"];
      row.appendChild(cell);

      // Append the Row to the new tbody
      tbody.appendChild(row);
    }

    // Append the table to the container
    table.appendChild(tbody);
    container.appendChild(table);
  }

  updateSingleplayer(winner, difficulty, size) {
    const id = `${difficulty}_${size}`;
    if (this.singleplayer[id] === undefined) {
      this.singleplayer[id] = [0, 0];
    }
    this.singleplayer[id][winner - 1]++;

    const cell =
      document.getElementById(id) ||
      this.generateRowSinglePlayer(
        difficulty,
        size,
        ".leaderboard-singleplayer tbody"
      );
    cell.children[winner + 1].textContent = this.singleplayer[id][winner - 1];
  }

  generateRowSinglePlayer(difficulty, size, parentId) {
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
    aiElem.textContent = DIFFICULTY_NAMES[difficulty];
    winElem.textContent = 0;
    lossElem.textContent = 0;
    return rowElem;
  }
}

export let g_leaderboard = new Leaderboard();
