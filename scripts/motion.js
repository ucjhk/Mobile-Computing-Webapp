if (Modernizr.deviceorientation, Modernizr.devicemotion) {
    window.addEventListener('deviceorientation', handleOrientation, true);
} else {
    // Device does not support accelerometer events
    console.log('Accelerometer not supported on this device.');
    document.getElementById('output').textContent = 'No support for deviceorientation';
}

function handleOrientation(event) {
    document.getElementById('output').textContent = event.alpha + ', ' + event.beta + ', ' + event.gamma;
    // Access accelerometer data from the event object
    const alpha = event.alpha; // rotation around z-axis
    const beta = event.beta;   // rotation around x-axis
    const gamma = event.gamma; // rotation around y-axis

    // Do something with accelerometer data
    console.log('Alpha:', alpha, 'Beta:', beta, 'Gamma:', gamma);
}