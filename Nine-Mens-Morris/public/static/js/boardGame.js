class Canvas {
  constructor(config, game) {
    // Save the instance of a game
    this.game.game = game;

    // Get the board container
    this.boardContainer = document.getElementById("board");

    // Define some variables related to the points
    this.pointRadius = 12;
    this.pointSize = 2 * this.pointRadius;
    this.lineThickness = 4;
    this.lineColor = "#8499ce";

    // Define some strings to help keep track of the last directive of the player before he eliminates a enemy's piece
    this.lastPlayer1Note = "Place a Piece";
    this.lastPlayer2Note = "Place a Piece";

    // Define Gave Up variables
    this.player1GaveUp = false;
    this.player2GaveUp = false;

    // Get Give Up Buttons
    this.player1GiveUpButton = document.querySelector(".player1-resign-btn");
    this.player2GiveUpButton = document.querySelector(".player2-resign-btn");

    this.player1GiveUpButton.addEventListener("click", () => {
      if (
        !this.player1GaveUp &&
        !this.player2GaveUp &&
        !this.currentState.board.gameOver()
      ) {
        this.player1GaveUp = true;

        // Clean UI elements
        this.cleanUI();

        this.triggerWinnerContainer(2);
        console.log("PLAYER 1 GAVE UP");
      }
    });

    this.player2GiveUpButton.addEventListener("click", () => {
      if (
        !this.player1GaveUp &&
        !this.player2GaveUp &&
        !this.currentState.board.gameOver()
      ) {
        this.player2GaveUp = true;

        // Clean UI elements
        this.cleanUI();

        this.triggerWinnerContainer(1);
        console.log("PLAYER 2 GAVE UP");
      }
    });
  }

  generateBoard(numSquares) {
    // Clean current board
    this.boardContainer.innerHTML = "";

    // Define some board parameters
    const boardSize = 280;
    const boardCenter = boardSize / 2;
    const lineWidth = 10;

    // Generate the main squares
    const squareSizes = this.calculateSquareSizes(boardSize, numSquares);

    squareSizes.forEach((size) => {
      const square = this.createSquare(size, boardCenter);
      this.boardContainer.appendChild(square);
    });

    // Generate the Points and Lines
    this.generatePointsAndLines(squareSizes, boardCenter, this.pointSize);
  }

  generatePointsAndLines(squareSizes, boardCenter) {
    squareSizes.forEach((size, index) => {
      const half = size / 2;
      const offset = boardCenter - half;

      // Create Points
      const positions = [
        {
          x: offset - this.pointSize / 2 + this.lineThickness / 2,
          y: offset - this.pointSize / 2 + this.lineThickness / 2,
        }, // Upper left corner
        {
          x: boardCenter - this.pointSize / 2 - this.lineThickness / 2,
          y: offset - this.pointSize / 2 + this.lineThickness / 2,
        }, // Upper middle corner
        {
          x: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
          y: offset - this.pointSize / 2 + this.lineThickness / 2,
        }, // Upper right corner
        {
          x: offset - this.pointSize / 2 + this.lineThickness / 2,
          y: boardCenter - this.pointSize / 2,
        }, // Middle left point
        {
          x: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
          y: boardCenter - this.pointSize / 2,
        }, // Middle right point
        {
          x: offset - this.pointSize / 2 + this.lineThickness / 2,
          y: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
        }, // Lower left corner
        {
          x: boardCenter - this.pointSize / 2 + this.lineThickness / 2,
          y: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
        }, // Lower middle corner
        {
          x: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
          y: boardCenter + half - this.pointSize / 2 - this.lineThickness / 2,
        }, // Lower right corner
      ];

      // Add points to the board
      positions.forEach((pos, i) => {
        const point = document.createElement("div");
        point.classList.add("point");
        point.style.left = `${pos.x}px`;
        point.style.top = `${pos.y}px`;
        point.style.width = `${this.pointSize}px`;
        point.style.height = `${this.pointSize}px`;

        // Handle Point clicking
        point.addEventListener("click", function () {
          game.handlePointClick(point, 8 * index + i);
        });

        this.boardContainer.appendChild(point);
      });

      // Create additional outer lines
      if (index < squareSizes.length - 1) {
        // Making sure the lines only connect with adjacent points
        const nextSize = squareSizes[index + 1];
        const nextHalf = nextSize / 2;
        const nextOffset = boardCenter - nextHalf;

        // Vertical Segments
        this.drawLine(boardCenter, 0, boardCenter, offset + half / 2);
        this.drawLine(
          boardCenter,
          offset + 2 * half,
          boardCenter,
          nextOffset + half
        );

        // Horizontal Segments
        this.drawLine(
          0,
          boardCenter - this.lineThickness / 2,
          offset + half / 2,
          boardCenter - this.lineThickness / 2
        );
        this.drawLine(
          offset + 2 * half,
          boardCenter + this.lineThickness / 2,
          nextOffset + half,
          boardCenter + this.lineThickness / 2
        );
      }
    });
  }

  drawLine(x1, y1, x2, y2) {
    const line = document.createElement("div");
    line.classList.add("line");
    this.lineThickness = 4;

    // Calculate line length
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate line angle
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Define the line styling
    line.style.width = `${length}px`;
    line.style.height = `${this.lineThickness}px`;
    line.style.backgroundColor = this.lineColor;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = "0 0";
    line.style.position = "absolute";
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    // Add the line to the board container
    this.boardContainer.appendChild(line);
  }

  calculateSquareSizes(boardSize, numSquares) {
    // Create a array for the square sizes
    const squareSizes = [];

    // Define a proportional spacement between squares
    const step = boardSize / numSquares;

    // Calculate the squares width based on their quantity
    for (let i = 0; i < numSquares; i++) {
      // Creating the widths in order from the outer to inner square
      squareSizes.push(boardSize - i * step);
    }

    return squareSizes;
  }

  createSquare(size, boardCenter) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = `${size}px`;
    square.style.height = `${size}px`;
    square.style.left = `${boardCenter - size / 2}px`;
    square.style.top = `${boardCenter - size / 2}px`;
    return square;
  }

  generatePlayerPieces(numberOfPieces) {
    // Get both players pieces container
    var player1PiecesContainer = document.getElementById("player1-pieces");
    var player2PiecesContainer = document.getElementById("player2-pieces");

    // Loop to add multiple pieces
    for (let i = 1; i <= numberOfPieces; i++) {
      // Create a new pieces
      var newPiecePlayer1 = document.createElement("div");
      var newPiecePlayer2 = document.createElement("div");

      // Add the pieces
      player1PiecesContainer.appendChild(newPiecePlayer1);
      player2PiecesContainer.appendChild(newPiecePlayer2);
    }
  }

  highlightPossibleMoves(player, indexToHighlight) {
    // Highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and can only go to the adjacent positions
    if (this.game.currentState.board.gamePhase[player] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[indexToHighlight].forEach((pointIndex) => {
        // Checking for a valid and empty adjacent point in the current board configuration
        if (points[pointIndex] && points[pointIndex].classList.length === 1) {
          points[pointIndex].classList.add(`possible-move-player${player}`);
        }
      });
    } else {
      // We can Fly and therefore go into any available position
      points.forEach((point) => {
        if (point.classList.length === 1) {
          point.classList.add(`possible-move-player${player}`);
        }
      });
    }
  }

  removeHighlightPossibleMoves(player, indexToRemoveHighlight) {
    // Remove highlight possible moves
    // Query all elements with the class point
    const points = document.querySelectorAll(".point");

    // We are in a moving phase and could have only gone to the adjacent positions
    if (this.game.currentState.board.gamePhase[player] == "moving") {
      // Iterate through the adjacent points
      NEIGHBOR_TABLE[indexToRemoveHighlight].forEach((pointIndex) => {
        if (
          // Checking if we are not trying to access points from higher sided boards
          // [Since we are using a Adjacency list for all the different board sizes]
          points[pointIndex] &&
          points[pointIndex].classList.contains(`possible-move-player${player}`)
        ) {
          points[pointIndex].classList.remove(`possible-move-player${player}`);
        }
      });
    } else {
      // We could have fled and therefore we need to take into consideration the previously available positions
      points.forEach((point) => {
        point.classList.remove(`possible-move-player${player}`);
      });
    }
  }

  removeAllHighlightPossibleMoves(player) {
    // Fetch all the Points
    const points = document.querySelectorAll(`.point`);

    // Remove all the possible moves highlighting from the given player
    points.forEach((point) => {
      if (point.classList.contains(`possible-move-player${player}`)) {
        point.classList.remove(`possible-move-player${player}`);
      }
    });
  }

  highlightPossiblePieceRemovals(player) {
    // Get opponent
    const opponent = this.game.currentState.board.getOpponent(player);

    // Grab all the points that match the oponnents
    var oponnentPoints = document.querySelectorAll(`.point-player${opponent}`);

    // Iterate through the opponent points and adding a class to help the user know which points he can remove
    oponnentPoints.forEach((opponnentPoint) => {
      opponnentPoint.classList.add(`player${opponent}-removable-pieces`);
    });
  }

  removeHighlightPossiblePieceRemovals(player) {
    // Get opponent
    const opponent = this.game.currentState.board.getOpponent(player);

    // Grab all the points that match the oponnents
    var oponnentPoints = document.querySelectorAll(`.point-player${opponent}`);

    // Iterate through the opponent points and remove the previously added class
    oponnentPoints.forEach((opponnentPoint) => {
      opponnentPoint.classList.remove(`player${opponent}-removable-pieces`);
    });
  }

  addPlayerHighlight(player) {
    // Add current player highlight
    const currentPlayerInfo = document.querySelector(`.player${player}-info`);
    currentPlayerInfo.classList.add(`active-player${player}`);
  }

  removePlayerHighlight(player) {
    // Remove current player highlight
    const currentPlayerInfo = document.querySelector(`.player${player}-info`);
    currentPlayerInfo.classList.remove(`active-player${player}`);
  }

  switchPlayerHighlight(player) {
    // Updates the opponent - It's his turn
    this.addPlayerHighlight(3 - player);

    // The player's turn is over
    this.removePlayerHighlight(player);
  }

  informPlayer(player, message) {
    // Update the HTML text content for the player messages
    document.getElementById(`player${player}-notes`).textContent = message;
  }

  getPlayerLastMessage(player) {
    if (player === 1) {
      document.getElementById(`player${player}-notes`).textContent =
        this.lastPlayer1Note;
    } else {
      document.getElementById(`player${player}-notes`).textContent =
        this.lastPlayer2Note;
    }
  }

  updatePlayerLastMessage(player, newMessage) {
    if (player === 1) {
      this.lastPlayer1Note = newMessage;
    } else {
      this.lastPlayer2Note = newMessage;
    }
  }

  updatePlayerInfo(player, newPhase, newMessage) {
    // Update the HTML text content for the current phase
    document.getElementById(`player${player}-phase`).textContent = newPhase;

    // Update the HTML text content for the player messages
    document.getElementById(`player${player}-notes`).textContent = newMessage;

    // Update player Last Message
    this.updatePlayerLastMessage(player, newMessage);
  }

  usePiece(player) {
    // Select all the pieces from inside their container
    const pieces = document.querySelectorAll(`#player${player}-pieces > div`);

    // Loop through the pieces in order to hide the last one each time we place a new piece on the board
    for (let i = pieces.length - 1; i >= 0; i--) {
      if (!pieces[i].classList.contains("hidden-piece")) {
        pieces[i].classList.add("hidden-piece");
        return;
      }
    }
  }

  cleanUI() {
    // Remove pieces removal highlights
    this.removeHighlightPossiblePieceRemovals(1);
    this.removeHighlightPossiblePieceRemovals(2);

    // Remove Player Highlights
    this.removePlayerHighlight(1);
    this.removePlayerHighlight(2);

    // Remove Player Possible Moves
    this.removeAllHighlightPossibleMoves(1);
    this.removeAllHighlightPossibleMoves(2);
  }
}

const canvas = new Canvas();
