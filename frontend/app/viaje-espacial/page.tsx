'use client';

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Share2, Play, Shuffle } from 'lucide-react'
import GameInterface from "@/components/game-interface"

interface GameConfig {
  enunciado: string
  planetas: number[]
  cantidadPlanetas: number
  temperaturaObjetivo: number
  temperaturaInicial: number
}

export default function ExploracionGalacticaGameConfig() {
  const [enunciado, setEnunciado] = useState("Encuentra el planeta con una temperatura exacta de 90°C.\nUsa los portales para viajar entre mundos hasta encontrarlo.")
  const [cantidadPlanetas, setCantidadPlanetas] = useState(10)
  const [planetas, setPlanetas] = useState<number[]>([102, 301, 90, 204, 333, 382, 193, 374, 110, 290])
  const [temperaturaObjetivo, setTemperaturaObjetivo] = useState(90)
  const [temperaturaInicial, setTemperaturaInicial] = useState(301)
  const [planetasInput, setPlanetasInput] = useState("102, 301, 90, 204, 333, 382, 193, 374, 110, 290")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)

  const handleCantidadPlanetasChange = (value: string) => {
    const size = Number.parseInt(value) || 0
    setCantidadPlanetas(size)

    if (size > planetas.length) {
      const newPlanets = [...planetas]
      while (newPlanets.length < size) {
        newPlanets.push(Math.floor(Math.random() * 1000) + 100)
      }
      setPlanetas(newPlanets)
      setPlanetasInput(newPlanets.join(", "))
    } else if (size < planetas.length) {
      const newPlanets = planetas.slice(0, size)
      setPlanetas(newPlanets)
      setPlanetasInput(newPlanets.join(", "))
    }
  }

  const handlePlanetasChange = (value: string) => {
    setPlanetasInput(value)
    try {
      const numbers = value
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num))
      setPlanetas(numbers)
      setCantidadPlanetas(numbers.length)
    } catch (error) {
      console.error("Error parsing planet temperatures:", error)
    }
  }

  const autoFillPlanetas = () => {
    const newPlanets: number[] = []
    for (let i = 0; i < cantidadPlanetas; i++) {
      newPlanets.push(Math.floor(Math.random() * 1000) + 100)
    }
    setPlanetas(newPlanets)
    setPlanetasInput(newPlanets.join(", "))
  }

  const generateGameConfig = (): GameConfig => {
    return {
      enunciado,
      planetas,
      cantidadPlanetas,
      temperaturaObjetivo,
      temperaturaInicial,
    }
  }

  const handleCompartir = () => {
    const config = generateGameConfig()
    const configString = encodeURIComponent(JSON.stringify(config))
    const shareUrl = `${window.location.origin}?config=${configString}`

    if (navigator.share) {
      navigator.share({
        title: "Exploración Galáctica",
        text: "Juega esta misión interplanetaria",
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Link copiado al portapapeles!")
    }
  }

  const handleIniciarMision = () => {
    const config = generateGameConfig()
    console.log("Configuración del juego galáctico:", JSON.stringify(config, null, 2))
    setGameConfig(config)
    setGameStarted(true)
  }

  if (gameStarted && gameConfig) {
    return <GameInterface config={gameConfig} onBack={() => setGameStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-blue-900 text-white font-mono p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-indigo-400">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-700 text-white">
            <CardTitle className="text-center py-4 text-2xl">
              CONFIGURADOR DE JUEGO "EXPLORACIÓN GALÁCTICA"
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enunciado" className="text-lg font-semibold">Enunciado de la Misión</Label>
              <Textarea
                id="enunciado"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Describe la misión galáctica..."
                className="min-h-[80px] text-black"
              />
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Configuración de Planetas</Label>
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad de Planetas</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    value={cantidadPlanetas}
                    onChange={(e) => handleCantidadPlanetasChange(e.target.value)}
                    min="1"
                    max="50"
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planetas">Temperaturas de los Planetas</Label>
                  <Textarea
                    id="planetas"
                    value={planetasInput}
                    onChange={(e) => handlePlanetasChange(e.target.value)}
                    placeholder="102, 301, 90, 204..."
                    className="min-h-[100px] text-black"
                  />
                  <Button onClick={autoFillPlanetas} variant="outline" className="w-full text-white">
                    <Shuffle className="w-4 h-4 mr-2" />Autollenar Temperaturas
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Parámetros de Exploración</Label>
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Temperatura Objetivo</Label>
                  <Input
                    id="objetivo"
                    type="number"
                    value={temperaturaObjetivo}
                    onChange={(e) => setTemperaturaObjetivo(Number.parseInt(e.target.value) || 0)}
                    placeholder="90"
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio">Temperatura Inicial</Label>
                  <Input
                    id="inicio"
                    type="number"
                    value={temperaturaInicial}
                    onChange={(e) => setTemperaturaInicial(Number.parseInt(e.target.value) || 0)}
                    placeholder="301"
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vista Previa de Temperaturas</Label>
                  <div className="p-3 bg-slate-100 rounded-md max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {planetas.map((temp, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-base font-semibold ${
                            temp === temperaturaObjetivo ? "bg-green-500 text-white" : "bg-purple-400 text-white"
                          }`}
                        >
                          {temp}°C
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button onClick={handleCompartir} className="custom-game-button">
                <div className="button-content">
                  <Share2 className="w-5 h-5 mr-2" /> Compartir misión galáctica
                </div>
              </button>

              <button onClick={handleIniciarMision} className="custom-game-button">
                <div className="button-content">
                  <Play className="w-5 h-5 mr-2" /> Explorar ahora
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .custom-game-button {
          position: relative;
          width: 280px;
          height: 60px;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #6b21a8 100%);
          border: 4px solid #ffffff;
          border-radius: 35px;
          cursor: pointer;
          transition: all 0.1s ease;
          box-shadow: 0 6px 0 #000000, 0 8px 15px rgba(0, 0, 0, 0.3);
          font-family: 'Courier New', monospace;
        }

        .custom-game-button:hover {
          transform: translateY(2px);
          box-shadow: 0 4px 0 #000000, 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .custom-game-button:active {
          transform: translateY(6px);
          box-shadow: 0 0px 0 #000000, 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}