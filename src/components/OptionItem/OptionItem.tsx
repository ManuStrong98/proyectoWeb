import React from 'react';
import { Option } from '../../types';

interface OptionItemProps {
  option: Option;
  questionId: string;
  isEditing: boolean;
  isSubmitted: boolean;
  userAnswer?: string | string[];
  onUpdateOptionText: (questionId: string, optionId: string, text: string) => void;
  onToggleCorrectOption: (questionId: string, optionId: string) => void;
  onUserAnswer: (questionId: string, value: string) => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
  option,
  questionId,
  isEditing,
  isSubmitted,
  userAnswer,
  onUpdateOptionText,
  onToggleCorrectOption,
  onUserAnswer
}) => {
  return (
    <div className="option-item">
      {isSubmitted ? (
        <>
          <input
            type="radio"
            name={`question-${questionId}`}
            id={option.id}
            checked={userAnswer === option.id}
            onChange={() => onUserAnswer(questionId, option.id)}
          />
          <label htmlFor={option.id}>{option.text}</label>
        </>
      ) : (
        <div className="option-edit-container">
          <span className="option-marker">⚪</span>
          {isEditing ? (
            <>
              <input
                type="text"
                value={option.text}
                onChange={(e) => onUpdateOptionText(questionId, option.id, e.target.value)}
                className="option-edit-input"
              />
              <input
                type="radio"
                name={`correct-${questionId}`}
                checked={option.isCorrect}
                onChange={() => onToggleCorrectOption(questionId, option.id)}
                className="correct-option-radio"
              />
            </>
          ) : (
            <span>{option.text}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default OptionItem;
