'use client';
import Login from '@/components/Login';

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Share2, Play, Shuffle, Upload, X } from 'lucide-react'
import GameInterface from "@/components/game-interface"
import Image from "next/image"
import api from '../../src/lib/api'

interface GameConfig {
  enunciado: string
  habitaciones: number[]
  tamañoLista: number
  numeroObjetivo: number
  numeroDeInicio: number
  imagenEnunciado?: string
}

export default function BinarySearchGameConfig() {
  const [enunciado, setEnunciado] = useState("Encuentra la habitación con el número 1337.")
  const [tamañoLista, setTamañoLista] = useState(10)
  const [habitaciones, setHabitaciones] = useState<number[]>([102, 301, 1337, 204, 333, 382, 193, 374, 110, 90])
  const [numeroObjetivo, setNumeroObjetivo] = useState(1337)
  const [numeroDeInicio, setNumeroDeInicio] = useState(850)
  const [habitacionesInput, setHabitacionesInput] = useState("102, 301, 1337, 204, 333, 382, 193, 374, 110, 90")
  const [imagenEnunciado, setImagenEnunciado] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)

  const handleTamañoListaChange = (value: string) => {
    const size = Number.parseInt(value) || 0
    setTamañoLista(size)

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'manolo');
    formData.append('cloud_name', 'dqdq05u7f');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dqdq05u7f/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImagenEnunciado(data.secure_url);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al subir la imagen.');
    }
  }

  const removeImage = () => {
    setImagenEnunciado(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateGameConfig = (): GameConfig => {
    return {
      enunciado,
      habitaciones,
      tamañoLista,
      numeroObjetivo,
      numeroDeInicio,
      imagenEnunciado: imagenEnunciado || undefined,
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

  const handleEnviarAlBackend = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

   if (!token || !userId) {
    alert("⚠️ No se encontró token o ID de usuario. ¿Has iniciado sesión?");
    return;
  }

    const juegoPayload = {
      tipoDeJuego: "hotel_Binario",
      enunciado,
      habitaciones,
      tamanioLista: tamañoLista,
      numeroObjetivo,
      numeroDeInicio,
      enlacePublico: "https://miapp.com/juegos/abc123",
      enlaceDeImagen: imagenEnunciado ?? ""
    };

    try {
    const response = await api.post(
      `/auth/v1/juegos/${userId}`,
      juegoPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
       alert(`✅ ${response.data.message}\nID del juego: ${response.data.juegoId}`);
  } catch (error) {
    console.error("Error al enviar el juego:", error);
    alert("❌ Error al enviar el juego al servidor.");
  }
};

  if (gameStarted && gameConfig) {
    return <GameInterface config={gameConfig} onBack={() => setGameStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-green-900 to-indigo p-4 relative">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-indigo-600 text-white">
            <CardTitle className="text-center py-4">
              <div className="penguin-text">Configurador de Juego</div>
              <div className="penguin-text mt-2">" HOTEL BINARIO "</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagen del Enunciado (Opcional)</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center"
                >
                  <Upload className="w-4 h-4" />
                  Subir Imagen
                </Button>
                {imagenEnunciado && (
                  <Button type="button" variant="ghost" onClick={removeImage}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {imagenEnunciado && (
                <div className="mt-2">
                  <Image src={imagenEnunciado} alt="Enunciado" width={300} height={200} className="rounded shadow" />
                </div>
              )}
            </div>

            <Separator />

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
                <div className="space-y-2">
                  <Label>Vista Previa de Habitaciones</Label>
                  <div className="p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {habitaciones.map((room, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-base font-semibold ${
                            room === numeroObjetivo
                              ? "bg-green-500 text-white font-bold"
                              : "bg-orange-300 text-white-800"
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

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button onClick={handleCompartir} className="custom-game-button">
                <div className="button-content">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartir a tus amigos
                </div>
              </button>
              <button onClick={handleResponderAhora} className="custom-game-button">
                <div className="button-content">
                  <Play className="w-5 h-5 mr-2" />
                  Jugar
                </div>
              </button>
              <button onClick={handleEnviarAlBackend} className="custom-game-button">
                <div className="button-content">
                  <Upload className="w-5 h-5 mr-2" />
                  Enviar al servidor
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
          background: linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FFB84D 100%);
          border: 4px solid #FFFFFF;
          border-radius: 35px;
          cursor: pointer;
          transition: all 0.1s ease;
          box-shadow: 0 6px 0 #000000, 0 8px 15px rgba(0, 0, 0, 0.3);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 640px) {
          .custom-game-button {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  )
}
