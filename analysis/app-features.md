# Lô Tô Caller - Bản Đơn Giản

> Mục tiêu: App gọi số lô tô trên điện thoại, thay thế việc bốc số thủ công.
> Nguyên tắc: Càng ít nút càng tốt. Mở lên → bấm → nghe → chơi.

---

## Tính năng

### 1. Gọi số
- Bấm nút **"Gọi Số"** → random 1 số (1-90) chưa gọi → đọc to bằng giọng Việt
- Mỗi số chỉ gọi 1 lần, không trùng lặp
- Hiển thị số vừa gọi thật to ở giữa màn hình

### 2. Bảng số 1-90
- Grid hiển thị tất cả 90 số
- Số đã gọi → đổi màu (highlight)
- Nhìn là biết số nào đã gọi, số nào chưa

### 3. Giọng đọc tiếng Việt
- Đọc to "Số X" mỗi khi gọi
- Dùng Web Speech API (miễn phí, không cần backend)

### 4. Đếm số
- Hiển thị: Đã gọi: X / 90

### 5. Chơi lại
- Nút reset → xác nhận → bắt đầu ván mới

---

## Không làm (giữ đơn giản)

- ~~Câu rao vui~~ → chỉ đọc số
- ~~Auto mode~~ → user tự bấm
- ~~Kiểm tra vé~~ → user tự nhìn
- ~~Lịch sử game~~ → không cần
- ~~Dark/Light mode~~ → 1 theme duy nhất
- ~~Quản lý câu rao~~ → không có câu rao
- ~~Share/QR~~ → không cần
- ~~PWA Install banner~~ → không cần
- ~~Fullscreen~~ → không cần
- ~~Font size control~~ → responsive sẵn
- ~~Backend TTS~~ → dùng Web Speech API

---

## Giao diện (1 màn hình duy nhất)

```
┌──────────────────────────┐
│      LÔ TÔ CALLER       │
│                          │
│        ┌──────┐          │
│        │  45  │  ← to    │
│        └──────┘          │
│     Đã gọi: 12 / 90     │
│                          │
│   ┌────────────────┐     │
│   │   [ GỌI SỐ ]  │     │
│   └────────────────┘     │
│   ┌────────────────┐     │
│   │  [ CHƠI LẠI ] │     │
│   └────────────────┘     │
│                          │
│  01 02 03 04 05 06 07 08 │
│  09 10 11 12 13 14 15 16 │
│  17 18 19 20 21 22 23 24 │
│  ...                     │
│  81 82 83 84 85 86 87 88 │
│  89 90                   │
│                          │
└──────────────────────────┘
```

---

## Tech stack dự kiến

| Thành phần | Lựa chọn |
|------------|----------|
| Framework | HTML + CSS + Vanilla JS (hoặc Vue/React nếu muốn) |
| TTS | Web Speech API (`speechSynthesis`) |
| Random | `crypto.getRandomValues()` |
| Hosting | Netlify / Vercel / GitHub Pages |
| Responsive | Mobile-first CSS |
