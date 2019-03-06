export function indexOfArray(arr, key, value) {
  let index = -1;
  arr.forEach((item, i) => {
    if (item[key] === value) {
      index = i;
    }
  });
  return index;
}
