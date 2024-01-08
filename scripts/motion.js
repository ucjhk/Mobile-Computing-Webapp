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
        if(this.motionTimer.stop() > 1 && this.started){
            this.started = false;
            this.finished = true;
            return true;
        }
        else{
            return false;
        }
    }
}

function setSupportState(supports){
    //console.log(supports);
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

function createStartButton(){
    deleteStartButton();
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
    deleteStartText();
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

function checkAcceleration(event){
    if(event.acceleration.x === null) setSupportState(false);
}

const motionHandler = new MotionHandler();

document.addEventListener('DOMContentLoaded', function () {

    console.log(Modernizr.devicemotion)

    document.getElementById('overlay').children[1].addEventListener('change', (event) => requestMotion(event.target.value));


    function requestMotion(newValue) {
        document.getElementById('overlay').style.visibility = 'hidden';
        document.getElementById('select-number').value = newValue;
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
});