import React, { useState } from 'react';

interface Props {
  id: string;
  correctId: string;
  top: string;
  left: string;
}

const DropZone: React.FC<Props> = ({ id, correctId, top, left }) => {
  const [dropped, setDropped] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');

    if (draggedId === correctId) {
      setDropped(draggedId);
      setError(false);
    } else {
      setDropped(null);
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div
      className={`drop-zone ${error ? 'error' : ''}`}
      style={{ top, left, position: 'absolute' }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {dropped && <div className="dropped">{dropped}</div>}
    </div>
  );
};

export default DropZone;
