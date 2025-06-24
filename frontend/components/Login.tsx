'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import './Login.css'

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    console.log('hola mundo')
    try {
      const response = await axios.post('http://localhost:3001/v1/login', {
        correo,
        password,
      })
    console.log('Respuesta del backend:', response.data)
      if (response.data.token) {
        // Guardamos el token y los datos del usuario si quieres
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('usuario', JSON.stringify(response.data.user))
        router.push('/modo-juego')
      } else {
        setError('Credenciales incorrectas')
      }
      } catch (err: any) {
  console.error('Error completo:', err)
  if (err.response) {
    console.error('Respuesta del servidor:', err.response.data)
    setError(`Error: ${err.response.data?.mensaje || 'Credenciales incorrectas'}`)
  } else if (err.request) {
    console.error('No se recibió respuesta del servidor:', err.request)
    setError('No se recibió respuesta del servidor')
  } else {
    console.error('Error al configurar la solicitud:', err.message)
    setError('Error al configurar la solicitud')
  }
}

  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar sesión</h2>
        <div>
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default Login

