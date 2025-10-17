export function initGoogle(callback) {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!id) { console.warn('Missing VITE_GOOGLE_CLIENT_ID'); return }

  if (!document.getElementById('google-client')) {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.id = 'google-client'
    document.head.appendChild(s)
    s.onload = () => renderBtn(callback)
  } else {
    renderBtn(callback)
  }

  function renderBtn(cb){
    /* global google */
    if (!window.google?.accounts?.id) return
    google.accounts.id.initialize({
      client_id: id,
      callback: (resp)=> cb(resp.credential)
    })
    const div = document.getElementById('googleSignInDiv')
    if (div) {
      google.accounts.id.renderButton(div, { theme:'outline', size:'large', type:'standard', text:'continue_with' })
    }
  }
}