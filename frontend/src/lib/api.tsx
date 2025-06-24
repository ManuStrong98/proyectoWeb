import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  headers: {
    'Content-Type': 'application/json',
  },
})
export const getJuego = (id: string, tipo_de_juego: string) => {
  return api.get(`/juego/${id}/${tipo_de_juego}`).then(res => res.data)
}


export default api

