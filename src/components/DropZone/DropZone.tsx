import { useDrop } from 'react-dnd';
import styles from './DropZone.module.css';

interface DropZoneProps {
  acceptShape: string;
  placedShape: string | null;     // lo que ya se colocó (o null)
  onDrop: (shape: string) => void;
}

const DropZone = ({ acceptShape, placedShape, onDrop }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item: { shape: string }) => {
      onDrop(item.shape);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop]);

  return drop (
    <div
      className={styles.dropzone}
      style={{ backgroundColor: isOver ? '#e0e0e0' : 'white' }}
    >
      {placedShape ?? acceptShape}
    </div>
  );
};

export default DropZone;

