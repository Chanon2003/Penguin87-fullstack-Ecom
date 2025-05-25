export const PriceWithDiscount = (price, discount = 0) => {
  // ตรวจสอบว่า price และ discount เป็นตัวเลข
  const parsedPrice = Number(price);
  const parsedDiscount = Number(discount);

  if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
    throw new Error('Discount should be between 0 and 100');
  }

  const discountAmount = (parsedPrice * parsedDiscount) / 100;  // คำนวณส่วนลด
  const actualPrice = parsedPrice - discountAmount;  // ราคาหลังหักส่วนลด

  return actualPrice.toFixed(2);  
  // return Math.round(actualPrice);  // คืนค่าราคาหลังหักส่วนลดในรูปแบบทศนิยม 2 ตำแหน่ง
};
