
export const formatId = (id) => `#${String(id).padStart(3, '0')}`;


export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';