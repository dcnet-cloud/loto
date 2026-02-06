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
