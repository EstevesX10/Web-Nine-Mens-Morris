class Leaderboard {
  Leaderboard() {
    // Keys are "difficulty_size"
    // Values are list [wins, losses]
    this.singleplayer = {};

    // Keys are player names
    // Values are scores
    this.multiplayer = {};
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
