/* -----------------------------------------------------------------------------------
Timer that can be reseted and asked for the time
-------------------------------------------------------------------------------------*/
function Timer(){

    this.startTime = Date.now();

    // Function to reset the timer
    this.start = function () {
        this.startTime = Date.now();
    }

    // Function to get the time since the timer started
    this.stop = function () {
        return ((Date.now() - this.startTime) / 1000).toFixed(1);
    }
}

//timer for the puzzle
const timer = new Timer();