import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Tipos de datos
type QuestionType = 'multiple' | 'boolean' | 'open';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  userAnswer?: string | string[];
  isEditing: boolean;
}

interface FormData {
  title: string;
  description: string;
  questions: Question[];
  isSubmitted: boolean;
}

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

  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejo de cambios en título y descripción
  const handleFieldChange = (field: 'title' | 'description', value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Agregar nueva pregunta
  const addNewQuestion = () => {
    const newQuestionId = `q-${Date.now()}`;
    const newQuestion: Question = {
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

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  // Cambiar tipo de pregunta
  const changeQuestionType = (questionId: string, type: QuestionType) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => {
        if (q.id === questionId) {
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
          } else { // open
            options = [];
          }
          
          return {
            ...q,
            type,
            options,
            isEditing: false
          };
        }
        return q;
      })
    });
    
    setShowMenu(null);
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
          if (q.type === 'multiple') {
            return {
              ...q,
              options: q.options.map(opt => ({
                ...opt,
                isCorrect: opt.id === optionId
              }))
            };
          } else {
            return {
              ...q,
              options: q.options.map(opt => ({
                ...opt,
                isCorrect: opt.id === optionId
              }))
            };
          }
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
    let allCorrect = true;
    let answeredAll = true;

    formData.questions.forEach(question => {
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
        {/* Título */}
        <div className="field-container">
          {editingField === 'title' ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="edit-input"
            />
          ) : (
            <h2 onClick={() => setEditingField('title')}>
              {formData.title}
              <button className="edit-button" onClick={(e) => {
                e.stopPropagation();
                setEditingField('title');
              }}>
                ✎
              </button>
            </h2>
          )}
        </div>

        {/* Descripción */}
        <div className="field-container">
          {editingField === 'description' ? (
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="edit-textarea"
            />
          ) : (
            <p onClick={() => setEditingField('description')}>
              {formData.description}
              <button className="edit-button" onClick={(e) => {
                e.stopPropagation();
                setEditingField('description');
              }}>
                ✎
              </button>
            </p>
          )}
        </div>

        {/* Preguntas */}
        {formData.questions.map((question, index) => (
          <div key={question.id} className="question-container">
            {/* Texto de la pregunta */}
            <div className="question-header">
              {question.isEditing ? (
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestionText(question.id, e.target.value)}
                  onBlur={() => toggleQuestionEdit(question.id)}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <h3>
                  {question.text}
                  <button className="edit-button" onClick={() => toggleQuestionEdit(question.id)}>
                    ✎
                  </button>
                  <button className="settings-button" onClick={() => setShowMenu(question.id)}>
                    ⚙️
                  </button>
                </h3>
              )}

              {/* Menú de tipo de pregunta */}
              {showMenu === question.id && (
                <div className="question-type-menu" ref={menuRef}>
                  <div className="menu-option" onClick={() => changeQuestionType(question.id, 'multiple')}>
                    Elección múltiple
                  </div>
                  <div className="menu-option" onClick={() => changeQuestionType(question.id, 'boolean')}>
                    Verdadero / Falso
                  </div>
                  <div className="menu-option" onClick={() => changeQuestionType(question.id, 'open')}>
                    Respuesta abierta
                  </div>
                </div>
              )}
            </div>

            {/* Opciones de respuesta */}
            <div className="options-container">
              {question.type === 'open' ? (
                formData.isSubmitted ? (
                  <input
                    type="text"
                    placeholder="Tu respuesta..."
                    onChange={(e) => handleUserAnswer(question.id, e.target.value)}
                    className="open-answer-input"
                  />
                ) : (
                  <div className="open-answer-placeholder">Respuesta abierta</div>
                )
              ) : (
                question.options.map((option) => (
                  <div key={option.id} className="option-item">
                    {formData.isSubmitted ? (
                      <>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          id={option.id}
                          checked={question.userAnswer === option.id}
                          onChange={() => handleUserAnswer(question.id, option.id)}
                        />
                        <label htmlFor={option.id}>{option.text}</label>
                      </>
                    ) : (
                      <div className="option-edit-container">
                        <span className="option-marker">●</span>
                        {question.isEditing ? (
                          <>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                              className="option-edit-input"
                            />
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={option.isCorrect}
                              onChange={() => toggleCorrectOption(question.id, option.id)}
                              className="correct-option-radio"
                            />
                          </>
                        ) : (
                          <span>{option.text}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
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
