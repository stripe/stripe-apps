export const statusColorMap = {
  open: 'red',
  pending: 'blue',
  'on-hold': 'gray900',
  solved: 'gray',
};
  
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};