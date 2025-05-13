import React from 'react';

interface OpenAnswerProps {
  questionId: string;
  isSubmitted: boolean;
  onUserAnswer: (questionId: string, value: string) => void;
}

const OpenAnswer: React.FC<OpenAnswerProps> = ({ questionId, isSubmitted, onUserAnswer }) => {
  return (
    <>
      {isSubmitted ? (
        <input
          type="text"
          placeholder="Tu respuesta..."
          onChange={(e) => onUserAnswer(questionId, e.target.value)}
          className="open-answer-input"
        />
      ) : (
        <div className="open-answer-placeholder">Respuesta abierta</div>
      )}
    </>
  );
};

export default OpenAnswer;
