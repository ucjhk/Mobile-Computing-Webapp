function Timer(){

    this.startTime = Date.now();

    this.start = function () {
        this.startTime = Date.now();
    }

    this.stop = function () {
        return ((Date.now() - this.startTime) / 1000).toFixed(1);
    }
}

const timer = new Timer();