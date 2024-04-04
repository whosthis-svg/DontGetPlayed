document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = 100; // Number of stars
    const starArray = [];

    // Initialize star positions and velocities
    for (let i = 0; i < stars; i++) {
        starArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            vel: Math.random() * 0.5 + 0.5
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        starArray.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Update star position
            star.x += star.vel;
            if (star.x > canvas.width) {
                star.x = 0;
                star.y = Math.random() * canvas.height;
            }
        });
    }

    function animate() {
        drawStars();
        requestAnimationFrame(animate);
    }

    animate();
    const options = document.querySelectorAll('.option');

    options.forEach(option => {
        option.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;

            // Calculate the percentage of the mouse position within the element
            const xPos = (offsetX / clientWidth) * 100;
            const yPos = (offsetY / clientHeight) * 100;

            // Invert the position for the panning effect
            // The '50' is the center position; the 'xPos - 50' and 'yPos - 50' calculate the distance from the center
            const xPan = 50 - (xPos - 50);
            const yPan = 50 - (yPos - 50);

            // Apply the inverted positions to the background-position property
            target.style.backgroundPosition = `${xPan}% ${yPan}%`;
        });

        option.addEventListener('mouseleave', (e) => {
            // Reset the background position
            e.target.style.backgroundPosition = 'center';
        });
    });
    const changeHeaderAndUlBackground = (headerColor, ulColor) => {
        document.querySelector('header').style.backgroundImage = `linear-gradient(${headerColor}, rgba(0, 0, 0, 0))`;
        document.querySelector('ul').style.backgroundColor = ulColor;
    };

    const resetBackgrounds = () => {
        document.querySelector('header').style.backgroundImage = ''; // Reset to original gradient
        document.querySelector('ul').style.backgroundColor = ''; // Reset to original color
    };

    document.querySelector('#solo-journey').addEventListener('mouseenter', () => changeHeaderAndUlBackground('rgba(242, 158, 11, 0.1)', 'rgba(242, 158, 11, 0.1)'));
    document.querySelector('#solo-journey').addEventListener('mouseleave', resetBackgrounds);

    document.querySelector('#journey-friends').addEventListener('mouseenter', () => changeHeaderAndUlBackground('rgba(242, 11, 91, 0.1)', 'rgba(242, 11, 91, 0.1)'));
    document.querySelector('#journey-friends').addEventListener('mouseleave', resetBackgrounds);

    document.querySelector('#journey-info').addEventListener('mouseenter', () => changeHeaderAndUlBackground('rgba(120, 166, 252, 0.1)', 'rgba(120, 166, 252, 0.1)'));
    document.querySelector('#journey-info').addEventListener('mouseleave', resetBackgrounds);
});
