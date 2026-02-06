// --- Secure Random ---
function randomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// --- Speech ---
let speakAbort = false;

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
 */
async function speak(number) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  speakAbort = false;

  // Lấy câu rao random (nếu có)
  const phrase = getRandomPhrase(number);

  if (phrase) {
    await sayText(phrase);
    if (speakAbort) return;
    await delay(3000);
    if (speakAbort) return;
    await sayText(`là con số ${number}`);
  } else {
    await sayText(`Số ${number}`);
  }
}

/**
 * Random chọn 1 câu rao cho số.
 * Return null nếu không có câu rao hoặc random trúng "đọc số thường".
 */
function getRandomPhrase(number) {
  if (typeof lottoData === 'undefined') return null;
  const phrases = lottoData[number];
  if (!phrases || phrases.length === 0) return null;

  // Thêm 1 option null (đọc số bình thường) vào pool random
  const pool = [...phrases, null];
  return pool[randomInt(pool.length)];
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

  const cell = document.getElementById(`c${num}`);
  if (cell) {
    cell.classList.add('called', 'just');
    setTimeout(() => cell.classList.remove('just'), 400);
  }
}

function resetDisplay() {
  $number.textContent = '--';
  $number.classList.remove('pop', 'done');
  $count.textContent = '0';
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
  speakAbort = true;
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

// --- Init ---
initGame();
renderBoard();
