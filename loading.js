// Generate stars dynamically for a more creative effect
const starsElement = document.querySelector('.stars');
const stars2Element = document.querySelector('.stars2');
const stars3Element = document.querySelector('.stars3');

function generateStars(element, amount) {
    let stars = '';
    for (let i = 0; i < amount; i++) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        const size = Math.random() * 2;
        stars += `${x}px ${y}px ${size}px #FFF,`;
    }
    element.style.boxShadow = stars.slice(0, -1); // Remove the last comma
}

generateStars(starsElement, 500);
generateStars(stars2Element, 300);
generateStars(stars3Element, 200);


function generateAsteroids(amount) {
    const space = document.querySelector('.space');
    for (let i = 0; i < amount; i++) {
        const asteroid = document.createElement('div');
        asteroid.classList.add('asteroid');
        asteroid.style.backgroundImage = "url('asteroid.png')"; // Ensure this is the correct path
        const size = Math.random() * 30 + 10; // Random size between 10px and 40px
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;
        
        // Initial position
        asteroid.style.top = `${Math.random() * 100}%`;
        asteroid.style.left = `${Math.random() * 100}%`;
        
        // Randomize the animation duration to change the speed
        const duration = Math.random() * 5 + 5; // Between 5 and 10 seconds
        
        // Randomize movement direction
        const moveX = (Math.random() - 0.5) * 200; // Value between -100vw and 100vw
        const moveY = (Math.random() - 0.5) * 200; // Value between -100vh and 100vh

        asteroid.style.animation = `moveAsteroid ${duration}s linear infinite, rotateAsteroid ${Math.random() * 2 + 1}s linear infinite`;
        
        space.appendChild(asteroid);

        // Apply keyframe animation directly to achieve random directions
        asteroid.animate([
            { transform: `translate(0, 0) rotate(0deg)` },
            { transform: `translate(${moveX}vw, ${moveY}vh) rotate(360deg)` }
        ], {
            duration: duration * 1000, // Convert to milliseconds
            iterations: Infinity
        });
    }
}


// Adding keyframes for asteroid movement and rotation in your CSS is needed
generateAsteroids(20); // Generate 20 asteroids

// Show motivational message before the boost
setTimeout(() => {
    document.querySelector('.message').style.opacity = 1;
}, 3000); // 4 seconds into the


const timeOut = 5000; // 5 seconds
const boostStart = 4500; // Start boost 500ms before redirecting
const redirectURL = 'landing.html'; // Replace with your URL

setTimeout(() => {
    const ship = document.querySelector('.ship');
    ship.classList.add('boosting');
}, boostStart);

setTimeout(() => {
    document.body.classList.add('body-fade-out');
    
    // Redirect after the animation ends, adjust timing if needed
    setTimeout(() => {
        window.location.href =redirectURL; // Adjust the path if necessary
    }, 1000); // Matches the duration of the fadeOut animation
}, 5000);