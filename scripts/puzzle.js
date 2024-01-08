var imageUrl = 'https://picsum.photos/300/300';

function shufflePieces(){
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

function toogleButton() {
    shufflePieces();
    startPuzzle();
}

function startPuzzle(){
    hideStart();
    timer.start();
    window.scrollTo(0, document.body.scrollHeight);
}

function getStart() {
    return document.getElementById('puzzle-start').children[0];
}

function hideStart() {
    getStart().style.visibility = 'hidden';
}

function showStart() {
    getStart().style.visibility = 'visible';
    motionHandler.finished = false;
    window.addEventListener('devicemotion', handleMotion, true);
}

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

    puzzlePieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
    });
}

function resetContainers(pieceSize){
    const puzzleContainer = document.getElementById('puzzle-container');
    const puzzleBoard = document.getElementById('puzzle-board');
    while (puzzleContainer.firstChild) {
        puzzleContainer.removeChild(puzzleContainer.firstChild);
    }
    while(puzzleBoard.firstChild){
        puzzleBoard.removeChild(puzzleBoard.firstChild);
    }
    createPuzzlePieces(pieceSize);
    showStart();
}

function changeSize(value){
    document.documentElement.style.setProperty('--js-piece-count', value);
    resetContainers(value);
}

function changeImage(value){
    if (value.files && value.files[0]) {
        imageUrl = URL.createObjectURL(value.files[0]);
        resetContainers(document.getElementById('select-number').value);
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
        puzzleSolved();
    }
}

function puzzleSolved(){
    showStart();
    time = timer.stop();
    console.log(time);
    resetContainers(document.getElementById('select-number').value);
    // Puzzle solved, display the success screen
    solvedScreen = document.getElementById('solved-screen');
    solvedScreen.querySelector('.time').textContent = "in "+ time.toString() + " seconds";
    solvedScreen.classList.remove('show');
    void solvedScreen.offsetWidth;
    solvedScreen.classList.add('show');
    //solvedScreen.style.display = 'block';
}

//TRigger setSupportstate nur beim
function handleMotion(event) {
    if(event.acceleration.x === null) setSupportState(false);
    else{
        if(!motionHandler.finished){
            if(Math.abs(event.acceleration.x) > 2){
                motionHandler.inMotion();
                shufflePieces();
            }
            else{
                if(motionHandler.stop()){
                    startPuzzle();
                }
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {

    // Event listener for drag over on the puzzle container
    document.getElementById('puzzle-container').addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    // Event listener for drop on the puzzle container
    document.getElementById('puzzle-container').addEventListener('drop', handleDrop);

    document.getElementById('image-input').addEventListener('change', (event) => changeImage(event.target));
    document.getElementById('image-input').addEventListener('touchstart', (event) => changeImage(event.target));

    document.getElementById('select-number').addEventListener('change', (event) => changeSize(event.target.value));
    document.getElementById('select-number').addEventListener('touchstart', (event) => changeSize(event.target.value));

    // Create puzzle pieces and drop targets on page load
    createPuzzlePieces();
});

