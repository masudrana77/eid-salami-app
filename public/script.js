// Generate Salami Function
async function generateSalami() {
  const userName = document.getElementById('userName').value.trim();
  if (!userName) {
    alert('দয়া করে আপনার নাম লিখুন!');
    return;
  }

  // Get IP
  let ip = 'অজানা';
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data.ip;
  } catch (error) {
    console.error('IP fetch error:', error);
  }

  // Generate random amount
  const amounts = [1000];
  const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

  // Save data
  const salamiData = {
    name: userName,
    ip: ip,
    amount: randomAmount,
    date: new Date().toLocaleString('bn-BD'),
  };

  localStorage.setItem('lastSalami', JSON.stringify(salamiData));
  updateAdminLogs(salamiData);

  // Display personalized result
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `🎊 <span style="color: #27ae60;">${userName}</span>, আপনি Raiyan ke salami diben Number 01705927524 Bkash, Nagad, Rocket. OR Rushir ammu ke boltechi Rushi amake diben🤣: <strong>${randomAmount}৳</strong>!`;

  // Show money image with pop animation
  const moneyImg = document.getElementById('moneyImg');
  moneyImg.src =
    noteImages[randomAmount] ||
    `https://via.placeholder.com/200x100?text=BDT+${randomAmount}৳`;
  moneyImg.style.display = 'block';
  moneyImg.classList.add('pop');

  startConfetti(); // বাটনে ক্লিক করলেই কনফেটি শুরু হবে
  playSound(); // বাটনে ক্লিক করলেই সাউন্ড প্লে হবে
}

// Update Admin Logs (Dashboard)
function updateAdminLogs(data) {
  let logs = JSON.parse(localStorage.getItem('salamiLogs') || '[]');
  logs.push(data);
  localStorage.setItem('salamiLogs', JSON.stringify(logs));
}

// কনফেটি এফেক্ট ফাংশন
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.y += p.d;
      if (p.y > canvas.height) p.y = 0;
    });
    confettiAnimation = requestAnimationFrame(draw);
  }

  draw();

  // ১২ সেকেন্ড পর কনফেটি বন্ধ হবে
  setTimeout(() => {
    cancelAnimationFrame(confettiAnimation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 12000);
}

// সাউন্ড প্লে ফাংশন
function playSound() {
  let audio = new Audio('music/eid_music.mp3'); // Ensure correct path
  audio.play();
}

// BDT note images
const noteImages = {
  10: 'Img/10.jpg',
  20: 'Img/20.png',
  50: 'Img/50.jpg',
  200: 'Img/200.png',
  100: 'Img/100.jpg',
  500: 'Img/500.jpg',
  1000: 'Img/1000.png',
};

// Simple Typing Animation
const messages = ['Raiyan..'];
let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;
const element = document.getElementById('typing');

function type() {
  const currentMsg = messages[msgIndex];

  if (isDeleting) {
    element.textContent = currentMsg.substring(0, charIndex - 1);
    charIndex--;
  } else {
    element.textContent = currentMsg.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentMsg.length) {
    isDeleting = true;
    setTimeout(type, 1500); // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    msgIndex = (msgIndex + 1) % messages.length;
    setTimeout(type, 500); // Pause between messages
  } else {
    setTimeout(type, isDeleting ? 50 : 100); // Typing speed
  }
}

// Start animation after 1 second
setTimeout(type, 1000);

async function saveLog(name, amount) {
  const logData = {
    name,
    amount,
    ip: await fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(data => data.ip),
    date: new Date().toISOString(),
  };

  await fetch('/.netlify/functions/salami', {
    method: 'POST',
    body: JSON.stringify(logData),
  });
}
