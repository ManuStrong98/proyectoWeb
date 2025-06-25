import { useState } from 'react'
import { login as loginService } from '../services/auth'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async (correo: string, password: string) => {
    try {
      await loginService(correo, password)
      router.push('/modo-juego')
    } catch (err: any) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return { login, error }
}

