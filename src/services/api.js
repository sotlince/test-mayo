//const BASE_URL = 'https://tu-backend.com/api' //
const BASE_URL = 'http://localhost:4000/api'  

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}
