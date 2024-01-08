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
        if(this.motionTimer.stop() > 2 && this.started){
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

    function setSupportState(supports){
        if(supports){
            createStartText();
            deleteStartButton();
            window.addEventListener('devicemotion', handleMotion, true);
        }
        else{
            createStartButton();
            deleteStartText();

            window.removeEventListener('devicemotion', handleMotion, true);
        }
    }

    function startListening(){
        motionHandler.finished = false;
        window.addEventListener('devicemotion', handleMotion, true);
    }

    if(document.getElementById('solved-screen').classList.contains('show')){
        if(motionHandler.finished){
            startListening();
        }
    }

    function createStartButton(){
        var newButton = document.createElement('button');

        // Assign a CSS class to the button
        newButton.id = 'start-btn';
        document.getElementById('puzzle-start').appendChild(newButton);
        icon = document.createElement('i');
        icon.classList.add('fa', 'fa-play');
        newButton.appendChild(icon);
        newButton.addEventListener('click', toogleButton);
        newButton.addEventListener('touchstart', toogleButton);
        
    }

    function deleteStartButton(){
        if(document.getElementById('start-btn') != null){
            var button = document.getElementById('start-btn');
            button.parentNode.removeChild(button);
        }
    }

    function createStartText(){
        var text = document.createElement('p');

        // Assign a CSS class to the button
        text.id = 'start-txt';
        text.innerHTML = 'Shake your phone to start';
        document.getElementById('puzzle-start').appendChild(text);
    }

    function deleteStartText(){
        if(document.getElementById('start-txt') != null){
            var text = document.getElementById('start-txt');
            text.parentNode.removeChild(text);
        }
    }

    function requestMotion() {
        // iOS 13+
        if(typeof DeviceMotionEvent.requestPermission === 'function'){
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    setSupportState(permissionState === 'granted');
                })
                .catch(console.error);
        }
    }

    setSupportState(Modernizr.devicemotion);

    function handleMotion(event) {
        if(event.acceleration.x === null) setSupportState(false);
        if(!motionHandler.finished){
            if(Math.abs(event.acceleration.x) > 2){
                console.log('in motion'+ event.acceleration.x);
                motionHandler.inMotion();
                shufflePieces();
            }
            else{
                console.log('not in motion');
                if(motionHandler.stop()){
                    startPuzzle();
                }
            }
        }
    }
});