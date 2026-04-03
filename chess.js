class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.selectedSquare = null;
        this.validMoves = [];
        this.whiteToMove = true;
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.initializeEventListeners();
        this.render();
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'P', color: 'black' };
            board[6][i] = { type: 'P', color: 'white' };
        }

        // Set up other pieces
        const setup = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: setup[i], color: 'black' };
            board[7][i] = { type: setup[i], color: 'white' };
        }

        return board;
    }

    initializeEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => this.handleSquareClick(e));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }

    handleSquareClick(e) {
        const square = e.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (this.selectedSquare) {
            const [selectedRow, selectedCol] = this.selectedSquare;
            
            if (row === selectedRow && col === selectedCol) {
                this.selectedSquare = null;
                this.validMoves = [];
                this.render();
                return;
            }

            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                this.makeMove(selectedRow, selectedCol, row, col);
                this.selectedSquare = null;
                this.validMoves = [];
                this.whiteToMove = !this.whiteToMove;
            } else {
                this.selectedSquare = [row, col];
                this.updateValidMoves(row, col);
            }
        } else {
            const piece = this.board[row][col];
            if (piece && ((this.whiteToMove && piece.color === 'white') || (!this.whiteToMove && piece.color === 'black'))) {
                this.selectedSquare = [row, col];
                this.updateValidMoves(row, col);
            }
        }

        this.render();
    }

    updateValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) {
            this.validMoves = [];
            return;
        }

        this.validMoves = [];
        const type = piece.type;

        if (type === 'P') this.getPawnMoves(row, col, this.validMoves);
        else if (type === 'R') this.getRookMoves(row, col, this.validMoves);
        else if (type === 'N') this.getKnightMoves(row, col, this.validMoves);
        else if (type === 'B') this.getBishopMoves(row, col, this.validMoves);
        else if (type === 'Q') this.getQueenMoves(row, col, this.validMoves);
        else if (type === 'K') this.getKingMoves(row, col, this.validMoves);
    }

    getPawnMoves(row, col, moves) {
        const piece = this.board[row][col];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

        // Move forward
        const newRow = row + direction;
        if (newRow >= 0 && newRow < 8 && !this.board[newRow][col]) {
            moves.push([newRow, col]);

            // Double move from start
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Capture diagonally
        for (let newCol of [col - 1, col + 1]) {
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = this.board[newRow][newCol];
                if (targetPiece && targetPiece.color !== piece.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }
    }

    getRookMoves(row, col, moves) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        this.getDirectionalMoves(row, col, directions, moves);
    }

    getBishopMoves(row, col, moves) {
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        this.getDirectionalMoves(row, col, directions, moves);
    }

    getQueenMoves(row, col, moves) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        this.getDirectionalMoves(row, col, directions, moves);
    }

    getDirectionalMoves(row, col, directions, moves) {
        const piece = this.board[row][col];

        for (const [dRow, dCol] of directions) {
            let newRow = row + dRow;
            let newCol = col + dCol;

            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = this.board[newRow][newCol];

                if (!targetPiece) {
                    moves.push([newRow, newCol]);
                } else {
                    if (targetPiece.color !== piece.color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }

                newRow += dRow;
                newCol += dCol;
            }
        }
    }

    getKnightMoves(row, col, moves) {
        const piece = this.board[row][col];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dRow, dCol] of knightMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }
    }

    getKingMoves(row, col, moves) {
        const piece = this.board[row][col];
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dRow, dCol] of kingMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        return this.validMoves.some(([r, c]) => r === toRow && c === toCol);
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];

        if (targetPiece) {
            this.capturedPieces[targetPiece.color === 'white' ? 'white' : 'black'].push(targetPiece.type);
            this.updateCapturedDisplay();
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Pawn promotion
        if (piece.type === 'P' && (toRow === 0 || toRow === 7)) {
            piece.type = 'Q';
        }

        this.moveHistory.push({ from: [fromRow, fromCol], to: [toRow, toCol], piece });
    }

    updateCapturedDisplay() {
        const getPieceSymbol = (type) => {
            const symbols = { 'P': '♟', 'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚' };
            return symbols[type] || '';
        };

        document.getElementById('capturedWhite').textContent = this.capturedPieces.white.map(getPieceSymbol).join(' ');
        document.getElementById('capturedBlack').textContent = this.capturedPieces.black.map(getPieceSymbol).join(' ');
    }

    render() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        const pieceSymbols = {
            'P': { white: '♙', black: '♟' },
            'R': { white: '♖', black: '♜' },
            'N': { white: '♘', black: '♞' },
            'B': { white: '♗', black: '♝' },
            'Q': { white: '♕', black: '♛' },
            'K': { white: '♔', black: '♚' }
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                if (this.selectedSquare && this.selectedSquare[0] === row && this.selectedSquare[1] === col) {
                    square.classList.add('selected');
                }

                if (this.validMoves.some(([r, c]) => r === row && c === col)) {
                    square.classList.add(this.board[row][col] ? 'capture' : 'valid-move');
                }

                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = pieceSymbols[piece.type][piece.color];
                }

                boardElement.appendChild(square);
            }
        }

        document.getElementById('turn').textContent = `Turn: ${this.whiteToMove ? 'White' : 'Black'}`;
    }

    resetGame() {
        this.board = this.initializeBoard();
        this.selectedSquare = null;
        this.validMoves = [];
        this.whiteToMove = true;
        this.capturedPieces = { white: [], black: [] };
        this.moveHistory = [];
        this.updateCapturedDisplay();
        this.render();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
