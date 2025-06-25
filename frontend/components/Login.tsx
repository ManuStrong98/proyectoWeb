'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '../src/hooks/useAuth'
import './Login.css'

const Login: React.FC = () => {

const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const { login, error } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(correo, password)
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

