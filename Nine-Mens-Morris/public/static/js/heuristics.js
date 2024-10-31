const CONTROL_POS = [9, 11, 12, 14];

function heuristic1(state) {
  // +1 point for each of the current player's pieces, -1 for each of the opponent's pieces
  const pieceCount = state.board.placedPieces[1] - state.board.placedPieces[2];

  // Assign higher values to key board positions that provide more opportunities for forming mills
  let boardControl = 0;
  for (const pos in CONTROL_POS) {
    if (state.board.board[pos] === 1) boardControl += 3;
    else if (state.board.board[pos] === 2) boardControl -= 3;
  }

  // For each complete mill, add +5 points
  const mills = MILLS.map((mill) => {
    if (mill.every((pos) => state.board.board[pos] === 1)) {
      return 5;
    } else if (mill.every((pos) => state.board.board[pos] === 2)) {
      return -5;
    }
    return 0;
  }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return pieceCount + boardControl + mills;
}
