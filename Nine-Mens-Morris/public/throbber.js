const canvas = document.getElementById('throbber');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 15; // Radius of the main circle
const totalDots = 10; // Number of dots in the throbber
const dotRadius = 3; // Radius of each dot

let currentDot = 0; // Current active dot

const speedFactor = 6; // Adjust speed (higher values make it slower)
let frameCount = 0; // Frame counter

function drawThrobber() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < totalDots; i++) {
    // Calculate angle for each dot
    const angle = (i * Math.PI * 2) / totalDots;

    // Set dot position
    const dotX = centerX + Math.cos(angle) * radius;
    const dotY = centerY + Math.sin(angle) * radius;

    // Set color and transparency
    const alpha = i === currentDot ? 1 : 0.2; // Active dot is fully opaque
    ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;

    // Draw the dot
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Increment frame counter and update `currentDot` only after `speedFactor` frames
  frameCount++;
  if (frameCount >= speedFactor) {
    frameCount = 0;
    currentDot = (currentDot + 1) % totalDots;
  }

  // Repeat animation
  requestAnimationFrame(drawThrobber);
}

// Start the animation
drawThrobber();
