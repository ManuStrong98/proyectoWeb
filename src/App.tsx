import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from './components/Header/Header';
import Question from './components/Question/Question';
import DraggableShape from './components/DraggableShape/DraggableShape';
import DropZone from './components/DropZone/DropZone';

import './App.css';

type PlacedMap = Record<string, string | null>;

function App() {
  // Figuras que aún pueden arrastrarse
  const [shapes, setShapes] = useState<string[]>([
    'Triángulo',
    'Círculo',
    'Cuadrado',
  ]);

  // Qué figura (si la hay) quedó en cada zona
  const [placed, setPlaced] = useState<PlacedMap>({
    Triángulo: null,
    Círculo: null,
    Cuadrado: null,
  });

  const handleDrop = (shape: string, zone: string) => {
    if (shape === zone) {
      // Acierto: lo colocamos y lo quitamos de pendientes
      setPlaced((prev) => ({ ...prev, [zone]: shape }));
      setShapes((prev) => prev.filter((s) => s !== shape));
    } else {
      // Error: opcionalmente mostrar feedback
      alert(`¡Ups! ${shape} no va en la zona de ${zone}.`);
      // Al no quitarlo de `shapes`, el Draggable vuelve solo
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Header />
        <Question />

        <div className="shapes-row">
          {shapes.map((shape) => (
            <DraggableShape key={shape} shape={shape} />
          ))}
        </div>

        <div className="dropzones-row">
          {Object.keys(placed).map((zone) => (
            <DropZone
              key={zone}
              acceptShape={zone}
              placedShape={placed[zone]}
              onDrop={(shape) => handleDrop(shape, zone)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;

