# Phân Tích Chuyên Sâu: Ứng Dụng "Gọi Lô Tô" (v2.2.0)

> Source: https://lotocaller.netlify.app/
> Author: Le Van An (Vietnam IT) - @anlvdt on GitHub
> Ngày phân tích: 2026-02-06

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1 Tech Stack

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Backend | Netlify Serverless Functions (TTS) |
| TTS Engine | Google Text-to-Speech API (via Netlify Function) |
| Hosting | Netlify (CDN + Serverless) |
| PWA | Service Worker + Web App Manifest |
| Random | Web Crypto API (cryptographically secure) |
| Storage | localStorage (client-side) |

### 1.2 Cấu Trúc Files

```
/
├── index.html              # Single page HTML
├── styles.css              # ~2500+ dòng CSS
├── app.js                  # ~2000+ dòng JavaScript
├── sw.js                   # Service Worker (cache v2.2.0)
├── manifest.json           # PWA manifest
├── icons/
│   ├── icon-192.svg        # App icon 192x192
│   └── icon-512.svg        # App icon 512x512
└── .netlify/
    └── functions/
        └── tts             # Serverless TTS proxy function
```

### 1.3 Service Worker Strategy

```
Cache Name: 'loto-caller-v2.2.0'

Cached on Install:
  /, /index.html, /styles.css, /app.js,
  /manifest.json, /icons/icon-192.svg, /icons/icon-512.svg

Excluded from Cache:
  /audio/*, /api/*, /tts/*, /.netlify/*, :5001 (dev)

Strategy:
  - HTML/CSS/JS → Network First (fallback to cache)
  - Static Assets → Cache First (fallback to network)

Lifecycle:
  - Install: skipWaiting() → activate ngay
  - Activate: Xóa cache cũ, clients.claim()
```

### 1.4 PWA Manifest

```json
{
  "name": "Gọi Lô Tô",
  "short_name": "Lô Tô",
  "description": "Ứng dụng gọi số Lô Tô tự động với giọng đọc vui nhộn phong cách Top Gun",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "lang": "vi",
  "dir": "ltr",
  "theme_color": "#D97706",
  "background_color": "#0F172A",
  "categories": ["games", "entertainment"],
  "icons": [
    { "src": "/icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any maskable" },
    { "src": "/icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

---

## 2. UI/UX DESIGN

### 2.1 Color System (CSS Custom Properties)

```css
/* Dark Theme (default) */
--color-bg-primary:     #0F172A;   /* Dark navy - nền chính */
--color-gold:           #D97706;   /* Amber/Gold - primary accent */
--color-orange:         #EA580C;   /* Sunset orange - secondary accent */
--color-sky:            #0EA5E9;   /* Sky blue - info/link */
--color-danger:         #DC2626;   /* Red - danger/error */

/* Light Theme - đảo ngược màu nền, giữ accent */
[data-theme="light"] {
  /* Overrides tất cả color properties */
}
```

### 2.2 Layout Structure

```
┌─────────────────────────────────────────────────┐
│ HEADER: Logo + Title + Share/Theme/Font/QR/etc  │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  LEFT SIDEBAR    │     MAIN CONTENT             │
│  (max 420px)     │                              │
│                  │  ┌──────────────────────┐    │
│  ┌────────────┐  │  │   BẢNG SỐ 1-90      │    │
│  │ Số Hiện Tại│  │  │   (Grid 10 cột)     │    │
│  │    --       │  │  │                      │    │
│  │ "Câu rao"  │  │  │  01 02 03 ... 10     │    │
│  └────────────┘  │  │  11 12 13 ... 20     │    │
│                  │  │  ...                  │    │
│  Đã gọi: 0/90   │  │  81 82 83 ... 90     │    │
│  Còn lại: 90     │  │                      │    │
│                  │  └──────────────────────┘    │
│  [Gọi Số]       │                              │
│  [Tự Động]      │                              │
│  [Chơi Lại]     │                              │
│  [Kiểm Tra Vé]  │                              │
│                  │                              │
│  Tốc độ đọc:    │                              │
│  ──●──── 0.65x  │                              │
│                  │                              │
│  Khoảng nghỉ:   │                              │
│  ──●──── 5s     │                              │
│                  │                              │
│  ☑ Rao vui      │                              │
│                  │                              │
│  5 Số Gần Nhất: │                              │
│  [45] [23] ...   │                              │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│ FOOTER: Author info + Donate section            │
└─────────────────────────────────────────────────┘
```

### 2.3 Responsive Breakpoints

| Breakpoint | Layout | Grid Columns | Đặc điểm |
|------------|--------|--------------|-----------|
| > 1200px | 2 columns, sidebar 420px | 10 cột | Full-size display, số lớn 6.5rem |
| 992-1199px | 2 columns, sidebar thu nhỏ | 10 cột | Giảm spacing |
| 768-991px | 2 columns, sidebar 340px | 9 cột | Ẩn decorative elements |
| 576-767px | 1 column, stacked | 6 cột | Stacked layout, font scaling |
| < 575px | 1 column, compact | 5 cột | Compressed spacing (4-8px gaps) |
| < 375px | 1 column, minimal | 5 cột | Minimal padding |
| Height < 600px | Landscape optimized | Giữ nguyên | Giảm vertical padding |

### 2.4 Typography

- Fluid sizing dùng `clamp()` cho responsive text
- 3 cấp font size: `font-small`, `font-medium`, `font-large`
- Lưu preference vào localStorage key `loto-font-size`
- Nút A-/A+ trên header để điều chỉnh

### 2.5 Animations & Effects

```css
/* Danh sách @keyframes */
@keyframes numberPulse    /* Số hiện tại nhấp nháy scale + opacity */
@keyframes fadeUp         /* Câu rao hiện lên từ dưới */
@keyframes justCalled     /* Bounce effect khi ô số được gọi */
@keyframes luckyHit       /* Radial glow cho số may mắn */
@keyframes confetti-fall  /* Confetti rơi 3D rotation */
@keyframes heartbeat      /* Pulse scale cho highlight */
@keyframes shimmer        /* Gradient sweep effect */
@keyframes shake          /* Rung ngang cho lỗi */
@keyframes modalIn        /* Scale entrance cho modal */

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  /* Tắt tất cả animations */
}
```

### 2.6 Confetti System

```javascript
const ConfettiEffect = {
    colors: ['#D97706', '#F59E0B', '#EA580C', '#F97316', '#0EA5E9', '#38BDF8', '#DC2622'],
    shapes: ['circle', 'square', 'ribbon'],

    create(count)     // Confetti rơi từ trên - dùng khi KINH hoặc game over
    burst(x, y, count) // Confetti burst tại vị trí - dùng cho lucky numbers
};

// Trigger conditions:
// - Lucky numbers (7, 8, 9, 39, 68, 77, 79, 88): burst 15 particles tại ô số
// - KINH (trúng vé): create 100 particles
// - Game over (gọi hết 90 số): create 80 particles
```

---

## 3. JAVASCRIPT MODULES CHI TIẾT

### 3.1 SecureRandom - Sinh Số Ngẫu Nhiên

```javascript
const SecureRandom = {
    // Dùng crypto.getRandomValues() (Web Crypto API)
    // Rejection sampling để đảm bảo uniform distribution
    // Fallback: trung bình 3 Math.random() nếu không có Crypto API

    getInt(max)       // Trả về int [0, max)
    betterRandom()    // Fallback random tốt hơn Math.random()
    shuffle(array)    // Fisher-Yates shuffle in-place
    pick(array)       // Chọn ngẫu nhiên 1 phần tử
};
```

**Tại sao Crypto API?**
- Không bị predict được pattern
- Đảm bảo công bằng (fairness) → quan trọng cho game
- Rejection sampling tránh modulo bias

### 3.2 LotoCaller - Game Engine

```javascript
class LotoCaller {
    constructor(options) {
        this.numbers = [];           // Các số chưa gọi
        this.calledNumbers = [];      // Các số đã gọi (theo thứ tự)
        this.isAutoMode = false;
        this.autoTimeout = null;
        this.autoSpeed = 5000;        // ms
        this.isWaitingForAudio = false;
        this.onNumberCalled = null;   // Callback
        this.onGameOver = null;       // Callback
    }

    init() {
        // Tạo mảng [1..90], shuffle, reset state
        this.numbers = Array.from({ length: 90 }, (_, i) => i + 1);
        SecureRandom.shuffle(this.numbers);
    }

    callNumber() {
        // Chọn ngẫu nhiên 1 số từ remaining (double random)
        // 1. Mảng đã shuffle sẵn
        // 2. Chọn random index từ mảng đã shuffle
        const randomIndex = SecureRandom.getInt(this.numbers.length);
        const number = this.numbers.splice(randomIndex, 1)[0];
        this.calledNumbers.push(number);
        return number;
    }

    startAuto(intervalMs) {
        // Clamp speed: [3000, 10000] ms
        // Gọi số đầu tiên ngay lập tức
    }

    audioFinished() {
        // Auto mode: đợi audio xong → setTimeout → gọi số tiếp
        // waitTime = max(500, autoSpeed - 3000)
    }

    stopAuto()         // Dừng auto, clear timeout
    reset()            // Reset game mới
    getStats()         // { called: N, remaining: 90-N }
    getHistory(count)  // N số gần nhất (reverse order)
    isGameOver()       // numbers.length === 0
}
```

### 3.3 SpeechEngine - Text-to-Speech

```javascript
const SpeechEngine = {
    // Constants
    PAUSE_QUESTION: 3500,    // ms pause sau câu hỏi
    PAUSE_NORMAL: 800,       // ms pause sau câu thường
    SPEED_PHRASE: 0.85,      // Tốc độ đọc câu rao (adjustable)
    SPEED_NUMBER: 1,         // Tốc độ đọc số

    // Core method
    async speakNumber(num, funnyCall) {
        // Flow:
        // 1. Nếu có câu rao:
        //    a. Đọc câu rao (speed: SPEED_PHRASE)
        //    b. Pause (3500ms nếu câu hỏi, 800ms nếu không)
        //    c. Đọc "Số {num}" (speed: SPEED_NUMBER)
        // 2. Nếu không có câu rao:
        //    Chỉ đọc "Số {num}"
        // 3. Khi xong → callback onAudioFinished
    },

    async playTTSAudio(text, speed) {
        // Gọi Netlify Function: /.netlify/functions/tts?num=1&text={encoded}&speed={speed}
        // Nhận blob audio → tạo Object URL → play
        // Timeout 10 giây
        // Cleanup: revokeObjectURL sau khi xong
    }
};
```

### 3.4 CallPhraseManager - Quản Lý Câu Rao

```javascript
const CallPhraseManager = {
    STORAGE_KEY: 'loto-custom-phrases',
    HIDDEN_KEY: 'loto-hidden-phrases',

    // Data structure:
    // customPhrases = { "7": ["câu 1", "câu 2"], "88": ["câu 3"] }
    // hiddenDefaults = { "7": ["câu mặc định bị ẩn"] }

    addPhrase(num, phrase)               // Thêm câu rao custom
    updatePhrase(num, oldPhrase, new)    // Sửa câu rao
    deletePhrase(num, phrase, isDefault) // Xóa (custom) hoặc ẩn (default)
    getPhrasesForNumber(num)             // Lấy tất cả câu rao cho 1 số
    getRandomPhrase(num)                 // Random 1 câu (70% custom, 30% default)
    resetToDefaults()                    // Xóa hết custom + unhide defaults
};

// Mỗi số có:
// - Nhiều câu rao mặc định (built-in): toán, lịch sử, thể thao, văn hóa...
// - Câu rao custom do user thêm
// - Ưu tiên: 70% chọn custom, 30% chọn default (khi có cả hai)
```

### 3.5 GameHistoryManager - Lịch Sử Game

```javascript
const GameHistoryManager = {
    STORAGE_KEY: 'loto-game-history',
    MAX_GAMES: 20,

    // Data structure cho mỗi game:
    // {
    //   id: Date.now(),
    //   startTime: ISO string,
    //   endTime: ISO string | null,
    //   calledNumbers: [{ number: 45, timestamp: ISO }, ...],
    //   isComplete: boolean
    // }

    startNewGame()           // Tạo game mới
    recordNumber(num)        // Ghi số vào game hiện tại
    endGame(isComplete)      // Kết thúc game, lưu vào history
    getHistory()             // Lấy danh sách games
    getGameById(id)          // Xem chi tiết 1 game
    deleteGame(id)           // Xóa 1 game
    clearHistory()           // Xóa toàn bộ
    formatDate(iso)          // Format ngày tiếng Việt
    formatDuration(s, e)     // Tính thời lượng mm:ss
};
```

### 3.6 UI Module - DOM Rendering

```javascript
const UI = {
    elements: { /* 50+ DOM references via getElementById */ },

    init()                    // Cache tất cả DOM elements
    renderNumberBoard()       // Tạo 90 ô số (div.number-cell)
    updateDisplay(num, call)  // Hiện số + câu rao
    updateDisplaySuspense()   // Hiện "?" + câu rao (trước khi reveal)
    revealNumber(number)      // Reveal số thật (sau 3 giây suspense)
    updateHistory(numbers)    // Cập nhật 5 số gần nhất
    updateStats(called, rem)  // Cập nhật counter
    setAutoMode(isAuto)       // Toggle nút auto (play/pause icon)
    setGameOver()             // Hiện "XONG" + message
    resetUI()                 // Reset về trạng thái ban đầu
    showConfirmModal()        // Hiện modal xác nhận reset
    hideConfirmModal()        // Ẩn modal
};
```

### 3.7 App - Main Controller

```javascript
const App = {
    game: null,                // LotoCaller instance
    funnyEnabled: true,        // Bật/tắt câu rao
    isProcessing: false,       // Đang xử lý số (lock)
    lastCallTime: 0,           // Debounce timestamp
    fontSizes: ['font-small', 'font-medium', 'font-large'],
    currentFontSizeIndex: 1,   // Default: medium

    // Core methods
    init()                     // Khởi tạo tất cả modules
    handleNumberCalled(num)    // Xử lý khi số được gọi
    handleGameOver()           // Xử lý khi hết 90 số
    callNumber()               // Gọi số (với debounce 500ms)
    toggleAuto()               // Bật/tắt auto mode
    resetGame()                // Hiện confirm → reset
    confirmReset()             // Xác nhận reset
    checkTicket()              // Kiểm tra vé

    // Feature methods
    initTheme()                // Khởi tạo dark/light mode
    toggleTheme()              // Toggle theme
    initFontSize()             // Khởi tạo font size
    changeFontSize(direction)  // Tăng/giảm font
    initFullscreen()           // Fullscreen API
    initShare()                // Share menu (FB + copy link)
    initQR()                   // QR code generation
    bindEvents()               // Bindtất cả event listeners
};
```

---

## 4. EVENT HANDLING & KEYBOARD SHORTCUTS

### 4.1 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Gọi số (khi game chưa kết thúc) |
| `A` | Toggle auto mode |
| `R` | Reset game (hiện confirm) |
| `Escape` | Đóng tất cả modals |
| `Enter` | Submit câu rao mới (trong phrase input) |

### 4.2 Button Events

| Button | Action |
|--------|--------|
| Gọi Số | `App.callNumber()` |
| Tự Động / Dừng | `App.toggleAuto()` |
| Chơi Lại | `App.resetGame()` → confirm modal |
| Kiểm Tra Vé | Open ticket modal |
| A- / A+ | `App.changeFontSize(-1/+1)` |
| Theme toggle | `App.toggleTheme()` |
| Fullscreen | Toggle fullscreen API |
| Share | Show share menu (FB/copy) |
| QR | Show QR modal |
| Quản Lý Câu Rao | Open phrase manager modal |
| Lịch Sử | Open game history modal |
| About (i) | Open about modal |

### 4.3 Slider Controls

| Slider | Range | Default | Storage |
|--------|-------|---------|---------|
| Tốc độ đọc (phrase speed) | 0.5x - 1x | 0.65x | In-memory |
| Khoảng nghỉ (auto interval) | 3s - 10s | 5s | In-memory |

---

## 5. TICKET CHECKING LOGIC

### 5.1 Input

```
┌─────────────────────────────┐
│ Nhập 5 số trên một hàng:   │
│ [__] [__] [__] [__] [__]   │
│                             │
│ [Kiểm Tra Vé] [Xóa Hết]   │
└─────────────────────────────┘
```

### 5.2 Validation

```javascript
// Mỗi ô: parse int, kiểm tra 1 ≤ num ≤ 90
// Ô không hợp lệ: thêm class 'invalid' (hiệu ứng shake)
// Cần ít nhất 1 số để kiểm tra
```

### 5.3 Checking Algorithm

```javascript
const calledNumbers = game.calledNumbers;    // Tất cả số đã gọi
const ticketNumbers = [/* 5 số từ input */];

const calledOnTicket = ticketNumbers.filter(n => calledNumbers.includes(n));
const missingOnTicket = ticketNumbers.filter(n => !calledNumbers.includes(n));

// Hiển thị:
// - Đã trúng: {calledOnTicket.length} → show number tags (green)
// - Còn thiếu: {missingOnTicket.length} → show number tags (red)
// - Nếu missingOnTicket.length === 0 → "🎉 KINH! Trúng hết!" + confetti
```

---

## 6. LOCAL STORAGE MAP

| Key | Type | Mô tả | Max Size |
|-----|------|--------|----------|
| `loto-theme` | string | `"dark"` hoặc `"light"` | ~5 bytes |
| `loto-font-size` | string | `"font-small"`, `"font-medium"`, `"font-large"` | ~12 bytes |
| `loto-custom-phrases` | JSON object | `{ "7": ["câu 1"], ... }` | Variable |
| `loto-hidden-phrases` | JSON object | `{ "7": ["câu ẩn"], ... }` | Variable |
| `loto-game-history` | JSON array | 20 game objects with timestamps | ~50KB max |
| `pwa-install-dismissed` | string | Timestamp number | ~13 bytes |

---

## 7. MODALS/DIALOGS

| Modal | Trigger | Nội dung |
|-------|---------|----------|
| Confirm Reset | Nút "Chơi Lại" / phím R | "Bạn có chắc?" → Có/Không |
| Ticket Checker | Nút "Kiểm Tra Vé" | 5 ô input + kết quả |
| Phrase Manager | Nút "Quản Lý Câu Rao" | Dropdown số + list câu rao + thêm/sửa/xóa |
| Game History | Nút "Lịch Sử" | Danh sách games + xem chi tiết |
| Game Detail | Click game trong history | Bảng số mini + sequence + stats |
| QR Code | Nút QR | QR image + URL text |
| About | Nút (i) | Version, author, donate links |
| PWA Install | Auto (3s delay) | Banner cài đặt app |

---

## 8. SPECIAL FEATURES

### 8.1 Suspense Effect

```
Timeline khi gọi số:
t=0ms    → Hiện "?" trên display + đọc câu rao (TTS)
t=0ms    → TTS bắt đầu đọc câu rao
t~2000ms → TTS đọc "Số X"
t=3000ms → Reveal số thật (animation pulse + bounce)
           → Update bảng số (highlight ô)
           → Update history, stats
           → Check lucky number → confetti nếu có
```

### 8.2 Lucky Numbers

```javascript
const luckyNumbers = [7, 8, 9, 39, 68, 77, 79, 88];
// Khi gọi trúng lucky number:
// 1. Thêm class 'lucky-hit' vào cell (glow animation)
// 2. ConfettiEffect.burst() tại vị trí cell (15 particles)
// 3. Remove class sau 600ms
```

### 8.3 Double Randomization

```
Bước 1: init() → shuffle toàn bộ mảng [1..90] bằng Fisher-Yates
Bước 2: callNumber() → chọn random index từ mảng đã shuffle
→ "Double random" = cực kỳ khó predict
→ Dùng Crypto API ở cả 2 bước
```

### 8.4 PWA Install Flow

```
1. Lắng nghe 'beforeinstallprompt' event
2. Đợi 3 giây → hiện install banner
3. Nếu user từ chối → ghi timestamp, ẩn 7 ngày
4. Nếu user đồng ý → prompt install → ẩn banner
5. Lắng nghe 'appinstalled' → cleanup
```

---

## 9. PERFORMANCE & OPTIMIZATION

- **Audio cleanup**: `URL.revokeObjectURL()` sau mỗi audio clip
- **DOM caching**: Tất cả elements cached trong `UI.elements` object
- **Debounce**: 500ms giữa các lần gọi số
- **Service Worker**: Cache-first cho static assets
- **Lazy confetti**: Tạo DOM elements on-demand, auto-remove sau 2.5-4s
- **CSS transitions**: Hardware-accelerated transforms
- **Reduced motion**: Tôn trọng user preference

---

## 10. ACCESSIBILITY

- Focus-visible outlines (3px gold)
- `prefers-reduced-motion` support
- Keyboard navigation (Space, A, R, Esc, Enter)
- High contrast text
- Adjustable font sizes (A-/A+)
- Semantic HTML structure
- Custom scrollbar styling

---

## 11. LIMITATIONS & CAVEATS

1. **No cross-device sync**: Tất cả data chỉ lưu local trên 1 browser
2. **TTS dependency**: Cần internet cho Google TTS (không work offline)
3. **Single player**: Không có multiplayer/room system
4. **No vé scanning**: Phải nhập tay 5 số
5. **Browser-only TTS**: Không có fallback Web Speech API
6. **No backend database**: Mất data khi clear browser
7. **Câu rao hardcoded**: Built-in phrases nằm trong JS bundle
