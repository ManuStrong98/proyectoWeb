import React, { useState, useEffect } from 'react';
 import { useLocation, useNavigate } from 'react-router-dom';
 import './VistaPrevia.css';

 interface LocationState {
  title: string;
  questions: {
    questionText: string;
    questionImage: string | null;
    answer: string;
  }[];
  globalTimeLimit: number;
  textColor: string;
  bgColor: string;
  font: string;
  bgImageURL: string | null;
 }

 interface Question {
  questionText: string;
  questionImage: string | null;
  answer: string;
 }

 interface QuestionWithId extends Question {
  id: number;
 }

 const VistaPrevia: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionWithId[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithId | null>(null);
  const [correctAnswerFeedback, setCorrectAnswerFeedback] = useState<string>('');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(state?.globalTimeLimit || 60);

  useEffect(() => {
    if (state?.questions) {
      const questionsWithId = state.questions.map((q, index) => ({ ...q, id: index }));
      const shuffledQ = [...questionsWithId].sort(() => Math.random() - 0.5);
      const shuffledA = [...state.questions.map(q => q.answer)].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffledQ);
      setShuffledAnswers(shuffledA);
      // currentQuestion se establece al hacer clic
    }
  }, [state?.questions]);

  useEffect(() => {
    if (timeLeft > 0 && currentQuestion) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      console.log("Tiempo agotado");
      // Aquí puedes agregar lógica para cuando el tiempo se agota
    }
  }, [timeLeft, currentQuestion]);

  const handleQuestionClick = (question: QuestionWithId) => {
    setCurrentQuestion(question);
    setSelectedAnswer('');
    setCorrectAnswerFeedback('');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      if (answer === currentQuestion.answer) {
        setCorrectAnswerFeedback('¡Correcto!');
      } else {
        setCorrectAnswerFeedback('Tu respuesta es incorrecta.');
      }
    } else {
      setCorrectAnswerFeedback('');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion) {
      const currentIndex = shuffledQuestions.findIndex(q => q?.id === currentQuestion.id);
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentQuestion(shuffledQuestions[currentIndex + 1]);
        setSelectedAnswer('');
        setCorrectAnswerFeedback('');
      } else {
        console.log("Fin de las preguntas");
        // Lógica para el final del juego
      }
    }
  };

  if (!state) {
    navigate('/');
    return null;
  }

  const { title, textColor, bgColor, font, bgImageURL } = state;

  const previewStyles: React.CSSProperties = {
    color: textColor,
    backgroundColor: bgColor,
    fontFamily: font,
    backgroundImage: bgImageURL ? `url(${bgImageURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div className="vista-previa-container" style={previewStyles}>
      <h1>{title}</h1>
      <div className="top-section">
        <div className="left-top">
          <div className="questions-bar">
            <h3>Preguntas</h3>
            <div className="questions-thumbnails">
              {shuffledQuestions.map(q => (
                <div
                  key={q.id}
                  className={`question-thumbnail ${currentQuestion?.id === q.id ? 'active' : ''}`}
                  onClick={() => handleQuestionClick(q)}
                >
                  {q.questionImage ? (
                    <img src={q.questionImage} alt={q.questionText || `Pregunta ${q.id + 1}`} />
                  ) : (
                    <div className="question-text-placeholder">{q.questionText}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="answers-bar">
            <h3>Respuestas</h3>
            <div className="answers-list">
              {shuffledAnswers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-button ${selectedAnswer === answer ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={!currentQuestion}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="right-top">
          <div className="current-question-display">
            <h3>Pregunta Actual</h3>
            {currentQuestion?.questionImage ? (
              <img src={currentQuestion.questionImage} alt={currentQuestion.questionText || "Pregunta"} />
            ) : (
              <p>{currentQuestion?.questionText || "Selecciona una pregunta"}</p>
            )}
          </div>
          <div className="answer-feedback-display">
            <h3>Tu Selección</h3>
            <p className={correctAnswerFeedback === '¡Correcto!' ? 'correct' : correctAnswerFeedback === 'Tu respuesta es incorrecta.' ? 'incorrect' : ''}>
              {selectedAnswer || 'Selecciona una respuesta'}
            </p>
            {correctAnswerFeedback === '¡Correcto!' && <p className="correct-answer-reveal">¡Bien hecho!</p>}
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <div className="bottom-left">
          <div className="countdown-timer">
            Tiempo restante: {timeLeft} segundos
          </div>
        </div>
        <div className="bottom-right">
          <button onClick={() => navigate(-1)} className="back-button">Volver al Editor</button>
          <div className="score-attempts">Puntuación: <span className="score">0</span> aciertos<br />Intentos: <span className="attempts">0</span></div>
          <button onClick={handleNextQuestion} className="next-button" disabled={!selectedAnswer}>Siguiente Pregunta</button>
        </div>
      </div>
    </div>
  );
 };

 export default VistaPrevia;
