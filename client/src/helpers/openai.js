// Gemini AI client
export async function fetchSynopsis({ title, authors }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) throw new Error('Gemini API key not configured')
  
  const prompt = `Tulis ringkasan sinopsis buku dengan detail berikut:
Judul: ${title}
Penulis: ${(authors||[]).join(', ')}

Berikan ringkasan dalam 3-5 kalimat, bahasa Indonesia, padat dan informatif.`

  // Gemini API endpoint
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    })
  })
  
  if (!resp.ok) {
    const error = await resp.json()
    throw new Error(error?.error?.message || 'Gemini API error')
  }
  
  const json = await resp.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}