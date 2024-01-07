document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('motion-request-btn').addEventListener('click', requestMotion);
    document.getElementById('motion-request-btn').addEventListener('touchstart', requestMotion);


    function requestMotion() {
        // feature detect
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          DeviceMotionEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                window.addEventListener('devicemotion', handleMotion);
              }
            })
            .catch(console.error);
        }
      }

    if (Modernizr.devicemotion) {
        window.addEventListener('devicemotion', handleMotion);
    } else {
        // Device does not support accelerometer events
        console.log('Accelerometer not supported on this device.');
        document.getElementById('output').textContent = 'No support for deviceorientation';
    }

    function handleMotion(event) {
        document.getElementById('output').textContent = event.acceleration;
    }
});