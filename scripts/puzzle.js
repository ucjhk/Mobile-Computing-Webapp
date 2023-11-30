document.addEventListener('DOMContentLoaded', function () {
    // Your JavaScript code here

    // Sample image URL
    const imageUrl = 'https://placekitten.com/300/300';

    // Function to create puzzle pieces
    function createPuzzlePieces() {
        const puzzleContainer = document.getElementById('puzzle-container');
        const puzzleBoard = document.getElementById('puzzle-board');

        // Array to store puzzle pieces
        const puzzlePieces = [];

        // Create drop targets on the puzzle board
        for (let i = 0; i < 9; i++) {
            const dropTarget = document.createElement('div');
            dropTarget.classList.add('drop-target');
            dropTarget.dataset.targetId = i.toString(); // Unique identifier for the drop target
            puzzleBoard.appendChild(dropTarget);

            // Event listener for drag over on the drop target
            dropTarget.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            // Event listener for drop on the drop target
            dropTarget.addEventListener('drop', handleDrop);
        }

        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.pieceId = i.toString(); // Unique identifier for the puzzle piece
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundPosition = `-${i % 3 * 100}px -${Math.floor(i / 3) * 100}px`;

            // Set the draggable attribute
            piece.draggable = true;

            // Event listener for drag start
            piece.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', i.toString());
            });

            puzzlePieces.push(piece);
        }

        // Shuffle puzzle pieces
        shuffleArray(puzzlePieces);

        // Append shuffled pieces to the puzzle container
        puzzlePieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });
    }

    // Function to handle drop event on puzzle pieces
    function handleDrop(event) {
        event.preventDefault();

        const pieceIndex = event.dataTransfer.getData('text/plain');
        const draggedPiece = document.querySelector(`.puzzle-piece[data-piece-id="${pieceIndex}"]`);

        // Check if the drop area is occupied
        if (event.target.childElementCount === 0) {
            // Append the dragged piece to the drop target
            event.target.appendChild(draggedPiece);
        } else {
            // Drop area is occupied, return the piece to the selection box
            event.target.appendChild(draggedPiece);
            draggedPiece.style.top = '0';
            draggedPiece.style.left = '0';
            draggedPiece.classList.add('selected-piece');
        }

        // Check if the puzzle is solved
        checkPuzzleSolved();
    }

    // Function to check if the puzzle is solved
    function checkPuzzleSolved() {
        const puzzleBoard = document.getElementById('puzzle-board');
        const dropTargets = puzzleBoard.querySelectorAll('.drop-target');

        // Check if all drop targets have the correct puzzle piece
        const isSolved = Array.from(dropTargets).every(target => {
            const piece = target.firstElementChild;
            if (piece) {
                return piece.dataset.pieceId === target.dataset.targetId;
            }
            return false;
        });

        if (isSolved) {
            // Puzzle solved, display the success screen
            document.getElementById('solved-screen').style.display = 'block';
        }
    }

    // Event listener for drag over on the puzzle container
    document.getElementById('puzzle-container').addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    // Event listener for drop on the puzzle container
    document.getElementById('puzzle-container').addEventListener('drop', handleDrop);

    // Create puzzle pieces and drop targets on page load
    createPuzzlePieces();

    // Function to shuffle array elements (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});

