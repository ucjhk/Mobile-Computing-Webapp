function Timer(){

    this.startTime = Date.now();

    this.start = function () {
        startTime = Date.now();
    }

    this.stop = function () {
        return ((Date.now() - startTime) / 1000).toFixed(1);
    }
}

const timer = new Timer();