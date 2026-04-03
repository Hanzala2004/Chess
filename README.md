CHESS
## Browser Compatibility

- Chrome/Chromium
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6 JavaScript

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Grid layout, flexbox, gradients, and animations
- **JavaScript (ES6)**: Object-oriented game logic with class-based architecture

## Code Structure

### ChessGame Class

The main class that manages the entire game:

- `constructor()`: Initializes the board and event listeners
- `initializeBoard()`: Sets up pieces in their starting positions
- `handleSquareClick()`: Processes user clicks on the board
- `updateValidMoves()`: Calculates legal moves for selected piece
- `makeMove()`: Executes a move and handles captures
- `render()`: Updates the visual board display
- `resetGame()`: Resets the game to initial state

### Movement Methods

- `getPawnMoves()`: Pawn movement logic
- `getRookMoves()`: Rook movement logic
- `getKnightMoves()`: Knight movement logic
- `getBishopMoves()`: Bishop movement logic
- `getQueenMoves()`: Queen movement logic
- `getKingMoves()`: King movement logic
- `getDirectionalMoves()`: Helper for sliding pieces (Rook, Bishop, Queen)

## Features in Development

Potential future enhancements:
- Check and Checkmate detection
- Castling move
- En passant capture
- Move undo/redo functionality
- Game save/load

