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

// Contact form (Formspree AJAX)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    formStatus.className = '';
    formStatus.textContent = '';

    try {
        const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
        });
        if (res.ok) {
            formStatus.textContent = '✅ 문의가 성공적으로 접수되었습니다. 감사합니다!';
            formStatus.className = 'success';
            contactForm.reset();
        } else {
            throw new Error();
        }
    } catch {
        formStatus.textContent = '❌ 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        formStatus.className = 'error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '문의 보내기';
    }
});
