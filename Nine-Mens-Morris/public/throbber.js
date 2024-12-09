const throbber = document.getElementById("throbber");
const ctx = throbber.getContext("2d");

const background = document.getElementById("throbber-bg");

// Define throbber resolution
const width = throbber.parentElement.clientWidth; //1050; // Visible width in CSS pixels
const height = throbber.parentElement.clientHeight; //550; // Visible height in CSS pixels
const scale = window.devicePixelRatio || 1; // Adjust for high-DPI displays

// Scale the throbber for higher resolution
throbber.width = width * scale;
throbber.height = height * scale;
// throbber.style.width = `${width}px`;
// throbber.style.height = `${height}px`;
ctx.scale(scale, scale);

const centerX = width / 2;
const centerY = height / 2;
const radius = 40; // Radius of the main circle
const totalDots = 10; // Number of dots in the throbber
const dotRadius = 8; // Radius of each dot

let currentDot = 0; // Current active dot

const speedFactor = 8; // Adjust speed (higher values make it slower)
let frameCount = 0; // Frame counter

function drawThrobber() {
  ctx.clearRect(0, 0, width, height); // Clear based on CSS size

  for (let i = 0; i < totalDots; i++) {
    // Calculate angle for each dot
    const angle = (i * Math.PI * 2) / totalDots;

    // Set dot position
    const dotX = centerX + Math.cos(angle) * radius;
    const dotY = centerY + Math.sin(angle) * radius;

    // Set color and transparency
    const alpha = i === currentDot ? 1 : 0.2; // Active dot is fully opaque
    ctx.fillStyle = `rgba(150, 200, 255, ${alpha})`;

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
