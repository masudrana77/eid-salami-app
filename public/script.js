// Generate Salami Function (Updated with better error handling and storage)
async function generateSalami() {
  const userName = document.getElementById('userName').value.trim();
  if (!userName) {
    alert('দয়া করে আপনার নাম লিখুন!');
    return;
  }

  try {
    // Get IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip || 'অজানা'; 

    // Generate random amount
    const amounts = [10, 20, 50, 100, 200, 500, 1000];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

    // Prepare and save data
    const salamiData = {
      name: userName,
      ip: ip,
      amount: randomAmount,
      date: new Date().toLocaleString('bn-BD')
    };

    // Save to localStorage
    localStorage.setItem('lastSalami', JSON.stringify(salamiData));
    
    // Update admin logs
    const logs = JSON.parse(localStorage.getItem('salamiLogs') || []);
    logs.push(salamiData);
    localStorage.setItem('salamiLogs', JSON.stringify(logs));
    
    // Trigger storage event for admin dashboard
    window.dispatchEvent(new Event('storage'));

    // Display result
    showResult(userName, randomAmount);
    showMoneyImage(randomAmount);
    startConfetti();
    playSound();

  } catch (error) {
    console.error('Error in generateSalami:', error);
    alert('সালামি জেনারেট করতে সমস্যা হয়েছে!');
  }
}

// Display result function
function showResult(name, amount) {
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `🎊 <span style="color: #27ae60;">${name}</span>, আপনি পেলেন: <strong>${amount}৳</strong>!`;
}

// Show money image function
function showMoneyImage(amount) {
  const moneyImg = document.getElementById('moneyImg');
  moneyImg.src = noteImages[amount] || `https://via.placeholder.com/200x100?text=BDT+${amount}৳`;
  moneyImg.style.display = 'block';
  moneyImg.classList.add('pop');
}

// Confetti effect (unchanged)
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

  setTimeout(() => {
    cancelAnimationFrame(confettiAnimation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 12000);
}

// Sound play function (unchanged)
function playSound() {
  let audio = new Audio('music/eid_music.mp3');
  audio.play().catch(e => console.log('Audio play failed:', e));
}

// BDT note images (unchanged)
const noteImages = {
  10: 'Img/10.jpg',
  20: 'Img/20.png',
  50: 'Img/50.jpg',
  200: 'Img/200.png',
  100: 'Img/100.jpg',
  500: 'Img/500.jpg',
  1000: 'Img/1000.png'
};

// Typing animation (unchanged)
const messages = ['Raiyan..'];
let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;
const element = document.getElementById('typing');

function type() {
  const currentMsg = messages[msgIndex];
  element.textContent = isDeleting 
    ? currentMsg.substring(0, charIndex - 1)
    : currentMsg.substring(0, charIndex + 1);
  
  isDeleting ? charIndex-- : charIndex++;
  
  if (!isDeleting && charIndex === currentMsg.length) {
    isDeleting = true;
    setTimeout(type, 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    msgIndex = (msgIndex + 1) % messages.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, isDeleting ? 50 : 100);
  }
}

// Initialize
setTimeout(type, 1000);
