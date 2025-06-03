import React from 'react';

interface Props {
  id: string;
  label: string;
  index: number;
}

const DraggableLayer: React.FC<Props> = ({ id, label, index }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
  };

  return (
    <div
      className="draggable-layer"
      draggable
      onDragStart={handleDragStart}
      style={{ top: `${15 + index * 10}%` }}
    >
      {label}
    </div>
  );
};

export default DraggableLayer;
