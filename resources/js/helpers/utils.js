export const moneyFormat = (number = 0, locale = 'en-PH', currency = 'PHP') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number);
};

export const getPercentage = (number, percent) => {
  return (percent / 100) * number;
};

export const camelCase = string => string.charAt(0).toUpperCase() + string.slice(1);