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
                // TODO: Add piece symbol (e.g., Unicode character) to pieceElement
                // TODO: Append pieceElement to squareElement
            }
            // TODO: Append squareElement to chessboard
        });
    });
};

/**
 * Handles a move on the chessboard.
 * (Currently an empty placeholder function)
 */
const handleMove = () => {};

/**
 * Returns the Unicode character for a given chess piece.
 * (Currently an empty placeholder function)
 */
const getPieceUnicode = () =>{};

// Initial rendering of the chessboard when the script loads
renderBoard();