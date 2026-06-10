const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeToggle = document.getElementById('theme-toggle');

// Dark mode toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Lotto logic
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function getBallColor(number) {
    if (number <= 10) return '#f5a623';
    if (number <= 20) return '#4a90e2';
    if (number <= 30) return '#d0021b';
    if (number <= 40) return '#7ed321';
    return '#8b572a';
}

function displayNumbers(numbers) {
    lottoNumbersContainer.innerHTML = '';
    numbers.forEach((number, i) => {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;
        ball.style.backgroundColor = getBallColor(number);
        ball.style.animationDelay = `${i * 0.08}s`;
        lottoNumbersContainer.appendChild(ball);
    });
}

generateBtn.addEventListener('click', () => {
    displayNumbers(generateLottoNumbers());
});
