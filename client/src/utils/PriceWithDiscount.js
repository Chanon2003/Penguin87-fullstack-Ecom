// export const PriceWithDiscount = (price,discount = 1)=>{
//   const discountAmout = Math.ceil((Number(price) * Number(discount)) / 100)
//   const actualPrice = Number(price) - Number(discountAmout)
//   return actualPrice
// }

export const PriceWithDiscount = (price, discount = 1) => {
  const discountAmount = (Number(price) * Number(discount)) / 100;  // คำนวณส่วนลดตามจริง
  const actualPrice = Number(price) - discountAmount;  // ราคาหลังหักส่วนลด
  return actualPrice;
}