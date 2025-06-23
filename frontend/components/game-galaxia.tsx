"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Save, ArrowLeft, RotateCcw, Target, Lightbulb } from "lucide-react"

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

interface GameProps {
  config: GameConfig
  onBack: () => void
}

export default function GalaxiaGameInterface({ config, onBack }: GameProps) {
  const [arbol, setArbol] = useState<Nodo | null>(null)
  const [nodoActual, setNodoActual] = useState<Nodo | null>(null)
  const [movimientos, setMovimientos] = useState<number>(0)
  const [historial, setHistorial] = useState<Nodo[]>([])
  const [juegoCompletado, setJuegoCompletado] = useState(false)
  const [mensaje, setMensaje] = useState<string>("")
  const [animacion, setAnimacion] = useState<string>("")
  const [pista, setPista] = useState<string>("")
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [movimientosOptimos, setMovimientosOptimos] = useState<number>(0)
  const [naveAnimacion, setNaveAnimacion] = useState<string>("")
  const [indicePlaneta, setIndicePlaneta] = useState(0)
  const [planetaVisible, setPlanetaVisible] = useState(true)
  const planetasDisponibles = ["/planeta1.gif", "/planeta2.gif", "/planeta3.gif", "/planeta4.gif", "/planeta5.gif", "/planeta6.gif"]


  // Construir BST balanceado (igual que en el configurador)
  const construirBSTBalanceado = useCallback(
    (valores: number[]): Nodo | null => {
      const valoresUnicos = Array.from(new Set([...valores, config.temperaturaObjetivo]))
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
    },
    [config.temperaturaObjetivo],
  )

 const cambiarPlaneta = () => {
  setPlanetaVisible(false) // Ocultar actual

  setTimeout(() => {
    let nuevoIndice = Math.floor(Math.random() * planetasDisponibles.length)
    while (nuevoIndice === indicePlaneta) {
      nuevoIndice = Math.floor(Math.random() * planetasDisponibles.length)
    }
    setIndicePlaneta(nuevoIndice)
    setPlanetaVisible(true) // Mostrar nuevo
  }, 200) // Tiempo del fade-out/fade-in
}
const obtenerImagenTermometro = (temp: number) => {
  if (temp < 150) return "/termometro-frio.png"
  if (temp < 300) return "/termometro-medio.png"
  return "/termometro-caliente.png"
}


  // Calcular la profundidad óptima (movimientos mínimos necesarios)
  const calcularMovimientosOptimos = useCallback((nodo: Nodo | null, objetivo: number, profundidad = 0): number => {
    if (!nodo) return -1
    if (nodo.value === objetivo) return profundidad

    if (objetivo < nodo.value) {
      return calcularMovimientosOptimos(nodo.left, objetivo, profundidad + 1)
    } else {
      return calcularMovimientosOptimos(nodo.right, objetivo, profundidad + 1)
    }
  }, [])

  // Buscar nodo por valor
  const buscarNodo = useCallback((nodo: Nodo | null, valor: number): Nodo | null => {
    if (!nodo) return null
    if (nodo.value === valor) return nodo

    if (valor < nodo.value) {
      return buscarNodo(nodo.left, valor)
    } else {
      return buscarNodo(nodo.right, valor)
    }
  }, [])

  // Generar pista de búsqueda binaria
  const generarPistaBinaria = useCallback((actual: number, objetivo: number) => {
    if (actual === objetivo) {
      return "🎉 ¡OBJETIVO ENCONTRADO! ¡Excelente búsqueda binaria!"
    }

    if (actual < objetivo) {
      return `🔥 Necesitas ${objetivo - actual}°C más. Ve a la DERECHA (temperaturas mayores)`
    } else {
      return `❄️ Necesitas ${actual - objetivo}°C menos. Ve a la IZQUIERDA (temperaturas menores)`
    }
  }, [])

  // Inicializar juego
  useEffect(() => {
    if (!config.planetas || config.planetas.length === 0) {
      console.error("No hay planetas configurados")
      return
    }

    const bst = config.bst || construirBSTBalanceado(config.planetas)
    const nodoInicial = bst // Siempre comenzar desde la raíz

    setArbol(bst)
    setNodoActual(nodoInicial)
    setHistorial(nodoInicial ? [nodoInicial] : [])
    setMovimientos(0)
    setJuegoCompletado(false)
    setMensaje("")

    // Calcular movimientos óptimos
    const optimos = calcularMovimientosOptimos(bst, config.temperaturaObjetivo)
    setMovimientosOptimos(optimos)

    // Generar pista inicial
    if (nodoInicial) {
      setPista(generarPistaBinaria(nodoInicial.value, config.temperaturaObjetivo))
    }
  }, [config, construirBSTBalanceado, calcularMovimientosOptimos, generarPistaBinaria])

  // Mover en el árbol (implementación de búsqueda binaria)
  const mover = useCallback(
    (direccion: "left" | "right") => {
      if (!nodoActual || juegoCompletado) return

      const siguiente = direccion === "left" ? nodoActual.left : nodoActual.right
      
      if (siguiente) {
        setNaveAnimacion(direccion === "left" ? "giro-izquierda" : "giro-derecha")
        setTimeout(() => setNaveAnimacion(""), 300)
        setAnimacion(direccion === "left" ? "moveLeft" : "moveRight")

        setTimeout(() => {
          setNodoActual(siguiente)
          setHistorial((prev) => [...prev, siguiente])
          setMovimientos((prev) => prev + 1)

          // Generar pista de búsqueda binaria
          const nuevaPista = generarPistaBinaria(siguiente.value, config.temperaturaObjetivo)
          setPista(nuevaPista)

          // Verificar si es una decisión correcta de búsqueda binaria
          const esDecisionCorrecta =
            (direccion === "left" && config.temperaturaObjetivo < nodoActual.value) ||
            (direccion === "right" && config.temperaturaObjetivo > nodoActual.value)

          if (!esDecisionCorrecta && siguiente.value !== config.temperaturaObjetivo) {
            setMensaje("⚠️ Esta no es la dirección óptima según búsqueda binaria")
            setTimeout(() => setMensaje(""), 3000)
          }
          cambiarPlaneta()
          setAnimacion("")
        }, 300)
      } else {
        // No hay nodo en esa dirección
        const direccionTexto = direccion === "left" ? "más fríos" : "más calientes"
        setMensaje(`🚫 No hay planetas ${direccionTexto} desde aquí`)
        setTimeout(() => setMensaje(""), 2000)
      }
    },
    [nodoActual, juegoCompletado, config.temperaturaObjetivo, generarPistaBinaria],
  )

  // Retroceder (permitido pero penaliza la eficiencia)
  const retroceder = useCallback(() => {
    if (historial.length > 1 && !juegoCompletado) {
      setNaveAnimacion("bajar")
      setTimeout(() => setNaveAnimacion(""), 300)
      setNaveAnimacion("bajar")
    setTimeout(() => setNaveAnimacion(""), 300)

      setAnimacion("moveBack")

      setTimeout(() => {
        const nuevoHistorial = [...historial]
        nuevoHistorial.pop()
        const nodoAnterior = nuevoHistorial[nuevoHistorial.length - 1]

        setNodoActual(nodoAnterior)
        setHistorial(nuevoHistorial)
        setMovimientos((prev) => prev + 1)

        const nuevaPista = generarPistaBinaria(nodoAnterior.value, config.temperaturaObjetivo)
        setPista(`↩️ Regresaste. ${nuevaPista}`)
        cambiarPlaneta()

        setAnimacion("")
      }, 300)
      cambiarPlaneta()

    }
  }, [historial, juegoCompletado, config.temperaturaObjetivo, generarPistaBinaria])

  // Reiniciar juego
  const reiniciar = useCallback(() => {
    const nodoInicial = arbol // Volver a la raíz
    setNodoActual(nodoInicial)
    setHistorial(nodoInicial ? [nodoInicial] : [])
    setMovimientos(0)
    setJuegoCompletado(false)
    setMensaje("")

    if (nodoInicial) {
      setPista(generarPistaBinaria(nodoInicial.value, config.temperaturaObjetivo))
    }
  }, [arbol, config.temperaturaObjetivo, generarPistaBinaria])

  // Verificar victoria
  useEffect(() => {
    if (nodoActual?.value === config.temperaturaObjetivo && !juegoCompletado) {
      setJuegoCompletado(true)
      const eficiencia = movimientos <= movimientosOptimos ? "¡ÓPTIMA!" : "Buena"
      setMensaje(`🎉 ¡MISIÓN COMPLETADA! Encontraste ${config.temperaturaObjetivo}°C`)
      setPista(
        `✅ Completado en ${movimientos} movimientos (Óptimo: ${movimientosOptimos}) - Eficiencia: ${eficiencia}`,
      )
    }
  }, [nodoActual?.value, config.temperaturaObjetivo, juegoCompletado, movimientos, movimientosOptimos])

  // Guardar resultado
  const guardar = useCallback(() => {
    if (juegoCompletado) {
      const eficiencia = movimientos <= movimientosOptimos ? "ÓPTIMA" : "BUENA"
      alert(
        `✅ ¡Excelente búsqueda binaria!\n\n` +
          `🎯 Objetivo: ${config.temperaturaObjetivo}°C\n` +
          `🔄 Movimientos realizados: ${movimientos}\n` +
          `⚡ Movimientos óptimos: ${movimientosOptimos}\n` +
          `📊 Eficiencia: ${eficiencia}\n\n` +
          `🏆 ¡Misión completada exitosamente!`,
      )
    } else {
      alert(
        `🚫 Misión en progreso...\n\n` +
          `🎯 Objetivo: ${config.temperaturaObjetivo}°C\n` +
          `📍 Temperatura actual: ${nodoActual?.value}°C\n` +
          `🔄 Movimientos: ${movimientos}\n` +
          `💡 Pista: ${pista}`,
      )
    }
    onBack()
  }, [juegoCompletado, config.temperaturaObjetivo, movimientos, movimientosOptimos, nodoActual?.value, pista, onBack])

  // Obtener color de temperatura
  const getTemperatureColor = (temp: number) => {
    if (temp < 100) return "text-blue-300"
    if (temp < 200) return "text-green-300"
    if (temp < 300) return "text-yellow-300"
    if (temp < 400) return "text-orange-300"
    return "text-red-300"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-blue-900 text-white flex items-center justify-center p-4">
      <div className="bg-[#1a133f] p-8 rounded-3xl shadow-2xl text-center max-w-4xl w-full border border-purple-500/30">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-yellow-300 mb-3 flex items-center justify-center gap-3">
            🚀 Búsqueda Binaria Galáctica
            <Target className="w-8 h-8 text-green-400" />
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {config.enunciado}
          </p>
        </div>

        {/* Estado del juego */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-black/50 p-3 rounded-xl">
            <div className="text-xs text-gray-400">Objetivo</div>
            <div className="text-xl font-bold text-green-400">{config.temperaturaObjetivo}°C</div>
          </div>
          <div className="bg-black/50 p-3 rounded-xl">
            <div className="text-xs text-gray-400">Movimientos</div>
            <div className="text-xl font-bold text-blue-400">{movimientos}</div>
          </div>
          <div className="bg-black/50 p-3 rounded-xl">
            <div className="text-xs text-gray-400">Óptimo</div>
            <div className="text-xl font-bold text-purple-400">{movimientosOptimos}</div>
          </div>
          <div className="bg-black/50 p-3 rounded-xl">
            <div className="text-xs text-gray-400">Planetas</div>
            <div className="text-xl font-bold text-yellow-400">{config.cantidadPlanetas}</div>
          </div>
          <div className="bg-black/50 p-3 rounded-xl">
            <div className="text-xs text-gray-400">Eficiencia</div>
            <div
              className={`text-xl font-bold ${movimientos <= movimientosOptimos ? "text-green-400" : "text-orange-400"}`}
            >
              {juegoCompletado ? (movimientos <= movimientosOptimos ? "⭐" : "👍") : "⏳"}
            </div>
          </div>
        </div>

        {/* Temperatura actual */}
        <div
          className={`text-6xl font-black bg-black inline-block px-8 py-4 rounded-2xl mb-6 border-4 ${
            juegoCompletado ? "border-green-500 bg-green-900/30" : "border-purple-500"
          } ${animacion ? "animate-pulse" : ""}`}
        >
          <span className={getTemperatureColor(nodoActual?.value || 0)}>{nodoActual?.value ?? "?"}°C</span>
        </div>

        {/* Elementos visuales */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className={`transition-transform duration-300 ${animacion === "moveLeft" ? "scale-110" : ""}`}>
            <Image
              src={planetasDisponibles[indicePlaneta]}
              alt="Planeta actual"
              width={100}
              height={100}
              className={`rounded-full transition-opacity duration-300 ease-in-out ${planetaVisible ? "opacity-100" : "opacity-0"}`}
/>

          </div>
          <div className={`transition-transform duration-300 ${animacion === "moveRight" ? "scale-110" : ""}`}>
            <Image
            src={obtenerImagenTermometro(nodoActual?.value ?? 0)}
            alt="Termómetro"
            width={80}
            height={120}
            className="rounded transition-transform duration-300"
/>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-center items-center gap-12 mb-8">
          <button
            onClick={() => mover("left")}
            disabled={!nodoActual?.left || juegoCompletado}
            className={`navigation-btn ${!nodoActual?.left ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          >
            <Image
              src="/izquierda.png"
              alt="Más frío"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-sm mt-2 text-blue-300">Más frío ❄️</span>
            <span className="text-xs text-gray-400">(Izquierda)</span>
          </button>

         <div className={`transition-transform duration-300 ${animacion ? "scale-125" : ""} ${naveAnimacion}`}>


            <Image
              src="/nave.png"
              alt="Nave"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>

          <button
            onClick={() => mover("right")}
            disabled={!nodoActual?.right || juegoCompletado}
            className={`navigation-btn ${!nodoActual?.right ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          >
            <Image
              src="/derecha.png"
              alt="Más caliente"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-sm mt-2 text-red-300">Más caliente 🔥</span>
            <span className="text-xs text-gray-400">(Derecha)</span>
          </button>
        </div>

        {/* Botón regresar */}
        <div className="flex justify-center mb-6">
          <button
            onClick={retroceder}
            disabled={historial.length <= 1 || juegoCompletado}
            className={`navigation-btn ${historial.length <= 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          >
            <Image
              src="/regresar.png"
              alt="Regresar"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-sm mt-2 text-yellow-300">Regresar ↩️</span>
            <span className="text-xs text-gray-400">(+1 movimiento)</span>
          </button>
        </div>

        {/* Mensajes y pistas */}
        {(mensaje || pista) && (
          <div className="mb-6 space-y-2">
            {mensaje && (
              <div
                className={`p-3 rounded-lg ${juegoCompletado ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
              >
                {mensaje}
              </div>
            )}
            {pista && (
              <div className="p-3 bg-blue-900/50 text-blue-300 rounded-lg text-sm font-semibold">💡 {pista}</div>
            )}
          </div>
        )}

        {/* Ayuda de búsqueda binaria */}
        <div className="mb-6">
          <button
            onClick={() => setMostrarAyuda(!mostrarAyuda)}
            className="text-sm text-yellow-300 hover:text-yellow-100 flex items-center gap-2 mx-auto"
          >
            <Lightbulb className="w-4 h-4" />
            {mostrarAyuda ? "Ocultar" : "Mostrar"} ayuda de búsqueda binaria
          </button>

          {mostrarAyuda && (
            <div className="mt-3 p-4 bg-yellow-900/30 rounded-lg text-sm text-left">
              <h4 className="font-bold text-yellow-300 mb-2">🎯 Estrategia de Búsqueda Binaria:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • <strong>Compara:</strong> ¿Tu objetivo es mayor o menor que la temperatura actual?
                </li>
                <li>
                  • <strong>Decide:</strong> Si necesitas más calor → derecha, si necesitas menos → izquierda
                </li>
                <li>
                  • <strong>Elimina:</strong> Cada movimiento descarta la mitad de las posibilidades
                </li>
                <li>
                  • <strong>Eficiencia:</strong> Deberías encontrar el objetivo en máximo {movimientosOptimos}{" "}
                  movimientos
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={onBack} className="action-btn bg-gray-600 hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver
          </button>

          <button onClick={reiniciar} className="action-btn bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-5 h-5 mr-2" /> Reiniciar
          </button>

          <button
            onClick={guardar}
            className={`action-btn ${juegoCompletado ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            <Save className="w-5 h-5 mr-2" />
            {juegoCompletado ? "¡Completado!" : "Guardar progreso"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .navigation-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .navigation-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3), 0 6px 15px rgba(0, 0, 0, 0.2);
          min-width: 150px;
        }

        .action-btn:hover {
          transform: translateY(2px);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .action-btn:active {
          transform: translateY(4px);
          box-shadow: 0 0px 0 rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-pulse {
          animation: pulse 0.5s ease-in-out;
        }
        .giro-izquierda {
    animation: giroIzquierda 0.6s ease-in-out;
  }

  .giro-derecha {
    animation: giroDerecha 0.6s ease-in-out;
  }

  .bajar {
    animation: bajarYSubir 0.6s ease-in-out;
  }

  @keyframes giroIzquierda {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes giroDerecha {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(15deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes bajarYSubir {
    0% { transform: translateY(0); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(0); }
  }  
      `}</style>
    </div>
  )
}
