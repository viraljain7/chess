const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard")

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;


let renderBoard = () => {
    const socket = io();
    const chess = new Chess();
    const boardElement = document.querySelector(".chessboard");

    let draggedPiece = null;
    let sourceSquare = null;
    let playerRole = 'w'; // Set the player role (can be 'w' or 'b')

    let renderBoard = () => {
        const board = chess.board();
        boardElement.innerHTML = "";
        board.forEach((row, rowindex) => {
            row.forEach((square, squareindex) => {
                const squareElement = document.createElement("div");
                squareElement.classList.add("square", (rowindex + squareindex) % 2 === 0 ? "light" : "dark");
                squareElement.dataset.row = rowindex;
                squareElement.dataset.col = squareindex;

                if (square) {
                    const pieceElement = document.createElement("div");
                    pieceElement.classList.add("piece", square.color == 'w' ? "white" : "black");
                    pieceElement.innerHTML = getPieceUnicode(square.type, square.color);
                    pieceElement.draggable = playerRole === square.color;

                    pieceElement.addEventListener("dragstart", (e) => {
                        if (pieceElement.draggable) {
                            draggedPiece = pieceElement;
                            sourceSquare = { row: rowindex, col: squareindex };
                            e.dataTransfer.setData("text/plain", "");
                        }
                    });

                    pieceElement.addEventListener("dragend", (e) => {
                        draggedPiece = null;
                        sourceSquare = null;
                    });

                    squareElement.appendChild(pieceElement);
                }

                squareElement.addEventListener("dragover", (e) => {
                    e.preventDefault();
                });

                squareElement.addEventListener("drop", (e) => {
                    e.preventDefault();
                    if (draggedPiece) {
                        const targetSquare = {
                            row: parseInt(squareElement.dataset.row),
                            col: parseInt(squareElement.dataset.col),
                        };
                        handleMove(sourceSquare, targetSquare);
                    }
                });

                boardElement.appendChild(squareElement);
            });
        });
    };




}

let handleMove = (source, target) => {
    const sourceSquare = String.fromCharCode(97 + source.col) + (8 - source.row);
    const targetSquare = String.fromCharCode(97 + target.col) + (8 - target.row);

    const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // promote to a queen if applicable
    });

    if (move) {
        socket.emit('move', move);
        renderBoard();
    }
};

let getPieceUnicode = (type, color) => {
    const pieces = {
        p: '♟',
        r: '♜',
        n: '♞',
        b: '♝',
        q: '♛',
        k: '♚'
    };
    return color === 'w' ? pieces[type].toUpperCase() : pieces[type];
};

renderBoard();

socket.on('move', (move) => {
    chess.move(move);
    renderBoard();
});

socket.on('player-joined', (role) => {
    playerRole = role;
    renderBoard();
});
// socket.emit("churan")
// socket.on("new guy joined", () => {
//     console.log("new guy added");
// })