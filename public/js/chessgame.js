const socket = io();
// Initialize a new Chess.js game instance
const chess = new Chess();
// Select the chessboard element from the DOM
const chessboard = document.querySelector(".chessboard");

// Variables to keep track of dragged pieces, source squares, and player roles
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

/**
 * Renders the chessboard based on the current state of the chess game.
 * It clears the existing board and then creates square elements for each position,
 * assigning them 'light' or 'dark' classes for styling.
 * If a square contains a piece, it creates a piece element and assigns it
 * 'white' or 'black' class based on its color.
 */
const renderBoard = () => {
    // Get the current board state from the chess.js instance
    const board = chess.board();
    // Clear any existing content in the chessboard element
    chessboard.innerHTML = "";

    // Iterate over each row and square of the board
    board.forEach((row,rowindex) =>{
        row.forEach((square,squareindex) =>{
            // Create a new div element for each square
            const squareElement = document.createElement("div");
            // Add 'square' class and 'light' or 'dark' class based on its position
            squareElement.classList.add(
                "square",
                (rowindex + squareindex)%2 === 0 ? "light" : "dark"
            );
            // Store row and column data as dataset attributes
            squareElement.dataset.row = rowindex;
            squareElement.dataset.column = squareindex;

            // If there is a piece on the current square
            if(square){
                // Create a new div element for the piece
                const pieceElement = document.createElement("div");
                // Add 'piece' class and 'white' or 'black' class based on piece color
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerHTML = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart",(e) =>{
                    if (pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row:rowindex,column:squareindex};
                        e.dataTransfer.setData("text/plain","");
                    }
                });

                pieceElement.addEventListener("dragend",(e) =>{
                    if (draggedPiece === pieceElement){
                        draggedPiece = null;
                        sourceSquare = null;
                    }
                });

                // Append piece element to square
                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover",(e) =>{
                e.preventDefault();
            });

            squareElement.addEventListener("drop",(e) =>{
                e.preventDefault();
                if (draggedPiece){
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.column),
                    };
                    handleMove(sourceSquare,targetSource);
                }
            });
            chessboard.appendChild(squareElement);
        });
    });
    
};

/**
 * Handles a move on the chessboard.
 * Converts board coordinates to chess notation and attempts to make the move.
 */
const handleMove = (source, target) => {
    const sourceSquare = `${String.fromCharCode(97 + source.column)}${8 - source.row}`;
    const targetSquare = `${String.fromCharCode(97 + target.col)}${8 - target.row}`;
    
    const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
    };
    
    if (chess.move(move)) {
        renderBoard();
        socket.emit('move', move);
    } else {
        console.log('Invalid move');
    }
};

/**
 * Returns the Unicode character for a given chess piece.
 */
const getPieceUnicode = (piece) => {
    const unifiedPieces = {
        'p': '♙', 'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔'
    };
    return unifiedPieces[piece.type] || '';
};



// Socket event listeners
socket.on('playerRole', function(role) {
    playerRole = role;
    renderBoard();
});

socket.on('spectatorRole', function() {
    playerRole = null;
    renderBoard();
});

socket.on('boardState', function(fen) {
    chess.load(fen);
    renderBoard();
});

socket.on('move', function(move) {
    chess.move(move);
    renderBoard();
});

// Initial rendering of the chessboard when the script loads
renderBoard();
