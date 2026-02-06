/**
 * Câu rao Lô Tô - câu rao văn hóa/bài hát cho mỗi số.
 * Câu rao toán học được tự động sinh ngẫu nhiên bởi app.js (generateMathPhrase).
 *
 * Format: { [số]: ["câu rao 1", "câu rao 2", ...] }
 * Mỗi câu rao KHÔNG chứa phần "là con số X" - phần đó sẽ được đọc tự động.
 */
const lottoData = {
  1: [
    'Bắc kim thang cà lang bí rợ, cột qua kèo là kèo qua cột',
  ],
  2: [
    'Dậy đi em đừng ngủ dây dưa, dậy ra coi giàn mướp ra hoa. Má ơi lấy khăn cho bầu thấm cơn buồn, người ta đi về nơi xa tìm tương lai hạnh phúc sa hoa, cớ sao cớ sao em còn nhớ thương ai',
  ],
  3: [
    'Tình cha ấm cúng như vầng thái dương. Ngọt ngào như dòng nước trôi đầu nguồn. Suối đời vì con nguy hiểm. Ân tình đậm sâu bao nhiêu. Cha hỡi cha già dấu yêu. Và con nhớ mãi những ngày tháng qua',
  ],
  4: [
    'Lần cuối gặp nhau bên gốc chuối, ăn chuối đi Lan, ăn xong Lan la làng. Thương thay cho nàng lìa xa nhân thế, nào thân cửa mà thiền môn con',
  ],
  5: [
    'Em đi trên cỏ non mọc ôm đôi bờ đường đê, em che nghiêng nón lá chân rụt rè qua nhịp cầu tre. Quê hương em ở ngoại thành xóm nhà tranh, em đi qua mấy sông vượt mấy đèo, dẫu trèo lên đỉnh cao mấy núi cũng lặn lội về thăm',
  ],
  6: [
    'Không phải tại anh cũng không phải tại em. Tại trời xui khiến nên chúng mình yêu nhau',
  ],
  7: [
    'Chị ong nâu nâu nâu nâu. Chị bay đi đâu đi đâu? Bác gà trống mới gáy, ông mặt trời mới dậy. Mà trên những cành hoa em đã thấy chị bay',
  ],
  8: [
    'Còn đâu đây tiếng vó ngựa phi. Mà ngỡ con tàu vỗ sóng bờ xa. Nỉ non sao tiếng nhạn kêu chiều. Buồm xuôi vô phương Nam phiêu bạt theo thủy triều. Dẫu trải qua thăng trầm giông tố. Qua bao cuộc bể dâu, mãi dâng cho đời. Bài tình ca đất phương Nam',
  ],
  9: [
    'Từ ngày hai đứa yêu nhau mộng ước thật nhiều, từ ngày hai đứa yêu nhau lòng ước bao nhiêu. Mộng vàng hai đứa có chi là quá xa xôi. Ta mơ một mái nhà tranh, ta mơ một túp lều tình. Đời mình đẹp mãi với em và anh. Đời mình đẹp mãi dưới túp lều xinh',
  ],
  10: [
    'Ba thương con vì con giống mẹ. Mẹ thương con vì con giống cha. Cả nhà ta cùng thương yêu nhau. Xa là nhớ gần nhau là cười',
  ],
  11: [
    'Í nhột, í nhột',
  ],
  12: [
    'Trúc Anh Đài là gái giả trai',
  ],
  13: [
    'Hồng trần trên đôi cánh tay, họa đời em trong phút giây. Từ ngày thơ ấy còn ngủ mơ đến khi em thờ ơ. Lòng người anh đâu có hay, một ngày khi vỗ cánh bay. Từ người yêu hóa thành người dưng đến khi ta tự xưng',
  ],
  14: [
    'Tề thiên đại thánh đại náo thiên cung, bị đứt dây thun, tụt quần chạy trốn',
  ],
  15: [
    'Con bác Năm ở xa mới về. Dáng người xinh sao xinh quá. Trông ngẩn ngơ đám trai làng ta. Mới ngày nào quay dây nhảy tiền. Mới ngày nào tung tăng khắp miền. Mà giờ đây Cô Thắm xinh như nàng tiên',
  ],
};

/**
 * Biển số xe các tỉnh thành Việt Nam (mã 2 số đầu).
 * Chỉ chứa các số trong phạm vi 1-60.
 * Số 1-10: không có biển số. Số 13, 42, 44, 45, 46: mã dự trữ.
 * Format: { [số]: "Tên tỉnh/thành phố" }
 */
const licensePlateData = {
  11: 'Cao Bằng',
  12: 'Lạng Sơn',
  14: 'Quảng Ninh',
  15: 'Hải Phòng',
  16: 'Hải Phòng',
  17: 'Thái Bình',
  18: 'Nam Định',
  19: 'Phú Thọ',
  20: 'Thái Nguyên',
  21: 'Yên Bái',
  22: 'Tuyên Quang',
  23: 'Hà Giang',
  24: 'Lào Cai',
  25: 'Lai Châu',
  26: 'Sơn La',
  27: 'Điện Biên',
  28: 'Hòa Bình',
  29: 'Hà Nội',
  30: 'Hà Nội',
  31: 'Hà Nội',
  32: 'Hà Nội',
  33: 'Hà Nội',
  34: 'Hải Dương',
  35: 'Ninh Bình',
  36: 'Thanh Hóa',
  37: 'Nghệ An',
  38: 'Hà Tĩnh',
  39: 'Đồng Nai',
  40: 'Hà Nội',
  41: 'Thành phố Hồ Chí Minh',
  43: 'Đà Nẵng',
  47: 'Đắk Lắk',
  48: 'Đắk Nông',
  49: 'Lâm Đồng',
  50: 'Thành phố Hồ Chí Minh',
  51: 'Thành phố Hồ Chí Minh',
  52: 'Thành phố Hồ Chí Minh',
  53: 'Thành phố Hồ Chí Minh',
  54: 'Thành phố Hồ Chí Minh',
  55: 'Thành phố Hồ Chí Minh',
  56: 'Thành phố Hồ Chí Minh',
  57: 'Thành phố Hồ Chí Minh',
  58: 'Thành phố Hồ Chí Minh',
  59: 'Thành phố Hồ Chí Minh',
  60: 'Đồng Nai',
};

/**
 * Tịch số đề - hình tượng con vật / nhân vật theo số đề Việt Nam.
 * Chu kỳ 40: số 41-60 lặp lại hình tượng của 1-20.
 * Format: { [số]: "tên hình tượng" }
 */
const lotteryAnimalData = {
  1: 'con cá trắng',
  2: 'con ốc',
  3: 'con vịt',
  4: 'con công',
  5: 'con trùng',
  6: 'con cọp',
  7: 'con heo',
  8: 'con thỏ',
  9: 'con trâu',
  10: 'con rồng nằm',
  11: 'con chó',
  12: 'con ngựa',
  13: 'con voi',
  14: 'con mèo nhà',
  15: 'con chuột',
  16: 'con ong',
  17: 'con hạc',
  18: 'con mèo rừng',
  19: 'con bướm',
  20: 'con rết',
  21: 'Thuý Kiều',
  22: 'con bồ câu',
  23: 'con khỉ',
  24: 'con ếch',
  25: 'con ó',
  26: 'con rồng bay',
  27: 'con rùa',
  28: 'con gà',
  29: 'con lươn',
  30: 'con cá đen',
  31: 'con tôm',
  32: 'con rắn',
  33: 'con nhện',
  34: 'con nai',
  35: 'con dê',
  36: 'bà vãi',
  37: 'ông trời',
  38: 'ông địa',
  39: 'thần tài',
  40: 'ông táo',
  41: 'con cá trắng',
  42: 'con ốc',
  43: 'con vịt',
  44: 'con công',
  45: 'con trùng',
  46: 'con cọp',
  47: 'con heo',
  48: 'con thỏ',
  49: 'con trâu',
  50: 'con rồng nằm',
  51: 'con chó',
  52: 'con ngựa',
  53: 'con voi',
  54: 'con mèo nhà',
  55: 'con chuột',
  56: 'con ong',
  57: 'con hạc',
  58: 'con mèo rừng',
  59: 'con bướm',
  60: 'con rết',
};
