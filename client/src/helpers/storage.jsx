export const loadJSON = (k, fallback=null) => {
  try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)) } catch { return fallback }
}
export const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v))