function executeMinimaxMove(evaluateFunc, depth) {
  return function executeMinimaxMoveAux(state) {
    /**
     * Updates the game state to the best possible move (uses minimax to determine it)
     */
    let bestMoves = [];
    let bestEval = -Infinity;
    const actions = state.board.getValidActions();

    if (actions.length === 1) {
      // There isn't much to do and this can take a long time
      return actions[0];
    }

    const player = state.board.currentPlayer;
    for (const move of actions) {
      state.execute(move);
      const newStateEval = minimax(
        state,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        player,
        evaluateFunc
      );
      state.undo();

      if (newStateEval > bestEval) {
        bestMoves = [move];
        bestEval = newStateEval;
      } else if (newStateEval === bestEval) {
        bestMoves.push(move);
      }
    }

    if (bestMoves.length === 0) {
      throw new Error(`Board has no valid actions ${state.board}`);
    }

    const randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return randomMove;
  };
}

function minimax(state, depth, alpha, beta, maximizing, player, evaluateFunc) {
  if (depth === 0 || state.board.isTerminal() !== 0) {
    return evaluateFunc(state) * (player === 1 ? 1 : -1);
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of state.board.getValidActions()) {
      state.execute(move);
      const eval = minimax(
        state,
        depth - 1,
        alpha,
        beta,
        false,
        player,
        evaluateFunc
      );
      state.undo();
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of state.board.getValidActions()) {
      state.execute(move);
      const eval = minimax(
        state,
        depth - 1,
        alpha,
        beta,
        true,
        player,
        evaluateFunc
      );
      state.undo();
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}
