'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import '../../styles/ModoJuego.css'

export default function ModoJuegoSelector() {
  const router = useRouter()

  return (
    <div className="modo-container">
      <div className="modo-box">
        <h2>Selecciona un juego</h2>
        <button onClick={() => router.push('/juego')}>Hotel Binario</button>
        <button onClick={() => router.push('/viaje-espacial')}>Planeta Congelado</button>
      </div>
    </div>
  )
}
