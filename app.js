// --- Secure Random ---
function randomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// --- Speech ---
let speakGen = 0;

function sayText(text) {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi'));
    if (viVoice) utterance.voice = viVoice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    speechSynthesis.speak(utterance);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Flow gọi số:
 * - Có câu rao: đọc câu rao → chờ 3s (user đoán) → đọc "là con số X"
 * - Không có câu rao: đọc "Số X" bình thường
 *
 * Dùng generation counter để tránh race condition khi gọi số liên tục.
 * Mỗi lần speak() mới, gen tăng → speak() cũ tự dừng.
 */
async function speak(number) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const gen = ++speakGen;

  // Lấy câu rao random (nếu có)
  const phrase = getRandomPhrase(number);

  if (phrase) {
    await sayText(phrase);
    if (gen !== speakGen) return;
    await delay(3000);
    if (gen !== speakGen) return;
    await sayText(`là con số ${number}`);
  } else {
    await sayText(`Số ${number}`);
  }
}

// --- Đọc số tiếng Việt ---
function numberToVietnamese(n) {
  if (n === 0) return 'không';
  const dv = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const nghin = Math.floor(n / 1000);
  const tram = Math.floor((n % 1000) / 100);
  const chuc = Math.floor((n % 100) / 10);
  const donVi = n % 10;
  const parts = [];
  if (nghin > 0) {
    parts.push(dv[nghin] + ' ngàn');
    if (tram === 0 && chuc > 0) parts.push('không trăm');
  }
  if (tram > 0) parts.push(dv[tram] + ' trăm');
  if (chuc === 1) {
    parts.push('mười');
  } else if (chuc > 1) {
    parts.push(dv[chuc] + ' mươi');
  } else if (chuc === 0 && (tram > 0 || nghin > 0) && donVi > 0) {
    parts.push('lẻ');
  }
  if (donVi > 0) {
    if (chuc >= 2 && donVi === 1) parts.push('mốt');
    else if (chuc >= 1 && donVi === 5) parts.push('lăm');
    else parts.push(dv[donVi]);
  }
  return parts.join(' ');
}

// --- Sinh câu rao toán học ngẫu nhiên ---
function getFactorPairs(n) {
  const pairs = [];
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      pairs.push([i, n / i]);
      if (i !== n / i) pairs.push([n / i, i]);
    }
  }
  return pairs;
}

function generateMathPhrase(n) {
  const vi = numberToVietnamese;
  const ops = ['sub'];
  if (n >= 2) ops.push('add');
  const factors = getFactorPairs(n);
  if (factors.length > 0) ops.push('mul');
  // div: chỉ cho phép khi tích ≤ 120 (dễ tính nhẩm)
  if (n <= 60) ops.push('div');
  // sqrt: chỉ cho số nhỏ (n ≤ 10) để n² ≤ 100
  if (n <= 10) ops.push('sqrt');
  const sqrtN = Math.sqrt(n);
  if (Number.isInteger(sqrtN) && sqrtN > 1) ops.push('square');
  const cbrtN = Math.round(Math.cbrt(n));
  if (cbrtN > 1 && cbrtN * cbrtN * cbrtN === n) ops.push('cube');
  if (n > 1 && (n & (n - 1)) === 0) ops.push('pow2');

  const op = ops[randomInt(ops.length)];
  let phrase;
  switch (op) {
    case 'add': {
      const a = 1 + randomInt(n - 1);
      phrase = `${vi(a)} cộng ${vi(n - a)} bằng mấy?`;
      break;
    }
    case 'sub': {
      const b = 1 + randomInt(Math.min(20, 99 - n));
      phrase = `${vi(n + b)} trừ ${vi(b)} bằng mấy?`;
      break;
    }
    case 'mul': {
      const p = factors[randomInt(factors.length)];
      phrase = `${vi(p[0])} nhân ${vi(p[1])} bằng mấy?`;
      break;
    }
    case 'div': {
      const maxB = Math.max(2, Math.min(5, Math.floor(120 / n)));
      const b = 2 + randomInt(maxB - 1);
      phrase = `${vi(n * b)} chia ${vi(b)} bằng mấy?`;
      break;
    }
    case 'sqrt':
      phrase = `Căn bậc hai của ${vi(n * n)} bằng mấy?`;
      break;
    case 'square':
      phrase = `${vi(sqrtN)} bình phương bằng mấy?`;
      break;
    case 'cube':
      phrase = `${vi(cbrtN)} mũ ba bằng mấy?`;
      break;
    case 'pow2':
      phrase = `Hai mũ ${vi(Math.log2(n))} bằng mấy?`;
      break;
  }
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/**
 * Random chọn loại câu rao cho số.
 * Hệ thống chọn thông minh: chỉ random trong các pool CÓ DỮ LIỆU cho số đó.
 * 9 loại câu rao:
 *   1. Văn hóa/bài hát (lottoData)
 *   2. Toán học (luôn có)
 *   3. Biển số xe (licensePlateData)
 *   4. Số đề con vật (lotteryAnimalData)
 *   5. Ca dao tục ngữ (proverbData)
 *   6. Câu đố vui (riddleData)
 *   7. Bóng đá/thể thao (footballData)
 *   8. Ngày tháng lịch sử (historyDateData)
 *   9. Null → đọc "Số X" bình thường
 */
function getRandomPhrase(number) {
  // Thu thập các pool có dữ liệu + trọng số ưu tiên
  // culture=3, math/proverb/riddle/sode=2, bienso/football/history/null=1
  const weighted = [];
  function addPool(name, weight) {
    for (let i = 0; i < weight; i++) weighted.push(name);
  }

  if (typeof lottoData !== 'undefined' && lottoData[number] && lottoData[number].length > 0)
    addPool('culture', 3);
  addPool('math', 2);
  if (typeof licensePlateData !== 'undefined' && licensePlateData[number])
    addPool('bienso', 1);
  if (typeof lotteryAnimalData !== 'undefined' && lotteryAnimalData[number])
    addPool('sode', 1);
  if (typeof proverbData !== 'undefined' && proverbData[number] && proverbData[number].length > 0)
    addPool('proverb', 2);
  if (typeof riddleData !== 'undefined' && riddleData[number] && riddleData[number].length > 0)
    addPool('riddle', 2);
  if (typeof footballData !== 'undefined' && footballData[number] && footballData[number].length > 0)
    addPool('football', 1);
  if (typeof historyDateData !== 'undefined' && historyDateData[number] && historyDateData[number].length > 0)
    addPool('history', 1);
  addPool(null, 1);

  const category = weighted[randomInt(weighted.length)];

  if (category === 'culture') {
    return lottoData[number][randomInt(lottoData[number].length)];
  }

  if (category === 'math') {
    return generateMathPhrase(number);
  }

  if (category === 'bienso') {
    const province = licensePlateData[number];
    const templates = [
      `Xe đăng ký tại ${province} mang đầu biển số mấy?`,
      `Đầu biển số mấy là của ${province}?`,
      `Biển số xe ${province} bắt đầu bằng số mấy?`,
      `Tỉnh ${province} có đầu biển số xe là bao nhiêu?`,
    ];
    return templates[randomInt(templates.length)];
  }

  if (category === 'sode') {
    const name = lotteryAnimalData[number];
    const templates = [
      `Trong số đề, ${name} là số mấy?`,
      `Trong số đề, ${name} mang số bao nhiêu?`,
    ];
    return templates[randomInt(templates.length)];
  }

  if (category === 'proverb') {
    return proverbData[number][randomInt(proverbData[number].length)];
  }

  if (category === 'riddle') {
    return riddleData[number][randomInt(riddleData[number].length)];
  }

  if (category === 'football') {
    const entry = footballData[number][randomInt(footballData[number].length)];
    const templates = [
      `Số áo của ${entry.player} tại ${entry.team} là mấy?`,
      `Cầu thủ ${entry.player} mặc áo số mấy khi chơi cho ${entry.team}?`,
      `${entry.player} ở ${entry.team} mang áo số bao nhiêu?`,
    ];
    return templates[randomInt(templates.length)];
  }

  if (category === 'history') {
    return historyDateData[number][randomInt(historyDateData[number].length)];
  }

  return null; // đọc số bình thường
}

// Preload voices (some browsers load async)
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

// --- Game State ---
let remaining = [];
let called = [];

function initGame() {
  remaining = Array.from({ length: 60 }, (_, i) => i + 1);
  called = [];
}

function callNumber() {
  if (remaining.length === 0) return null;
  const idx = randomInt(remaining.length);
  const num = remaining.splice(idx, 1)[0];
  called.push(num);
  return num;
}

// --- DOM ---
const $number = document.getElementById('currentNumber');
const $count = document.getElementById('calledCount');
const $recent = document.getElementById('recentNumbers');
const $board = document.getElementById('numberBoard');
const $callBtn = document.getElementById('callBtn');
const $resetBtn = document.getElementById('resetBtn');
const $overlay = document.getElementById('confirmOverlay');
const $confirmYes = document.getElementById('confirmYes');
const $confirmNo = document.getElementById('confirmNo');

function renderBoard() {
  $board.innerHTML = '';
  for (let i = 1; i <= 60; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `c${i}`;
    cell.textContent = i;
    $board.appendChild(cell);
  }
}

function updateDisplay(num) {
  $number.textContent = num;
  $number.classList.remove('pop', 'done');
  // Force reflow to restart animation
  void $number.offsetWidth;
  $number.classList.add('pop');

  $count.textContent = called.length;
  renderRecent();

  const cell = document.getElementById(`c${num}`);
  if (cell) {
    cell.classList.add('called', 'just');
    setTimeout(() => cell.classList.remove('just'), 400);
  }
}

function renderRecent() {
  const last5 = called.slice(-5).reverse();
  $recent.innerHTML = last5.map((n, i) =>
    `<div class="recent-ball${i === 0 ? ' latest' : ''}">${n}</div>`
  ).join('');
}

function resetDisplay() {
  $number.textContent = '--';
  $number.classList.remove('pop', 'done');
  $count.textContent = '0';
  $recent.innerHTML = '';
  $callBtn.disabled = false;
  document.querySelectorAll('.cell.called').forEach(c => {
    c.classList.remove('called');
  });
}

function gameOver() {
  $number.textContent = 'HẾT';
  $number.classList.add('done');
  $callBtn.disabled = true;
}

// --- Auto Mode ---
const $autoBtn = document.getElementById('autoBtn');
const $intervalInput = document.getElementById('intervalInput');
let autoTimer = null;
let isAuto = false;

async function doCall() {
  const num = callNumber();
  if (num === null) return false;
  updateDisplay(num);
  await speak(num);
  if (remaining.length === 0) {
    stopAuto();
    gameOver();
    return false;
  }
  return true;
}

function startAuto() {
  isAuto = true;
  $autoBtn.textContent = 'DỪNG';
  $autoBtn.classList.add('active');
  $callBtn.disabled = true;
  $intervalInput.disabled = true;
  autoTick();
}

function stopAuto() {
  isAuto = false;
  clearTimeout(autoTimer);
  autoTimer = null;
  $autoBtn.textContent = 'TỰ ĐỘNG';
  $autoBtn.classList.remove('active');
  $callBtn.disabled = remaining.length === 0;
  $intervalInput.disabled = false;
}

async function autoTick() {
  if (!isAuto) return;
  const ok = await doCall();
  if (ok && isAuto) {
    const sec = Math.max(1, parseInt($intervalInput.value) || 5);
    autoTimer = setTimeout(autoTick, sec * 1000);
  }
}

// --- Events ---
let busy = false;

$callBtn.addEventListener('click', () => {
  if (busy || isAuto) return;
  busy = true;
  doCall();
  setTimeout(() => { busy = false; }, 300);
});

$autoBtn.addEventListener('click', () => {
  if (remaining.length === 0) return;
  isAuto ? stopAuto() : startAuto();
});

$resetBtn.addEventListener('click', () => {
  $overlay.classList.remove('hidden');
});

$confirmYes.addEventListener('click', () => {
  stopAuto();
  speakGen++;
  speechSynthesis.cancel();
  initGame();
  resetDisplay();
  $overlay.classList.add('hidden');
});

$confirmNo.addEventListener('click', () => {
  $overlay.classList.add('hidden');
});

// Close overlay on background click
$overlay.addEventListener('click', (e) => {
  if (e.target === $overlay) $overlay.classList.add('hidden');
});

// --- QR Popup ---
const $qrOverlay = document.getElementById('qrOverlay');
document.getElementById('qrOpenBtn').addEventListener('click', () => {
  $qrOverlay.classList.remove('hidden');
});
document.getElementById('qrCloseBtn').addEventListener('click', () => {
  $qrOverlay.classList.add('hidden');
});
$qrOverlay.addEventListener('click', (e) => {
  if (e.target === $qrOverlay) $qrOverlay.classList.add('hidden');
});

// --- Init ---
initGame();
renderBoard();
