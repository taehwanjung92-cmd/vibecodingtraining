// ── Theme toggle (all pages) ───────────────────────────
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ── Shared helpers ─────────────────────────────────────
function getBallColor(n) {
  if (n <= 10) return '#f5a623';
  if (n <= 20) return '#4a90e2';
  if (n <= 30) return '#d0021b';
  if (n <= 40) return '#7ed321';
  return '#8b572a';
}

function renderBalls(container, numbers) {
  container.innerHTML = '';
  numbers.forEach((n, i) => {
    const ball = document.createElement('div');
    ball.classList.add('lotto-ball');
    ball.textContent = n;
    ball.style.backgroundColor = getBallColor(n);
    ball.style.animationDelay = `${i * 0.08}s`;
    container.appendChild(ball);
  });
}

function generateRandom() {
  const nums = new Set();
  while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
  return Array.from(nums).sort((a, b) => a - b);
}

// ── Lotto tool (index page) ────────────────────────────
const generateBtn = document.getElementById('generate-btn');
if (generateBtn) {
  const container = document.querySelector('.lotto-numbers');

  function renderHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    if (!history.length) {
      list.innerHTML = '<li class="history-empty">아직 추첨 기록이 없습니다. 번호를 추첨해보세요!</li>';
      return;
    }
    list.innerHTML = history.map((e, i) => `
      <li class="history-item">
        <span class="history-no">${i + 1}회</span>
        <span class="history-date">${e.date}</span>
        <span class="history-numbers">
          ${e.numbers.map(n => `<span class="history-ball" style="background:${getBallColor(n)}">${n}</span>`).join('')}
        </span>
      </li>`).join('');
  }

  function saveHistory(numbers) {
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    history.unshift({ numbers, date: new Date().toLocaleDateString('ko-KR') });
    if (history.length > 5) history.pop();
    localStorage.setItem('lottoHistory', JSON.stringify(history));
    renderHistory();
  }

  renderHistory();
  generateBtn.addEventListener('click', () => {
    const nums = generateRandom();
    renderBalls(container, nums);
    saveHistory(nums);
  });
}

// ── Contact form (index page) ──────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formStatus = document.getElementById('form-status');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = '전송 중...';
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
      } else throw new Error();
    } catch {
      formStatus.textContent = '❌ 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      formStatus.className = 'error';
    } finally {
      btn.disabled = false;
      btn.textContent = '문의 보내기';
    }
  });
}

// ── FAQ accordion (index + strategy pages) ────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const answer = btn.nextElementSibling;
    answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
  });
});

// ── Strategy page tools ────────────────────────────────
const analyzeBtn = document.getElementById('analyze-btn');
if (analyzeBtn) {
  analyzeBtn.addEventListener('click', () => {
    const inputs = Array.from(document.querySelectorAll('.num-input'));
    const vals = inputs.map(i => parseInt(i.value, 10));

    if (vals.some(v => isNaN(v) || v < 1 || v > 45)) {
      alert('1~45 사이의 숫자를 6개 모두 입력해주세요.');
      return;
    }
    if (new Set(vals).size !== 6) {
      alert('중복 없이 6개의 서로 다른 숫자를 입력해주세요.');
      return;
    }

    const sorted = [...vals].sort((a, b) => a - b);
    showAnalysis(sorted, document.getElementById('analysis-result'));
  });

  document.querySelectorAll('.num-input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') analyzeBtn.click();
    });
  });
}

function analyzeNumbers(nums) {
  const odd = nums.filter(n => n % 2 !== 0).length;
  const even = nums.length - odd;
  const sum = nums.reduce((a, b) => a + b, 0);
  const zones = {
    '1~9':   nums.filter(n => n >= 1  && n <= 9).length,
    '10~19': nums.filter(n => n >= 10 && n <= 19).length,
    '20~29': nums.filter(n => n >= 20 && n <= 29).length,
    '30~39': nums.filter(n => n >= 30 && n <= 39).length,
    '40~45': nums.filter(n => n >= 40 && n <= 45).length,
  };
  let consec = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] === 1) consec++;
  }
  return { odd, even, sum, zones, consec };
}

function showAnalysis(nums, container) {
  const { odd, even, sum, zones, consec } = analyzeNumbers(nums);
  container.hidden = false;

  document.getElementById('res-odd-even').textContent = `${odd}홀 ${even}짝`;
  const oeRating = document.getElementById('res-odd-even-rating');
  if ((odd === 3 && even === 3) || (odd === 4 && even === 2) || (odd === 2 && even === 4)) {
    oeRating.textContent = '✅ 좋음'; oeRating.className = 'result-rating rating-good';
  } else if (odd === 5 || even === 5) {
    oeRating.textContent = '⚠️ 편중'; oeRating.className = 'result-rating rating-ok';
  } else {
    oeRating.textContent = '❌ 극단적 편중'; oeRating.className = 'result-rating rating-check';
  }

  document.getElementById('res-sum').textContent = sum;
  const sumRating = document.getElementById('res-sum-rating');
  if (sum >= 100 && sum <= 175) {
    sumRating.textContent = '✅ 이상적 범위'; sumRating.className = 'result-rating rating-good';
  } else if (sum >= 80 && sum <= 200) {
    sumRating.textContent = '⚠️ 보통 범위'; sumRating.className = 'result-rating rating-ok';
  } else {
    sumRating.textContent = '❌ 극단적 합계'; sumRating.className = 'result-rating rating-check';
  }

  document.getElementById('res-consec').textContent = `${consec}쌍`;
  const cRating = document.getElementById('res-consec-rating');
  if (consec === 1 || consec === 2) {
    cRating.textContent = '✅ 자연스러움'; cRating.className = 'result-rating rating-good';
  } else if (consec === 0) {
    cRating.textContent = '⚠️ 연속 없음'; cRating.className = 'result-rating rating-ok';
  } else {
    cRating.textContent = '⚠️ 연속 많음'; cRating.className = 'result-rating rating-ok';
  }

  // Zone chart
  const zoneChart = document.getElementById('zone-chart');
  const maxCount = Math.max(...Object.values(zones), 1);
  zoneChart.innerHTML = Object.entries(zones).map(([label, count]) => `
    <div class="zone-row">
      <span class="zone-label">${label}</span>
      <div class="zone-bar-track">
        <div class="zone-bar-fill" style="width:${(count / maxCount) * 100}%"></div>
      </div>
      <span class="zone-count">${count}</span>
    </div>`).join('');

  // Summary note
  const notes = [];
  if (sum < 100 || sum > 175) notes.push(`합계(${sum})가 이상적 범위(100~175)를 벗어납니다.`);
  if (odd === 0 || even === 0) notes.push('홀수 또는 짝수만으로 구성된 조합은 역대 당첨 패턴에서 드뭅니다.');
  if (consec >= 3) notes.push('3개 이상의 연속번호는 실제 당첨에서 매우 드뭅니다.');
  const maxZone = Math.max(...Object.values(zones));
  if (maxZone >= 4) notes.push('한 구간에 4개 이상이 몰렸습니다. 다른 구간에 분산하는 것을 고려해보세요.');
  if (!notes.length) notes.push('균형 잡힌 번호 조합입니다. 홀짝, 구간 분포, 합계 모두 통계적으로 자연스러운 패턴입니다.');
  document.getElementById('analysis-note').textContent = notes.join(' ');
}

// Smart generator (strategy page)
const smartGenBtn = document.getElementById('smart-gen-btn');
if (smartGenBtn) {
  let currentMode = 'random';

  const modeDescs = {
    random:   '무작위: 조건 없이 완전히 무작위로 6개 번호를 생성합니다.',
    balanced: '홀짝 균형: 홀수 3개 + 짝수 3개로 구성된 번호를 생성합니다.',
    zone:     '구간 분산: 1~9, 10~19, 20~29, 30~39, 40~45 구간에서 고르게 번호를 선택합니다.',
    sum:      '합계 균형: 6개 번호의 합이 100~175 범위에 들어오도록 생성합니다.',
  };

  document.querySelectorAll('.strat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.strat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      document.getElementById('strat-desc').textContent = modeDescs[currentMode];
    });
  });

  function generateBalanced() {
    const odds = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45];
    const evens = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44];
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const picked = [...shuffle(odds).slice(0, 3), ...shuffle(evens).slice(0, 3)];
    return picked.sort((a, b) => a - b);
  }

  function generateZone() {
    const zones = [[1,9],[10,19],[20,29],[30,39],[40,45]];
    const nums = new Set();
    // One from each of first 5 zones, then fill remaining randomly
    zones.forEach(([lo, hi]) => {
      if (nums.size < 5) {
        let n;
        do { n = Math.floor(Math.random() * (hi - lo + 1)) + lo; } while (nums.has(n));
        nums.add(n);
      }
    });
    while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
    return Array.from(nums).sort((a, b) => a - b);
  }

  function generateSumBalanced() {
    let nums, sum, attempts = 0;
    do {
      nums = generateRandom();
      sum = nums.reduce((a, b) => a + b, 0);
      attempts++;
    } while ((sum < 100 || sum > 175) && attempts < 1000);
    return nums;
  }

  smartGenBtn.addEventListener('click', () => {
    let nums;
    if (currentMode === 'balanced') nums = generateBalanced();
    else if (currentMode === 'zone') nums = generateZone();
    else if (currentMode === 'sum') nums = generateSumBalanced();
    else nums = generateRandom();

    const container = document.getElementById('smart-numbers');
    renderBalls(container, nums);

    const { odd, even, sum, consec } = analyzeNumbers(nums);
    const analysis = document.getElementById('smart-analysis');
    analysis.hidden = false;
    analysis.textContent = `홀수 ${odd}개 · 짝수 ${even}개 · 합계 ${sum} · 연속번호 ${consec}쌍`;
  });
}
