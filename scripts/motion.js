/* -----------------------------------------------------------------------------------
Handles the motion of the device
-------------------------------------------------------------------------------------*/

function MotionHandler(){
    this.started = false;
    this.finished = false;
    this.motionTimer = new Timer();

    // Function to handle when device is in motion
    this.inMotion = function () {
        if(!this.finished){
            this.started = true;
            this.motionTimer.start();
        }
    }

    // Function to handle when device is not in motion
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

const motionHandler = new MotionHandler();

/* -----------------------------------------------------------------------------------
Functions to handle the motion of the device
-------------------------------------------------------------------------------------*/

//Set if the device supports motion
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

function checkAcceleration(event){
    if(event.acceleration.x === null) setSupportState(false);
}

/* -----------------------------------------------------------------------------------
Functions to handle the start of the puzzle
-------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------
When everything is loaded
-------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {

    // Add event listener to the select number
    document.getElementById('overlay').children[1].addEventListener('change', (event) => hideOverlay(event.target.value));
    document.getElementById('overlay').children[1].addEventListener('click',requestMotion);
    document.getElementById('overlay').children[1].addEventListener('touchstart',requestMotion);

    function hideOverlay(newValue){
        document.getElementById('select-number').value = newValue;
        document.getElementById('overlay').style.visibility = 'hidden';
    }

    // Check if the browser supports motion
    setSupportState(Modernizr.devicemotion);

    //request permission for motion for ios 13+
    function requestMotion() {
        // iOS 13+
        if(typeof DeviceMotionEvent.requestPermission === 'function'){
            try{
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    setSupportState(permissionState === 'granted');
                })
                .catch(console.error);
            }
            catch(e){
                setSupportState(false);
            }
        }
    }
});