import React, { useRef } from 'react';
import { QuestionType } from '../../types';
import useClickOutside from '../../hooks/useClickOutside';

interface QuestionTypeMenuProps {
  questionId: string;
  onChangeType: (questionId: string, type: QuestionType) => void;
  onClose: () => void;
}

const QuestionTypeMenu: React.FC<QuestionTypeMenuProps> = ({ questionId, onChangeType, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(menuRef, onClose);

  return (
    <div className="question-type-menu" ref={menuRef}>
      <div className="menu-option" onClick={() => onChangeType(questionId, 'multiple')}>
        Elección múltiple
      </div>
      <div className="menu-option" onClick={() => onChangeType(questionId, 'boolean')}>
        Verdadero / Falso
      </div>
      <div className="menu-option" onClick={() => onChangeType(questionId, 'open')}>
        Respuesta abierta
      </div>
    </div>
  );
};

export default QuestionTypeMenu;
