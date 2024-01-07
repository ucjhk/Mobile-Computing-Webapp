function MotionHandler(){
    this.started = false;
    this.finished = false;
    this.motionTimer = new Timer();

    this.inMotion = function () {
        if(!this.finished){
            this.started = true;
            this.motionTimer.start();
        }
    }

    this.stop = function () {
        if(this.motionTimer.stop() > 2 || this.started){
            this.started = false;
            this.finished = true;
            return true;
        }
        else{
            return false;
        }
    }


}

const motionHandler = new MotionHandler();

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('motion-request-btn').addEventListener('click', requestMotion);
    document.getElementById('motion-request-btn').addEventListener('touchstart', requestMotion);


    function requestMotion() {
        // iOS 13+
        if(typeof DeviceMotionEvent.requestPermission === 'function'){
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleMotion, true);
                    }
                })
                .catch(console.error);
        }
    }

    if (Modernizr.devicemotion) {
        window.addEventListener('devicemotion', handleMotion, true);
    } else {
        // Device does not support accelerometer events
        console.log('Accelerometer not supported on this device.');
        document.getElementById('output').textContent = 'No support for deviceorientation';
    }

    function handleMotion(event) {
        //document.getElementById('output').textContent = event.acceleration.x;
        if(!motionHandler.finished){
            if(Math.abs(event.acceleration.x) > 2){
                document.getElementById('output').textContent = 'in motion';
                motionHandler.inMotion();
                shufflePieces();
            }
            else{
                if(motionHandler.stop()){
                    document.getElementById('output').textContent = 'stoped';
                    //toogleButton();
                }
            }
        }
    }
});