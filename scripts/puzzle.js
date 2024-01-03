document.addEventListener('DOMContentLoaded', function () {

    // Sample image URL
    imageUrl = 'https://picsum.photos/300/300';

    // Event listener for drag over on the puzzle container
    document.getElementById('puzzle-container').addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    // Event listener for drop on the puzzle container
    document.getElementById('puzzle-container').addEventListener('drop', handleDrop);

    document.getElementById('start-btn').addEventListener('click', toogleButton);
    document.getElementById('start-btn').addEventListener('touchstart', toogleButton);

    document.getElementById('shuffle-btn').addEventListener('click', shuffelPieces);
    document.getElementById('shuffle-btn').addEventListener('touchstart', shuffelPieces);

    document.getElementById('image-input').addEventListener('change', (event) => changeImage(event.target));
    document.getElementById('image-input').addEventListener('touchstart', (event) => changeImage(event.target));

    document.getElementById('select-number').addEventListener('change', (event) => changeSize(event.target.value));
    document.getElementById('select-number').addEventListener('touchstart', (event) => changeSize(event.target.value));

    // Create puzzle pieces and drop targets on page load
    createPuzzlePieces();

    // Function to create puzzle pieces
    function createPuzzlePieces(pieceSize = 9, boardSize = 300) {
        const puzzleContainer = document.getElementById('puzzle-container');
        const puzzleBoard = document.getElementById('puzzle-board');

        // Array to store puzzle pieces
        const puzzlePieces = [];

        // Create drop targets on the puzzle board
        for (let i = 0; i < pieceSize; i++) {
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

        for (let i = 0; i < pieceSize; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.pieceId = i.toString(); // Unique identifier for the puzzle piece
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundPosition = `-${(i % Math.sqrt(pieceSize)) * (boardSize / Math.sqrt(pieceSize))}px
             -${Math.floor(i / Math.sqrt(pieceSize)) * (boardSize / Math.sqrt(pieceSize))}px`;

            // Set the draggable attribute
            piece.draggable = false;

            // Event listener for drag start
            piece.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', i.toString());
            });

            puzzlePieces.push(piece);
        }

        /* // Shuffle puzzle pieces
        shuffleArray(puzzlePieces); */

        // Append shuffled pieces to the puzzle container
        puzzlePieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });
    }

    function toogleButton() {
        var button = document.getElementById('start-btn');
        button.style.visibility = 'hidden';
        shuffelPieces();
    }

    function showButton() {
        var button = document.getElementById('start-btn');
        button.style.visibility = 'visible';
    }

    function shuffelPieces(){
        const puzzleContainer = document.getElementById('puzzle-container');
        const puzzlePieces = puzzleContainer.querySelectorAll('.puzzle-piece');
        while (puzzleContainer.firstChild) {
            puzzleContainer.removeChild(puzzleContainer.firstChild);
        }
        shuffleArray(puzzlePieces).forEach(piece => {
            piece.draggable = true;
            puzzleContainer.appendChild(piece);
        });
    }

    function changeSize(value){
        resetContainers();
        document.documentElement.style.setProperty('--js-piece-count', value);
        createPuzzlePieces(value);
    }

    function changeImage(value){
        if (value.files && value.files[0]) {
            resetContainers();
            console.log(value);
            imageUrl = URL.createObjectURL(value.files[0]);
            createPuzzlePieces(document.getElementById('select-number').value);
        }
    }

    // Function to handle drop event on puzzle pieces
    function handleDrop(event) {
        event.preventDefault();

        const pieceIndex = event.dataTransfer.getData('text/plain');
        const draggedPiece = document.querySelector(`.puzzle-piece[data-piece-id="${pieceIndex}"]`);
        const puzzleContainer = document.getElementById('puzzle-container');

        if(!draggedPiece.draggable) return;

        // Check if the drop area is occupied
        if (event.target.classList.contains('drop-target')) {
            // Append the dragged piece to the drop target
            event.target.appendChild(draggedPiece);
        } else {
            // DraggedPiece already in drop target
            parent = event.target.parentElement;
            if(draggedPiece.parentElement.classList.contains('drop-target') && parent.classList.contains('drop-target')){
                draggedPieceParent = draggedPiece.parentElement;
                parent.appendChild(draggedPiece);
                draggedPieceParent.appendChild(event.target);
            }
            // Drop area is occupied, return the piece to the selection box
            else{
                puzzleContainer.appendChild(event.target);
                parent.appendChild(draggedPiece);
            }
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
            showButton();
            resetContainers();
            createPuzzlePieces(document.getElementById('select-number').value);
            // Puzzle solved, display the success screen
            solvedScreen = document.getElementById('solved-screen');
            solvedScreen.classList.remove('show');
            void solvedScreen.offsetWidth;
            solvedScreen.classList.add('show');
            //solvedScreen.style.display = 'block';
        }
    }

    // Function to shuffle array elements (Fisher-Yates algorithm)
    function shuffleArray(array) {
        let shuffledArray = Array.from(array);
    
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
    
        return shuffledArray;
    }   

    function resetContainers(){
        const puzzleContainer = document.getElementById('puzzle-container');
        const puzzleBoard = document.getElementById('puzzle-board');
        while (puzzleContainer.firstChild) {
            puzzleContainer.removeChild(puzzleContainer.firstChild);
        }
        while(puzzleBoard.firstChild){
            puzzleBoard.removeChild(puzzleBoard.firstChild);
        }
    }
});

