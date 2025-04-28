import { useDrag } from 'react-dnd';
import styles from './DraggableShape.module.css';

interface DraggableShapeProps {
  shape: string;
}

const DraggableShape = ({ shape }: DraggableShapeProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shape',
    item: { shape },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return drag(
    <div
      className={styles.shape}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {shape}
    </div>
  );
};

export default DraggableShape;

