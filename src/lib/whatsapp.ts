export const WA_NUMBER = '601151198497';
export const WA_DISPLAY = '+60 11-5119 8497';
export const waLink = (text = 'Hello Awanara Langkawi, I would like to enquire about a stay.') =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
