function heuristic1(state) {
  return state.board.placedPieces[1] - state.board.placedPieces[2];
}
