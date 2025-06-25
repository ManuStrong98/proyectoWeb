"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Share2, Play, Shuffle, Upload } from "lucide-react"
import GalaxiaGameInterface from "@/components/game-galaxia"
import api from "../../src/lib/api"

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

export default function ExploracionGalacticaGameConfig() {
  const handleEnviarAlBackend = async () => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const userId = user.id

    if (!token || !userId) {
      alert("⚠️ No se encontró token o ID de usuario. ¿Has iniciado sesión?")
      return
    }

    if (!planetas || planetas.length === 0) {
      alert("⚠️ La lista de planetas está vacía")
      return
    }

    // Validar que el objetivo esté en la lista
    if (!planetas.includes(temperaturaObjetivo)) {
      alert("⚠️ La temperatura objetivo debe estar en la lista de planetas")
      return
    }

    // Calcular temperaturaInicial para evitar enviar 0 o null
    const arbol = construirBSTBalanceado(planetas)
    const temperaturaInicialCalculada = arbol?.value || temperaturaObjetivo

    // Asegurar que todos los valores sean válidos y no null
    const planetasValidos = planetas.filter((p) => typeof p === "number" && !isNaN(p))
    const tamanioLista = planetasValidos.length

    // Validar que tengamos datos válidos
    if (tamanioLista === 0) {
      alert("⚠️ No hay planetas válidos en la lista")
      return
    }

    if (!enunciado.trim()) {
      alert("⚠️ El enunciado no puede estar vacío")
      return
    }

    if (!temperaturaObjetivo || isNaN(temperaturaObjetivo)) {
      alert("⚠️ La temperatura objetivo debe ser un número válido")
      return
    }

    if (!temperaturaInicialCalculada || isNaN(temperaturaInicialCalculada)) {
      alert("⚠️ Error calculando la temperatura inicial")
      return
    }

    // Crear payload con todos los campos requeridos explícitamente
    const juegoPayload = {
      tipoDeJuego: "galactico", // Cambiar de "exploracion_galactica" a "galactico"
      enunciado: enunciado.trim(),
      habitaciones: planetasValidos, // Array de temperaturas de planetas
      tamanioLista: Number(tamanioLista),
      numeroObjetivo: Number(temperaturaObjetivo),
      numeroDeInicio: Number(temperaturaInicialCalculada),
      enlacePublico: `${window.location.origin}/juego/${userId}/galactico`,
      enlaceDeImagen: "", // Puedes agregar soporte para imágenes más tarde
    }

    // Log detallado para debug
    console.log("=== DEBUG PAYLOAD ===")
    console.log("Planetas originales:", planetas)
    console.log("Planetas válidos:", planetasValidos)
    console.log("Tamaño lista:", tamanioLista)
    console.log("Temperatura objetivo:", temperaturaObjetivo)
    console.log("Temperatura inicial:", temperaturaInicialCalculada)
    console.log("Payload completo:", JSON.stringify(juegoPayload, null, 2))
    console.log("Tipos de datos:")
    console.log("- tipo_de_juego:", typeof juegoPayload.tipoDeJuego)
    console.log("- enunciado:", typeof juegoPayload.enunciado)
    console.log("- habitaciones:", Array.isArray(juegoPayload.habitaciones), juegoPayload.habitaciones.length)
    console.log("- tamanio_lista:", typeof juegoPayload.tamanioLista, juegoPayload.tamanioLista)
    console.log("- numero_objetivo:", typeof juegoPayload.numeroObjetivo, juegoPayload.numeroObjetivo)
    console.log("- numero_de_inicio:", typeof juegoPayload.numeroDeInicio, juegoPayload.numeroDeInicio)

    try {
      const response = await api.post(`/auth/v1/juegos/${userId}`, juegoPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 segundos timeout
      })

      console.log("Respuesta exitosa:", response.data)
      alert(`✅ Juego galáctico guardado exitosamente!`)
    } catch (error: any) {
      console.error("Error completo:", error)

      if (error.response) {
        console.error("Error status:", error.response.status)
        console.error("Error data:", error.response.data)

        const errorMessage =
          error.response.data?.message || error.response.data?.error || `Error ${error.response.status}`

        alert(`❌ Error del servidor (${error.response.status}): ${errorMessage}`)

        if (error.response.status === 500) {
          console.log("🔍 PAYLOAD QUE CAUSÓ EL ERROR 500:")
          console.log(JSON.stringify(juegoPayload, null, 2))
          alert(`🔍 Debug info - Revisa la consola para ver el payload enviado`)
        }
      } else if (error.request) {
        console.error("Error request:", error.request)
        alert("❌ Sin respuesta del servidor. Verifica que el backend esté funcionando.")
      } else {
        console.error("Error config:", error.message)
        alert(`❌ Error en la configuración: ${error.message}`)
      }
    }
  }

  const [enunciado, setEnunciado] = useState(
    "Encuentra el planeta con una temperatura exacta de 90°C.\nUsa la búsqueda binaria: compara la temperatura actual con tu objetivo y decide si ir a planetas más fríos (izquierda) o más calientes (derecha).",
  )
  const [cantidadPlanetas, setCantidadPlanetas] = useState(15)
  const [planetas, setPlanetas] = useState<number[]>([
    102, 301, 90, 204, 333, 382, 193, 374, 110, 290, 150, 75, 425, 50, 180,
  ])
  const [temperaturaObjetivo, setTemperaturaObjetivo] = useState(90)
  const [temperaturaInicial, setTemperaturaInicial] = useState(0) // Se calculará automáticamente
  const [planetasInput, setPlanetasInput] = useState(
    "102, 301, 90, 204, 333, 382, 193, 374, 110, 290, 150, 75, 425, 50, 180",
  )
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)

  const construirBSTBalanceado = (valores: number[]): Nodo | null => {
    // Asegurar que el objetivo esté incluido y eliminar duplicados
    const valoresUnicos = Array.from(new Set([...valores, temperaturaObjetivo]))
    const ordenados = valoresUnicos.sort((a, b) => a - b)

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

    return construir(0, ordenados.length - 1)
  }

  const handleCantidadPlanetasChange = (value: string) => {
    const size = Number.parseInt(value) || 0
    setCantidadPlanetas(size)

    if (size > planetas.length) {
      const newPlanets = [...planetas]
      while (newPlanets.length < size) {
        let newTemp
        do {
          newTemp = Math.floor(Math.random() * 400) + 50 // Temperaturas entre 50-450
        } while (newPlanets.includes(newTemp)) // Evitar duplicados
        newPlanets.push(newTemp)
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
    const usedTemps = new Set<number>()

    // Asegurar que el objetivo esté incluido
    newPlanets.push(temperaturaObjetivo)
    usedTemps.add(temperaturaObjetivo)

    for (let i = 1; i < cantidadPlanetas; i++) {
      let newTemp
      do {
        newTemp = Math.floor(Math.random() * 400) + 50 // Temperaturas entre 50-450
      } while (usedTemps.has(newTemp))

      newPlanets.push(newTemp)
      usedTemps.add(newTemp)
    }

    setPlanetas(newPlanets)
    setPlanetasInput(newPlanets.join(", "))
  }

  const generateGameConfig = (): GameConfig => {
    // Construir el BST balanceado
    const arbol = construirBSTBalanceado(planetas)

    // La temperatura inicial siempre será la raíz del árbol (búsqueda binaria clásica)
    const temperaturaInicialCalculada = arbol?.value || temperaturaObjetivo

    setTemperaturaInicial(temperaturaInicialCalculada)

    return {
      enunciado,
      planetas,
      cantidadPlanetas,
      temperaturaObjetivo,
      temperaturaInicial: temperaturaInicialCalculada,
      bst: arbol,
    }
  }

  const handleCompartir = async () => {
    // Primero enviar al backend para obtener el ID del juego
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const userId = user.id

    if (!token || !userId) {
      alert("⚠️ Debes guardar el juego primero antes de compartirlo")
      return
    }

    try {
      // Enviar el juego al backend primero
      await handleEnviarAlBackend()

      // Luego obtener el último juego creado para este tipo
      const response = await api.get(`/auth/v1/juegos/ultimo/${userId}/galactico`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const juegoId = response.data.id
      const shareUrl = `${window.location.origin}/juego/${userId}/galactico`;
      alert(shareUrl)

      if (navigator.share) {
        navigator.share({
          title: "Exploración Galáctica - Búsqueda Binaria",
          text: "Juega esta misión de búsqueda binaria interplanetaria",
          url: shareUrl,
        })
      } else {
        navigator.clipboard.writeText(shareUrl)
      }
    } catch (error) {
      console.error("Error al compartir:", error)
      alert("❌ Error al generar el link de compartir. Asegúrate de haber guardado el juego primero.")
    }
  }

  const handleIniciarMision = () => {
    // Validar que el objetivo esté en la lista de planetas
    if (!planetas.includes(temperaturaObjetivo)) {
      const newPlanetas = [...planetas, temperaturaObjetivo]
      setPlanetas(newPlanetas)
      setPlanetasInput(newPlanetas.join(", "))
      setCantidadPlanetas(newPlanetas.length)
    }

    const config = generateGameConfig()
    console.log("Configuración del juego galáctico (BST):", JSON.stringify(config, null, 2))
    setGameConfig(config)
    setGameStarted(true)
  }

  if (gameStarted && gameConfig) {
    return <GalaxiaGameInterface config={gameConfig} onBack={() => setGameStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-blue-900 text-white font-mono p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-indigo-400">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-700 text-white">
            <CardTitle className="text-center py-4 text-2xl">CONFIGURADOR DE JUEGO "EXPLORACIÓN GALÁCTICA"</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enunciado" className="text-lg font-semibold">
                Enunciado de la Misión
              </Label>
              <Textarea
                id="enunciado"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Describe la misión galáctica..."
                className="min-h-[100px] text-black"
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
                    min="5"
                    max="31"
                    className="text-black"
                  />
                  <p className="text-sm text-gray-300">Recomendado: 15-31 planetas para mejor experiencia BST</p>
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
                    <Shuffle className="w-4 h-4 mr-2" />
                    Generar Temperaturas Aleatorias
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Parámetros de Búsqueda Binaria</Label>
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
                  <p className="text-sm text-gray-300">El objetivo se incluirá automáticamente en el BST</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio">Temperatura Inicial (Raíz del BST)</Label>
                  <Input
                    id="inicio"
                    type="number"
                    value={temperaturaInicial || "Se calculará automáticamente"}
                    disabled
                    className="text-black bg-gray-200 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-300">Siempre comenzarás desde la raíz del árbol balanceado</p>
                </div>

                <div className="space-y-2">
                  <Label>Vista Previa de Temperaturas</Label>
                  <div className="p-3 bg-slate-100 rounded-md max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {planetas
                        .sort((a, b) => a - b)
                        .map((temp, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs font-semibold rounded ${
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

            <div className="bg-blue-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">🎯 Cómo funciona la Búsqueda Binaria:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Comenzarás en la raíz del árbol binario balanceado</li>
                <li>• Compara la temperatura actual con tu objetivo</li>
                <li>• Si necesitas menor temperatura → ve a la izquierda</li>
                <li>• Si necesitas mayor temperatura → ve a la derecha</li>
                <li>• Cada decisión elimina la mitad de las posibilidades</li>
                <li>• ¡Encuentra el objetivo en O(log n) movimientos!</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button onClick={handleCompartir} className="custom-game-button">
                <div className="button-content">
                  <Share2 className="w-5 h-5 mr-2" /> Compartir misión BST
                </div>
              </button>

              <button onClick={handleIniciarMision} className="custom-game-button">
                <div className="button-content">
                  <Play className="w-5 h-5 mr-2" /> Iniciar búsqueda binaria
                </div>
              </button>
              <button onClick={handleEnviarAlBackend} className="custom-game-button">
                <div className="button-content">
                  <Upload className="w-5 h-5 mr-2" /> Enviar al servidor
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
