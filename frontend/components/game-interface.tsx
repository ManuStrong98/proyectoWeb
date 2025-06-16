"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"

interface GameConfig {
  enunciado: string
  habitaciones: number[]
  tamañoLista: number
  numeroObjetivo: number
  numeroDeInicio: number
}

interface GameInterfaceProps {
  config: GameConfig
  onBack: () => void
}

interface BinaryTreeNode {
  value: number
  left: BinaryTreeNode | null
  right: BinaryTreeNode | null
}

export default function GameInterface({ config, onBack }: GameInterfaceProps) {
  const [currentRoom, setCurrentRoom] = useState<number>(0)
  const [binaryTree, setBinaryTree] = useState<BinaryTreeNode | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [moves, setMoves] = useState(0)
  const [visitedRooms, setVisitedRooms] = useState<number[]>([])

  // Construir el árbol binario de búsqueda
  useEffect(() => {
    const buildBinarySearchTree = (numbers: number[]): BinaryTreeNode | null => {
      if (numbers.length === 0) return null

      // Asegurar que todos los números estén incluidos, incluyendo el objetivo
      const allNumbers = [...new Set([...numbers, config.numeroObjetivo])]
      const sortedNumbers = allNumbers.sort((a, b) => a - b)

      const buildBalancedBST = (arr: number[], start: number, end: number): BinaryTreeNode | null => {
        if (start > end) return null

        const mid = Math.floor((start + end) / 2)
        const node: BinaryTreeNode = {
          value: arr[mid],
          left: null,
          right: null,
        }

        node.left = buildBalancedBST(arr, start, mid - 1)
        node.right = buildBalancedBST(arr, mid + 1, end)

        return node
      }

      return buildBalancedBST(sortedNumbers, 0, sortedNumbers.length - 1)
    }

    const tree = buildBinarySearchTree(config.habitaciones)
    setBinaryTree(tree)

    // Establecer la habitación inicial como la raíz del árbol
    if (tree) {
      setCurrentRoom(tree.value)
      setVisitedRooms([tree.value])
    }
  }, [config.habitaciones, config.numeroObjetivo])

  // Encontrar el nodo actual en el árbol
  const findCurrentNode = (node: BinaryTreeNode | null, value: number): BinaryTreeNode | null => {
    if (!node) return null
    if (node.value === value) return node
    if (value < node.value) return findCurrentNode(node.left, value)
    return findCurrentNode(node.right, value)
  }

  // Navegar a la izquierda
  const navigateLeft = () => {
    const currentNode = findCurrentNode(binaryTree, currentRoom)
    if (currentNode && currentNode.left) {
      const newRoom = currentNode.left.value
      setCurrentRoom(newRoom)
      setMoves(moves + 1)
      setVisitedRooms([...visitedRooms, newRoom])
    }
  }

  // Navegar a la derecha
  const navigateRight = () => {
    const currentNode = findCurrentNode(binaryTree, currentRoom)
    if (currentNode && currentNode.right) {
      const newRoom = currentNode.right.value
      setCurrentRoom(newRoom)
      setMoves(moves + 1)
      setVisitedRooms([...visitedRooms, newRoom])
    }
  }

  // Navegar hacia arriba (volver al nodo padre)
  const navigateUp = () => {
    if (visitedRooms.length > 1) {
      const newVisited = [...visitedRooms]
      newVisited.pop() // Remover la habitación actual
      const previousRoom = newVisited[newVisited.length - 1]
      setCurrentRoom(previousRoom)
      setMoves(moves + 1)
      setVisitedRooms(newVisited)
    }
  }

  // Verificar si encontramos la habitación objetivo
  useEffect(() => {
    if (currentRoom === config.numeroObjetivo) {
      setGameCompleted(true)
    }
  }, [currentRoom, config.numeroObjetivo])

  // Guardar respuesta
  const saveAnswer = () => {
    if (gameCompleted) {
      alert(`¡Felicidades! Has encontrado la habitación ${config.numeroObjetivo} en ${moves} movimientos.`)
      onBack()
    } else {
      alert("Aún no has encontrado la habitación objetivo.")
    }
  }

  // Verificar si hay nodos disponibles para navegar
  const currentNode = findCurrentNode(binaryTree, currentRoom)
  const canGoLeft = currentNode && currentNode.left !== null
  const canGoRight = currentNode && currentNode.right !== null
  const canGoUp = visitedRooms.length > 1

  // Función para obtener información de debug
  const getDebugInfo = () => {
    const allNodes: number[] = []
    const traverseTree = (node: BinaryTreeNode | null) => {
      if (node) {
        allNodes.push(node.value)
        traverseTree(node.left)
        traverseTree(node.right)
      }
    }
    traverseTree(binaryTree)
    return allNodes.sort((a, b) => a - b)
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
           <h1 className="penguin-text-small">Hotel Binario</h1>
          <div className="text-amber-800">Modo de revisión</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            A lo largo de los años, los castores construyeron una enorme guarida de castores con muchas, muchas
            habitaciones. Las habitaciones están numeradas y dispuestas en una estructura de túnel particular.
          </p>
          <p className="text-gray-700 mb-4">Haga clic en las flechas para moverse por la guarida.</p>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Pregunta:</h2>
            <p className="mb-2">
              {config.enunciado.replace(/\d+/, config.numeroObjetivo.toString())}
              {gameCompleted && ' Haz clic en "Guardar" una vez que lo hayas encontrado.'}
            </p>
          </div>

          <div className="relative w-full max-w-md mx-auto my-8">
            <div className="relative w-full aspect-[3/2] bg-amber-900 rounded-full flex items-center justify-center">
              <div className="absolute w-1/3 h-2/3 bg-amber-700 rounded-full left-10 top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute w-1/3 h-2/3 bg-amber-700 rounded-full right-10 top-1/2 transform -translate-y-1/2"></div>

              {/* Habitación central */}
              <div className="w-1/3 aspect-square bg-amber-500 rounded-full flex items-center justify-center relative">
                <div
                  className={`w-4/5 h-4/5 rounded-lg flex flex-col items-center justify-center border-4 ${
                    gameCompleted ? "bg-green-300 border-green-600" : "bg-amber-300 border-amber-600"
                  }`}
                >
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-1/3 bg-amber-700 flex justify-between">
                    <div className="h-3 w-1 bg-amber-800"></div>
                    <div className="h-3 w-1 bg-amber-800"></div>
                    <div className="h-3 w-1 bg-amber-800"></div>
                  </div>
                  <span className="text-2xl font-bold text-amber-900">{currentRoom}</span>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-amber-900 rounded-full"></div>
                </div>
              </div>

              {/* Flechas de navegación */}
              {canGoLeft && (
                <button
                  onClick={navigateLeft}
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-16 h-16 cursor-pointer hover:scale-110 transition-transform"
                  title="Ir a habitación menor (izquierda)"
                >
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-green-500 rotate-[225deg] clip-arrow"></div>
                    <div className="absolute inset-0 bg-yellow-300 rotate-[225deg] clip-arrow scale-90"></div>
                  </div>
                </button>
              )}

              {canGoRight && (
                <button
                  onClick={navigateRight}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 w-16 h-16 cursor-pointer hover:scale-110 transition-transform"
                  title="Ir a habitación mayor (derecha)"
                >
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-green-500 rotate-[135deg] clip-arrow"></div>
                    <div className="absolute inset-0 bg-yellow-300 rotate-[135deg] clip-arrow scale-90"></div>
                  </div>
                </button>
              )}

              {canGoUp && (
                <button
                  onClick={navigateUp}
                  className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-16 h-16 cursor-pointer hover:scale-110 transition-transform"
                  title="Volver atrás"
                >
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-green-500 rotate-0 clip-arrow"></div>
                    <div className="absolute inset-0 bg-yellow-300 rotate-0 clip-arrow scale-90"></div>
                  </div>
                </button>
              )}
            </div>
          </div>

           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button onClick={onBack} className="custom-game-button">
              <div className="button-content">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a la configuración
              </div>
            </button>

            <button onClick={saveAnswer} className="custom-game-button">
              <div className="button-content">
                <Save className="w-5 h-5 mr-2" />
                Guardar respuesta
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-arrow {
          clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
        }
        
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
