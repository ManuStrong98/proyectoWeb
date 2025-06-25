"use client"

import { useState, useEffect } from "react"
import GalaxiaGameInterface from "@/components/game-galaxia"

type JuegoData = {
  id: number
  enunciado: string
  habitaciones: number[]
  tamanio_lista: number
  numero_objetivo: number
  numero_de_inicio: number
  fecha_creacion: string
  enlace_publico: string
  enlace_de_imagen: string
  tipo_de_juego: string
}

interface Nodo {
  value: number
  left: Nodo | null
  right: Nodo | null
}

interface GameConfig {
  enunciado: string
  planetas: number[]
  cantidadPlanetas: number
  temperaturaObjetivo: number
  temperaturaInicial: number
  bst: Nodo | null
}

export default function GalacticoJuego({ juego }: { juego: JuegoData }) {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)

  // Construir BST balanceado igual que en el editor
  const construirBSTBalanceado = (valores: number[], objetivo: number): Nodo | null => {
    console.log("🌳 Construyendo BST con valores:", valores)
    console.log("🎯 Objetivo:", objetivo)

    const valoresUnicos = Array.from(new Set([...valores, objetivo]))
    const ordenados = valoresUnicos.sort((a, b) => a - b)

    console.log("📊 Valores únicos ordenados:", ordenados)

    const construir = (inicio: number, fin: number): Nodo | null => {
      if (inicio > fin) return null

      const medio = Math.floor((inicio + fin) / 2)
      const nodo: Nodo = {
        value: ordenados[medio],
        left: construir(inicio, medio - 1),
        right: construir(medio + 1, fin),
      }
      return nodo
    }

    const bst = construir(0, ordenados.length - 1)
    console.log("✅ BST construido, raíz:", bst?.value)
    return bst
  }

  useEffect(() => {
    console.log("🚀 GalacticoJuego iniciando con juego:", juego)

    if (juego) {
      try {
        // Convertir los datos del juego al formato que espera GalaxiaGameInterface
        const planetas = Array.isArray(juego.habitaciones) ? juego.habitaciones : JSON.parse(juego.habitaciones || "[]")

        console.log("🪐 Planetas parseados:", planetas)

        const temperaturaObjetivo = juego.numero_objetivo

        // Construir el BST
        const bst = construirBSTBalanceado(planetas, temperaturaObjetivo)

        // La temperatura inicial es la raíz del BST
        const temperaturaInicial = bst?.value || juego.numero_de_inicio

        const config: GameConfig = {
          enunciado: juego.enunciado,
          planetas: planetas,
          cantidadPlanetas: juego.tamanio_lista,
          temperaturaObjetivo: temperaturaObjetivo,
          temperaturaInicial: temperaturaInicial,
          bst: bst,
        }

        console.log("⚙️ Configuración del juego generada:", config)
        setGameConfig(config)
      } catch (error) {
        console.error("❌ Error al procesar datos del juego:", error)
      }
    }
  }, [juego])

  if (!gameConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Cargando misión galáctica...</p>
          <p className="text-sm text-gray-300 mt-2">Procesando datos del juego ID: {juego?.id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-blue-900">
      <GalaxiaGameInterface
        config={gameConfig}
        onBack={() => {
          console.log("🔙 Volviendo...")
          window.history.back()
        }}
      />
    </div>
  )
}
