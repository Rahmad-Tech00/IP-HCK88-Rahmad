export const debounce = (fn, wait=400) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(()=>fn(...args), wait)
  }
}
