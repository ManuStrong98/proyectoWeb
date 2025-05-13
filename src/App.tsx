import React, { useState } from 'react';
import './App.css';
import { FormData, Question, QuestionType } from './types';
import { createNewQuestion, getOptionsByType, verifyAnswers } from './utils/questionUtils';
import FormHeader from './components/FormHeader';
import QuestionItem from './components/QuestionItem';

function App() {
  const [formData, setFormData] = useState<FormData>({
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
  });

  // Manejo de cambios en título y descripción
  const handleFieldChange = (field: 'title' | 'description', value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Agregar nueva pregunta
  const addNewQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, createNewQuestion()]
    });
  };

  // Cambiar tipo de pregunta
  const changeQuestionType = (questionId: string, type: QuestionType) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            type,
            options: getOptionsByType(questionId, type),
            isEditing: false
          };
        }
        return q;
      })
    });
  };

  // Editar pregunta
  const toggleQuestionEdit = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            isEditing: !q.isEditing
          };
        }
        return q;
      })
    });
  };

  // Actualizar texto de pregunta
  const updateQuestionText = (questionId: string, text: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            text
          };
        }
        return q;
      })
    });
  };

  // Actualizar texto de opción
  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => {
              if (opt.id === optionId) {
                return {
                  ...opt,
                  text
                };
              }
              return opt;
            })
          };
        }
        return q;
      })
    });
  };

  // Marcar respuesta correcta
  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => ({
              ...opt,
              isCorrect: opt.id === optionId
            }))
          };
        }
        return q;
      })
    });
  };

  // Registrar respuesta del usuario
  const handleUserAnswer = (questionId: string, value: string | string[]) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            userAnswer: value
          };
        }
        return q;
      })
    });
  };

  // Verificar respuestas y mostrar resultado
  const checkAnswers = () => {
    // Si estamos en modo edición, cambiar a modo respuesta
    if (!formData.isSubmitted) {
      setFormData({
        ...formData,
        isSubmitted: true
      });
      return;
    }

    // Verificar respuestas
    const { allCorrect, answeredAll } = verifyAnswers(formData.questions);

    if (!answeredAll) {
      alert('Por favor responde todas las preguntas');
    } else if (allCorrect) {
      alert('¡Respuestas correctas! ¡Buen trabajo!');
    } else {
      alert('Hay respuestas incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <FormHeader
          title={formData.title}
          description={formData.description}
          onFieldChange={handleFieldChange}
        />

        {/* Preguntas */}
        {formData.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            isSubmitted={formData.isSubmitted}
            onUpdateQuestionText={updateQuestionText}
            onToggleQuestionEdit={toggleQuestionEdit}
            onChangeQuestionType={changeQuestionType}
            onUpdateOptionText={updateOptionText}
            onToggleCorrectOption={toggleCorrectOption}
            onUserAnswer={handleUserAnswer}
          />
        ))}

        {!formData.isSubmitted && (
          <button className="add-question-button" onClick={addNewQuestion}>
            +
          </button>
        )}

        <button className="save-button" onClick={checkAnswers}>
          {formData.isSubmitted ? "Verificar" : "Guardar"}
        </button>
      </div>
    </div>
  );
}

export default App;
