"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Share2, Play, Shuffle } from "lucide-react"
import GameInterface from "@/components/game-interface"

interface GameConfig {
  enunciado: string
  habitaciones: number[]
  tamañoLista: number
  numeroObjetivo: number
  numeroDeInicio: number
}

export default function BinarySearchGameConfig() {
  const [enunciado, setEnunciado] = useState("Encuentra la habitación con el número 1337.")
  const [tamañoLista, setTamañoLista] = useState(10)
  const [habitaciones, setHabitaciones] = useState<number[]>([102, 301, 1337, 204, 333, 382, 193, 374, 110, 90])
  const [numeroObjetivo, setNumeroObjetivo] = useState(1337)
  const [numeroDeInicio, setNumeroDeInicio] = useState(850)
  const [habitacionesInput, setHabitacionesInput] = useState("102, 301, 1337, 204, 333, 382, 193, 374, 110, 90")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)

  const handleTamañoListaChange = (value: string) => {
    const size = Number.parseInt(value) || 0
    setTamañoLista(size)

    // Ajustar la lista de habitaciones si es necesario
    if (size > habitaciones.length) {
      const newRooms = [...habitaciones]
      while (newRooms.length < size) {
        newRooms.push(Math.floor(Math.random() * 1000) + 100)
      }
      setHabitaciones(newRooms)
      setHabitacionesInput(newRooms.join(", "))
    } else if (size < habitaciones.length) {
      const newRooms = habitaciones.slice(0, size)
      setHabitaciones(newRooms)
      setHabitacionesInput(newRooms.join(", "))
    }
  }

  const handleHabitacionesChange = (value: string) => {
    setHabitacionesInput(value)
    try {
      const rooms = value
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num))
      setHabitaciones(rooms)
      setTamañoLista(rooms.length)
    } catch (error) {
      console.error("Error parsing room numbers:", error)
    }
  }

  const autoFillHabitaciones = () => {
    const newRooms: number[] = []
    for (let i = 0; i < tamañoLista; i++) {
      newRooms.push(Math.floor(Math.random() * 1000) + 100)
    }
    setHabitaciones(newRooms)
    setHabitacionesInput(newRooms.join(", "))
  }

  const generateGameConfig = (): GameConfig => {
    return {
      enunciado,
      habitaciones,
      tamañoLista,
      numeroObjetivo,
      numeroDeInicio,
    }
  }

  const handleCompartir = () => {
    const config = generateGameConfig()
    const configString = encodeURIComponent(JSON.stringify(config))
    const shareUrl = `${window.location.origin}?config=${configString}`

    if (navigator.share) {
      navigator.share({
        title: "Juego de Búsqueda Binaria",
        text: "Juega este desafío de búsqueda binaria",
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Link copiado al portapapeles!")
    }
  }

  const handleResponderAhora = () => {
    const config = generateGameConfig()
    console.log("Configuración del juego:", JSON.stringify(config, null, 2))
    setGameConfig(config)
    setGameStarted(true)
  }

  if (gameStarted && gameConfig) {
    return <GameInterface config={gameConfig} onBack={() => setGameStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Configurador de Juego - Búsqueda Binaria</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Enunciado */}
            <div className="space-y-2">
              <Label htmlFor="enunciado" className="text-lg font-semibold">
                Enunciado de la Pregunta
              </Label>
              <Textarea
                id="enunciado"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Describe el objetivo del juego..."
                className="min-h-[80px]"
              />
            </div>

            <Separator />

            {/* Configuración de Habitaciones */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Configuración de Habitaciones</Label>

                <div className="space-y-2">
                  <Label htmlFor="tamano">Tamaño de la Lista</Label>
                  <Input
                    id="tamano"
                    type="number"
                    value={tamañoLista}
                    onChange={(e) => handleTamañoListaChange(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="habitaciones">Números de Habitación</Label>
                  <Textarea
                    id="habitaciones"
                    value={habitacionesInput}
                    onChange={(e) => handleHabitacionesChange(e.target.value)}
                    placeholder="102, 301, 1337, 204..."
                    className="min-h-[100px]"
                  />
                  <Button onClick={autoFillHabitaciones} variant="outline" className="w-full">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Autollenar Lista
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Configuración del Juego</Label>

                <div className="space-y-2">
                  <Label htmlFor="objetivo">Número Objetivo</Label>
                  <Input
                    id="objetivo"
                    type="number"
                    value={numeroObjetivo}
                    onChange={(e) => setNumeroObjetivo(Number.parseInt(e.target.value) || 0)}
                    placeholder="1337"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio">Número de Inicio</Label>
                  <Input
                    id="inicio"
                    type="number"
                    value={numeroDeInicio}
                    onChange={(e) => setNumeroDeInicio(Number.parseInt(e.target.value) || 0)}
                    placeholder="850"
                  />
                </div>

                {/* Vista previa de habitaciones */}
                <div className="space-y-2">
                  <Label>Vista Previa de Habitaciones</Label>
                  <div className="p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {habitaciones.map((room, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            room === numeroObjetivo
                              ? "bg-green-200 text-green-800 font-bold"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleCompartir} variant="outline" size="lg" className="flex-1 max-w-xs">
                <Share2 className="w-5 h-5 mr-2" />
                Compartir a tus amigos
              </Button>

              <Button
                onClick={handleResponderAhora}
                size="lg"
                className="flex-1 max-w-xs bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Responder Ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
