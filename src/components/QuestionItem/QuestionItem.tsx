import React, { useState } from 'react';
import { Question, QuestionType } from '../../types';
import QuestionTypeMenu from './QuestionTypeMenu';
import OptionItem from '../OptionItem';
import OpenAnswer from '../OpenAnswer';

interface QuestionItemProps {
  question: Question;
  isSubmitted: boolean;
  onUpdateQuestionText: (questionId: string, text: string) => void;
  onToggleQuestionEdit: (questionId: string) => void;
  onChangeQuestionType: (questionId: string, type: QuestionType) => void;
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void;
  onToggleCorrectOption: (questionId: string, optionId: string) => void;
  onUserAnswer: (questionId: string, value: string | string[]) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  isSubmitted,
  onUpdateQuestionText,
  onToggleQuestionEdit,
  onChangeQuestionType,
  onUpdateOptionText,
  onToggleCorrectOption,
  onUserAnswer
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
  <div
  className="question-container"
  onBlur={(e) => {
    const currentTarget = e.currentTarget;
    // Espera al siguiente tick para verificar si el foco sigue dentro del contenedor
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        onToggleQuestionEdit(question.id);
      }
    }, 0);
  }}
  tabIndex={-1} // Esto permite que el div reciba foco y blur
>
      {/* Texto de la pregunta */}
      <div className="question-header">
        {question.isEditing ? (
          <input
            type="text"
            value={question.text}
            onChange={(e) => onUpdateQuestionText(question.id, e.target.value)}
            autoFocus
            className="edit-input"
          />
        ) : (
          <h3>
            {question.text}
            <button className="edit-button pregunta" onClick={() => onToggleQuestionEdit(question.id)}>
	    ✏️
            </button>
            <button className="settings-button" onClick={() => setShowMenu(true)}>
              ⚙️
            </button>
          </h3>
        )}

        {/* Menú de tipo de pregunta */}
        {showMenu && (
          <QuestionTypeMenu
            questionId={question.id}
            onChangeType={onChangeQuestionType}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>

      {/* Opciones de respuesta */}
      <div className="options-container">
        {question.type === 'open' ? (
          <OpenAnswer
            questionId={question.id}
            isSubmitted={isSubmitted}
            onUserAnswer={onUserAnswer}
          />
        ) : (
          question.options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              questionId={question.id}
              isEditing={question.isEditing}
              isSubmitted={isSubmitted}
              userAnswer={question.userAnswer}
              onUpdateOptionText={onUpdateOptionText}
              onToggleCorrectOption={onToggleCorrectOption}
              onUserAnswer={onUserAnswer}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionItem;
