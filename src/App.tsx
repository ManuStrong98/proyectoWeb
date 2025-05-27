import React, { useCallback } from 'react';
import './App.css';
import { FormData, Question, QuestionType } from './types';
import { createNewQuestion, getOptionsByType, verifyAnswers } from './utils/questionUtils';
import FormHeader from './components/FormHeader';
import QuestionItem from './components/QuestionItem';

const initialFormData: FormData = {
  title: 'Título del cuestionario',
  description: 'Descripción del cuestionario\nLorem ipsum es el texto que se usa habitualmente en diseño gráfico en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto',
  questions: [
    {
      id: '1',
      text: 'Pregunta interactiva',
      type: 'multiple',
      options: [
        { id: '1-1', text: 'opcion 1', isCorrect: true },
        { id: '1-2', text: 'opcion 2', isCorrect: false },
        { id: '1-3', text: 'opcion 3', isCorrect: false }
      ],
      isEditing: false
    }
  ],
  isSubmitted: false
};

const useFormState = () => {
  const [formData, setFormData] = React.useState<FormData>(initialFormData);

  const updateField = useCallback((field: 'title' | 'description', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addQuestion = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, createNewQuestion()]
    }));
  }, []);

  const updateQuestionType = useCallback((questionId: string, type: QuestionType) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, type, options: getOptionsByType(questionId, type), isEditing: false } : q
      )
    }));
  }, []);

  const toggleEditMode = useCallback((questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, isEditing: !q.isEditing } : q
      )
    }));
  }, []);

  const updateQuestionText = useCallback((questionId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, text } : q
      )
    }));
  }, []);

  const updateOptionText = useCallback((questionId: string, optionId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt =>
                opt.id === optionId ? { ...opt, text } : opt
              )
            }
          : q
      )
    }));
  }, []);

  const setCorrectOption = useCallback((questionId: string, optionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt => ({
                ...opt,
                isCorrect: opt.id === optionId
              }))
            }
          : q
      )
    }));
  }, []);

  const setUserAnswer = useCallback((questionId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, userAnswer: value } : q
      )
    }));
  }, []);

  const submitForm = useCallback(() => {
    setFormData(prev => ({ ...prev, isSubmitted: true }));
  }, []);

  const verifyFormAnswers = useCallback(() => {
    const { allCorrect, answeredAll } = verifyAnswers(formData.questions);
    
    if (!answeredAll) {
      alert('Por favor responde todas las preguntas');
    } else if (allCorrect) {
      alert('¡Respuestas correctas! ¡Buen trabajo!');
    } else {
      alert('Hay respuestas incorrectas. Inténtalo de nuevo.');
    }
  }, [formData.questions]);

  return {
    formData,
    updateField,
    addQuestion,
    updateQuestionType,
    toggleEditMode,
    updateQuestionText,
    updateOptionText,
    setCorrectOption,
    setUserAnswer,
    submitForm,
    verifyFormAnswers
  };
};

const App: React.FC = () => {
  const {
    formData,
    updateField,
    addQuestion,
    updateQuestionType,
    toggleEditMode,
    updateQuestionText,
    updateOptionText,
    setCorrectOption,
    setUserAnswer,
    submitForm,
    verifyFormAnswers
  } = useFormState();

  const handleCheckAnswers = useCallback(() => {
    if (!formData.isSubmitted) {
      submitForm();
    } else {
      verifyFormAnswers();
    }
  }, [formData.isSubmitted, submitForm, verifyFormAnswers]);

  return (
    <div className="app-container">
      <div className="form-container">
        <FormHeader
          title={formData.title}
          description={formData.description}
          onFieldChange={updateField}
        />

        {formData.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            isSubmitted={formData.isSubmitted}
            onUpdateQuestionText={updateQuestionText}
            onToggleQuestionEdit={toggleEditMode}
            onChangeQuestionType={updateQuestionType}
            onUpdateOptionText={updateOptionText}
            onToggleCorrectOption={setCorrectOption}
            onUserAnswer={setUserAnswer}
          />
        ))}

        {!formData.isSubmitted && (
          <button className="add-question-button" onClick={addQuestion}>
            +
          </button>
        )}

        <button className="save-button" onClick={handleCheckAnswers}>
          {formData.isSubmitted ? "Verificar" : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default App;