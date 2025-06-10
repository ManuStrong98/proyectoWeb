'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import './Login.css'

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

// Simulación sin validar: redirigir directamente
    localStorage.setItem('token', 'simulado-token')
    router.push('/juego')
    
    try {
      const response = await axios.post('/api/login', { usuario, password })

      if (response.data.mensaje === 'Login exitoso') {
        localStorage.setItem('token', response.data.token)
        router.push('/pantalla-principal')
      } else {
        setError('Usuario o contraseña incorrectos')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar sesión</h2>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
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
