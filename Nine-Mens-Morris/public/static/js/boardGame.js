class Canvas {
  constructor() {
    // Get the board container
    this.boardContainer = document.getElementById("board");

    // Define some variables related to the points
    this.pointRadius = 12;
    this.pointSize = 2 * this.pointRadius;
    this.lineThickness = 4;
    this.lineColor = "#8499ce";
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
}

const canvas = new Canvas();
