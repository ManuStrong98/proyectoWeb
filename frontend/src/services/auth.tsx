import api from '../lib/api'

export const login = async (correo: string, password: string) => {
  const response = await api.post('/v1/login', { correo, password })
  const { token, user } = response.data
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  return { token, user }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

