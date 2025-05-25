export const DisplayPriceInBath = (price) => {
  
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(price);
};

