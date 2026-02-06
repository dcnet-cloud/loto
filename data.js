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

/**
 * Ca dao, tục ngữ Việt Nam có chứa số.
 * Câu hỏi dạng: đọc câu ca dao → người nghe đoán số.
 * Format: { [số]: ["câu hỏi 1", "câu hỏi 2", ...] }
 */
const proverbData = {
  1: [
    'Nhất nghệ tinh nhất thân vinh, nhất là số mấy?',
    'Nhất cận thị nhị cận giang, nhất là số mấy?',
    'Một con sâu làm rầu nồi canh, mấy con sâu?',
    'Một giọt máu đào hơn ao nước lã, mấy giọt?',
    'Một mất mười ngờ, mất mấy?',
  ],
  2: [
    'Đôi ta như đũa có đôi, đôi là số mấy?',
    'Nhất cận thị nhị cận giang, nhị là số mấy?',
    'Hai sương một nắng, mấy sương?',
    'Đôi bạn cùng tiến, đôi là số mấy?',
  ],
  3: [
    'Một cây làm chẳng nên non, mấy cây chụm lại nên hòn núi cao?',
    'Ba mặt một lời, mấy mặt?',
    'Tam sao thất bản, tam là số mấy?',
    'Không ai giàu ba họ, giàu mấy họ?',
    'Ba đồng một mớ trầu cay, mấy đồng?',
    'Ba chân bốn cẳng, mấy chân?',
  ],
  4: [
    'Bốn biển một nhà, mấy biển?',
    'Tứ đổ tường, tứ là số mấy?',
    'Bốn mùa xuân hạ thu đông, mấy mùa?',
    'Tứ phía tám phương, tứ là số mấy?',
  ],
  5: [
    'Năm cha ba mẹ, mấy cha?',
    'Ngũ hành kim mộc thủy hỏa thổ, ngũ là số mấy?',
    'Năm nắng mười mưa, mấy nắng?',
  ],
  6: [
    'Sáu câu vọng cổ, mấy câu?',
    'Lục bình trôi sông, lục là số mấy?',
    'Thất tình lục dục, lục là số mấy?',
  ],
  7: [
    'Ba chìm bảy nổi chín cái lênh đênh, mấy nổi?',
    'Thất bại là mẹ thành công, thất là số mấy?',
    'Thất tình lục dục, thất là số mấy?',
  ],
  8: [
    'Bốn phương tám hướng, mấy hướng?',
    'Bát tiên quá hải, bát là số mấy?',
    'Tứ phía tám phương, mấy phương?',
  ],
  9: [
    'Ba chìm bảy nổi mấy cái lênh đênh?',
    'Cửu Long giang, cửu là số mấy?',
    'Một điều nhịn chín điều lành, mấy điều lành?',
  ],
  10: [
    'Chín bỏ làm mười, chín bỏ làm bao nhiêu?',
    'Thập toàn thập mỹ, thập là số mấy?',
    'Năm nắng mười mưa, mấy mưa?',
    'Học một biết mười, biết bao nhiêu?',
    'Một mất mười ngờ, mười ngờ là số mấy?',
  ],
  12: [
    'Mười hai bến nước, mấy bến nước?',
    'Một năm mười hai tháng, mấy tháng?',
    'Mười hai con giáp, mấy con giáp?',
  ],
  13: [
    'Gái thập tam nam thập lục, thập tam là số mấy?',
  ],
  15: [
    'Rằm tháng Giêng, rằm là ngày mấy?',
  ],
  16: [
    'Gái thập tam nam thập lục, thập lục là số mấy?',
  ],
  18: [
    'Tuổi mười tám đôi mươi, mười tám là số mấy?',
  ],
  20: [
    'Tuổi đôi mươi, đôi mươi là số mấy?',
    'Tuổi mười tám đôi mươi, đôi mươi là số mấy?',
  ],
  30: [
    'Ba mươi chưa phải là Tết, số mấy chưa phải Tết?',
  ],
  36: [
    'Ba mươi sáu chước, chước chuồn là hơn, tất cả mấy chước?',
  ],
  40: [
    'Tứ tuần đại khánh, tứ tuần là mấy tuổi?',
  ],
  50: [
    'Năm mươi tri thiên mệnh, mấy tuổi tri thiên mệnh?',
    'Ngũ tuần, ngũ tuần là bao nhiêu tuổi?',
  ],
  60: [
    'Lục tuần hoa giáp, lục tuần là mấy tuổi?',
  ],
};

/**
 * Câu đố vui — đáp án là con số.
 * Format: { [số]: ["câu đố 1", "câu đố 2", ...] }
 */
const riddleData = {
  1: ['Nhất là đầu tiên, nhất là số mấy?'],
  2: ['Con người có mấy con mắt?', 'Xe đạp có mấy bánh?'],
  3: ['Tam giác có mấy cạnh?', 'Đèn giao thông có mấy màu?'],
  4: ['Xe hơi thường có mấy bánh?', 'Một năm có mấy mùa?'],
  5: ['Bàn tay có mấy ngón?', 'Ngôi sao trên lá cờ Việt Nam có mấy cánh?'],
  6: ['Con côn trùng có mấy chân?', 'Đàn guitar có mấy dây?', 'Bóng chuyền mỗi đội mấy người trên sân?'],
  7: ['Cầu vồng có mấy sắc màu?', 'Một tuần lễ có mấy ngày?', 'Đồ rê mi fa sol la si, có mấy nốt nhạc?'],
  8: ['Con bạch tuộc có mấy xúc tu?', 'Con nhện có mấy chân?'],
  9: ['Hệ mặt trời có mấy hành tinh?', 'Con mèo có mấy mạng?'],
  10: ['Hai bàn tay có tổng cộng mấy ngón?', 'Một thập kỷ là mấy năm?'],
  11: ['Đội bóng đá mỗi bên ra sân mấy cầu thủ?', 'Đông Nam Á có mấy quốc gia?'],
  12: ['Một năm có mấy tháng?', 'Trên mặt đồng hồ có mấy con số?', 'Mười hai con giáp, có mấy con?'],
  13: ['Số mấy bị xem là xui xẻo ở phương Tây?', 'Thứ sáu ngày mấy là ngày xui?'],
  14: ['Ngày Valentine là ngày mấy tháng hai?'],
  15: ['Một khắc đồng hồ bằng mấy phút?', 'Bàn bi-a có mấy viên bi màu?'],
  16: ['Bốn nhân bốn bằng mấy?', 'Ván cờ vua mỗi bên có mấy quân?'],
  17: ['Tuổi vị thành niên kết thúc khi mấy tuổi?'],
  18: ['Mấy tuổi được coi là trưởng thành ở Việt Nam?', 'Tuổi được đi bầu cử là mấy?'],
  20: ['Một chục đôi là bao nhiêu?', 'Hai mươi ngón tay chân cộng lại, mấy ngón?'],
  21: ['Trong bài Xì Dách, điểm lớn nhất không bị quắc là mấy?'],
  23: ['Con người có mấy cặp nhiễm sắc thể?'],
  24: ['Một ngày có mấy tiếng đồng hồ?'],
  25: ['Kỷ niệm cưới bạc là bao nhiêu năm?'],
  26: ['Bảng chữ cái tiếng Anh có mấy chữ cái?'],
  28: ['Tháng hai thường có mấy ngày?', 'Chu kỳ kinh nguyệt trung bình mấy ngày?'],
  29: ['Tháng hai năm nhuận có mấy ngày?', 'Bảng chữ cái tiếng Việt có mấy chữ cái?'],
  30: ['Tháng tư có mấy ngày?'],
  31: ['Tháng một có mấy ngày?'],
  32: ['Nước đóng băng ở mấy độ Fahrenheit?', 'Hai mũ năm bằng mấy?'],
  33: ['Số điện thoại cứu hỏa ở Việt Nam là số mấy?'],
  34: ['Tỉnh nào có mã biển số ba bốn?'],
  35: ['Năm nhân bảy bằng mấy?'],
  36: ['Sáu nhân sáu bằng mấy?'],
  37: ['Thân nhiệt bình thường của cơ thể người khoảng mấy độ C?'],
  38: ['Vĩ tuyến mấy chia cắt hai miền Triều Tiên?'],
  39: ['Thần tài trong tịch số đề mang số mấy?'],
  40: ['Ali Baba và mấy tên cướp?'],
  41: ['Số đầu biển số xe Sài Gòn xưa nhất là mấy?'],
  42: ['Sáu nhân bảy bằng mấy?'],
  43: ['Thành phố nào có mã biển số bốn ba?'],
  44: ['Obama là tổng thống thứ mấy của nước Mỹ?'],
  45: ['Trump nhiệm kỳ đầu là tổng thống thứ mấy của Mỹ?'],
  46: ['Biden là tổng thống thứ mấy của nước Mỹ?'],
  47: ['Trump nhiệm kỳ hai là tổng thống thứ mấy của Mỹ?'],
  48: ['Bốn nhân mười hai bằng mấy?'],
  49: ['Bảy nhân bảy bằng mấy?'],
  50: ['Nửa thế kỷ là mấy năm?', 'Kỷ niệm cưới vàng là bao nhiêu năm?'],
  51: ['Khu vực bí mật nổi tiếng ở Mỹ tên Khu vực mấy?'],
  52: ['Một năm có bao nhiêu tuần lễ?', 'Bộ bài tây không tính Joker có mấy lá?'],
  53: ['Việt Nam có bao nhiêu tỉnh thành trừ mười?'],
  54: ['Việt Nam có tất cả bao nhiêu dân tộc anh em?'],
  55: ['Năm lần mười một bằng mấy?'],
  56: ['Bảy nhân tám bằng mấy?'],
  57: ['Ba nhân mười chín bằng mấy?'],
  58: ['Hai nhân hai mươi chín bằng mấy?'],
  59: ['Số nguyên tố lớn nhất dưới sáu mươi là số mấy?'],
  60: ['Một giờ có mấy phút?', 'Một phút có mấy giây?'],
};

/**
 * Số áo cầu thủ / vận động viên nổi tiếng.
 * Format: { [số]: [{ player: "Tên", team: "Đội" }, ...] }
 */
const footballData = {
  1: [
    { player: 'Buffon', team: 'Juventus' },
    { player: 'Manuel Neuer', team: 'Bayern Munich' },
  ],
  2: [
    { player: 'Cafu', team: 'AC Milan' },
    { player: 'Dani Alves', team: 'Barcelona' },
  ],
  3: [
    { player: 'Paolo Maldini', team: 'AC Milan' },
    { player: 'Gerard Piqué', team: 'Barcelona' },
  ],
  4: [
    { player: 'Sergio Ramos', team: 'Real Madrid' },
    { player: 'Virgil van Dijk', team: 'Liverpool' },
  ],
  5: [
    { player: 'Zinedine Zidane', team: 'Real Madrid' },
    { player: 'Beckenbauer', team: 'Bayern Munich' },
  ],
  6: [
    { player: 'Xavi', team: 'Barcelona' },
    { player: 'Paul Pogba', team: 'Manchester United' },
  ],
  7: [
    { player: 'Cristiano Ronaldo', team: 'Manchester United' },
    { player: 'David Beckham', team: 'Manchester United' },
    { player: 'Sơn Heung-min', team: 'Tottenham' },
  ],
  8: [
    { player: 'Andrés Iniesta', team: 'Barcelona' },
    { player: 'Steven Gerrard', team: 'Liverpool' },
    { player: 'Frank Lampard', team: 'Chelsea' },
  ],
  9: [
    { player: 'Ronaldo béo', team: 'Real Madrid' },
    { player: 'Lewandowski', team: 'Bayern Munich' },
    { player: 'Benzema', team: 'Real Madrid' },
  ],
  10: [
    { player: 'Lionel Messi', team: 'Barcelona' },
    { player: 'Maradona', team: 'Argentina' },
    { player: 'Pelé', team: 'Brazil' },
    { player: 'Công Phượng', team: 'đội tuyển Việt Nam' },
  ],
  11: [
    { player: 'Neymar', team: 'Barcelona' },
    { player: 'Mohamed Salah', team: 'Liverpool' },
    { player: 'Didier Drogba', team: 'Chelsea' },
  ],
  13: [
    { player: 'Michael Ballack', team: 'Chelsea' },
    { player: 'Nesta', team: 'AC Milan' },
  ],
  14: [
    { player: 'Thierry Henry', team: 'Arsenal' },
    { player: 'Johan Cruyff', team: 'Barcelona' },
  ],
  17: [
    { player: 'Kevin De Bruyne', team: 'Manchester City' },
  ],
  18: [
    { player: 'Paul Scholes', team: 'Manchester United' },
  ],
  19: [
    { player: 'Quang Hải', team: 'đội tuyển Việt Nam' },
    { player: 'Sadio Mané', team: 'Liverpool' },
  ],
  20: [
    { player: 'Robin van Persie', team: 'Manchester United' },
  ],
  21: [
    { player: 'Andrea Pirlo', team: 'Juventus' },
    { player: 'David Silva', team: 'Manchester City' },
  ],
  22: [
    { player: 'Kaká', team: 'AC Milan' },
  ],
  23: [
    { player: 'David Beckham', team: 'Real Madrid' },
    { player: 'Michael Jordan', team: 'Chicago Bulls' },
  ],
  24: [
    { player: 'Kobe Bryant', team: 'LA Lakers' },
  ],
  25: [
    { player: 'Thomas Müller', team: 'Bayern Munich' },
  ],
  30: [
    { player: 'Lionel Messi', team: 'PSG' },
    { player: 'Stephen Curry', team: 'Golden State Warriors' },
  ],
};

/**
 * Ngày tháng lịch sử / ngày lễ Việt Nam và thế giới.
 * Format: { [số]: ["câu hỏi 1", "câu hỏi 2", ...] }
 */
const historyDateData = {
  1: [
    'Ngày Quốc tế Lao động là ngày mấy tháng năm?',
    'Ngày Quốc tế Thiếu nhi là ngày mấy tháng sáu?',
  ],
  2: [
    'Quốc khánh Việt Nam là ngày mấy tháng chín?',
  ],
  3: [
    'Ngày thành lập Đảng Cộng sản Việt Nam là ngày mấy tháng hai?',
  ],
  7: [
    'Chiến thắng Điện Biên Phủ ngày mấy tháng năm năm 1954?',
  ],
  8: [
    'Ngày Quốc tế Phụ nữ là ngày mấy tháng ba?',
  ],
  10: [
    'Ngày Giải phóng Thủ đô Hà Nội là ngày mấy tháng mười?',
  ],
  14: [
    'Ngày lễ Tình nhân Valentine là ngày mấy tháng hai?',
  ],
  15: [
    'Tết Trung thu là rằm tháng tám, rằm là ngày mấy?',
  ],
  19: [
    'Sinh nhật Bác Hồ là ngày mấy tháng năm?',
  ],
  20: [
    'Ngày Nhà giáo Việt Nam là ngày mấy tháng mười một?',
  ],
  22: [
    'Ngày thành lập Quân đội Nhân dân Việt Nam là ngày mấy tháng mười hai?',
  ],
  25: [
    'Ngày lễ Giáng sinh Noel là ngày mấy tháng mười hai?',
  ],
  26: [
    'Ngày thành lập Đoàn Thanh niên là ngày mấy tháng ba?',
  ],
  27: [
    'Ngày Thương binh Liệt sĩ là ngày mấy tháng bảy?',
  ],
  30: [
    'Ngày Giải phóng miền Nam thống nhất đất nước là ngày mấy tháng tư?',
  ],
};
