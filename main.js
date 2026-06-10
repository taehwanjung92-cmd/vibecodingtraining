const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

function displayNumbers(numbers) {
    lottoNumbersContainer.innerHTML = '';
    numbers.forEach(number => {
        const lottoBall = document.createElement('div');
        lottoBall.classList.add('lotto-ball');
        lottoBall.textContent = number;
        lottoBall.style.backgroundColor = getBallColor(number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

function getBallColor(number) {
    if (number <= 10) return '#f5a623'; // Yellow
    if (number <= 20) return '#4a90e2'; // Blue
    if (number <= 30) return '#d0021b'; // Red
    if (number <= 40) return '#7ed321'; // Green
    return '#8b572a'; // Brown
}

generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
});
