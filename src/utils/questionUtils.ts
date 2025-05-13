import { Question, QuestionType, Option } from '../types';

// Crear una nueva pregunta
export const createNewQuestion = (): Question => {
  const newQuestionId = `q-${Date.now()}`;
  return {
    id: newQuestionId,
    text: "Nueva pregunta interactiva",
    type: "multiple",
    options: [
      { id: `${newQuestionId}-1`, text: 'opcion 1', isCorrect: true },
      { id: `${newQuestionId}-2`, text: 'opcion 2', isCorrect: false },
      { id: `${newQuestionId}-3`, text: 'opcion 3', isCorrect: false }
    ],
    isEditing: false
  };
};

// Obtener opciones según el tipo de pregunta
export const getOptionsByType = (questionId: string, type: QuestionType): Option[] => {
  let options: Option[] = [];
  
  if (type === 'multiple') {
    options = [
      { id: `${questionId}-1`, text: 'opcion 1', isCorrect: true },
      { id: `${questionId}-2`, text: 'opcion 2', isCorrect: false },
      { id: `${questionId}-3`, text: 'opcion 3', isCorrect: false }
    ];
  } else if (type === 'boolean') {
    options = [
      { id: `${questionId}-1`, text: 'Verdadero', isCorrect: true },
      { id: `${questionId}-2`, text: 'Falso', isCorrect: false }
    ];
  }
  
  return options;
};

// Verificar respuestas
export const verifyAnswers = (questions: Question[]): { allCorrect: boolean, answeredAll: boolean } => {
  let allCorrect = true;
  let answeredAll = true;

  questions.forEach(question => {
    if (!question.userAnswer) {
      answeredAll = false;
      return;
    }

    if (question.type === 'multiple' || question.type === 'boolean') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && question.userAnswer !== correctOption.id) {
        allCorrect = false;
      }
    }
    // Para preguntas abiertas, no hay verificación automática
  });

  return { allCorrect, answeredAll };
};
