document.addEventListener('DOMContentLoaded', function() {
    const boardContainer = document.getElementById('board');
    const boardSizeInput = document.getElementById('board-size');
    const pointRadius = 14;
    const pointSize = 2 * pointRadius;

    function generateBoard(numSquares) {
        boardContainer.innerHTML = ''; // Limpar o tabuleiro atual

        // Define some board parameters
        const boardSize = 500;
        const boardCenter = boardSize / 2;
        const lineWidth = 10;

        // Generate the main squares
        const squareSizes = calculateSquareSizes(boardSize, numSquares);

        squareSizes.forEach(size => {
            const square = createSquare(size, boardCenter);
            boardContainer.appendChild(square);
        });

        // Generate the Points and Lines
        generatePointsAndLines(squareSizes, boardCenter, pointSize, lineWidth)
    }

    function generatePointsAndLines(squareSizes, boardCenter, pointSize, lineWidth) {
        squareSizes.forEach((size, index) => {
            const half = size / 2;
            const offset = boardCenter - half;
    
            // Create Points
            const positions = [
                { x: offset - pointSize / 2, y: offset - pointSize / 2 }, // Upper left corner
                { x: boardCenter - pointSize / 2, y: offset - pointSize / 2 }, // Upper middle corner
                { x: boardCenter + half - pointSize / 2, y: offset - pointSize / 2 }, // Upper right corner
                { x: offset - pointSize / 2, y: boardCenter - pointSize / 2 }, // Middle left point
                { x: boardCenter + half - pointSize / 2, y: boardCenter - pointSize / 2 }, // Middle right point
                { x: offset - pointSize / 2, y: boardCenter + half - pointSize / 2 }, // Lower left corner
                { x: boardCenter - pointSize / 2, y: boardCenter + half - pointSize / 2 }, // Lower middle corner
                { x: boardCenter + half - pointSize / 2, y: boardCenter + half - pointSize / 2 } // Lower righ corner
            ];
    
            // Add points to the board
            positions.forEach(pos => {
                const point = document.createElement('div');
                point.classList.add('point');
                point.style.left = `${pos.x}px`;
                point.style.top = `${pos.y}px`;
                point.style.width = `${pointSize}px`;
                point.style.height = `${pointSize}px`;
                boardContainer.appendChild(point);
            });
    
            // Create additional outer lines 
            if (index < squareSizes.length - 1) { // Making sure the lines only connect with adjacent points
                const nextSize = squareSizes[index + 1];
                const nextHalf = nextSize / 2;
                const nextOffset = boardCenter - nextHalf;
    
                // Vertical Segments
                drawLine(boardCenter, 0, boardCenter, offset + half/2); 
                drawLine(boardCenter, offset + 2*half, boardCenter, nextOffset + half);
                
                // Horizontal Segments
                drawLine(0, boardCenter, offset + half/2, boardCenter);
                drawLine(offset + 2*half, boardCenter, nextOffset + half, boardCenter);
            }
        });
    }
    
    function drawLine(x1, y1, x2, y2) {
        const line = document.createElement('div');
        line.classList.add('line');
        lineThickness = 4
        lineColor = '#fff'

        // Calculate line length
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
        // Calculate line angle
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
        // Define the line styling
        line.style.width = `${length}px`;
        line.style.height = `${lineThickness}px`;
        line.style.backgroundColor = lineColor;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 0';
        line.style.position = 'absolute';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
    
        // Add the line to the board container
        boardContainer.appendChild(line);
    }
    
    function calculateSquareSizes(boardSize, numSquares) {
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

    function createSquare(size, boardCenter) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;
        square.style.left = `${boardCenter - size / 2}px`;
        square.style.top = `${boardCenter - size / 2}px`; 
        return square;
    }

    // Load the board based on the previously selected board size
    generateBoard(boardSizeInput ? parseInt(boardSizeInput.value) : 3);

    // Update the board when its size gets updated
    if (boardSizeInput) {
        boardSizeInput.addEventListener('change', function() {
            generateBoard(parseInt(this.value));
        });
    }
});
