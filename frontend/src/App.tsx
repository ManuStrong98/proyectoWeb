import React, { useState, useCallback, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import './App.css'; // Importa el CSS aquí

 interface Question {
  questionText: string;
  questionImage: string | null;
  answer: string;
 }

 function App() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [globalTimeLimit, setGlobalTimeLimit] = useState<number>(60);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [font, setFont] = useState('Arial');
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImageURL, setBgImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedState = localStorage.getItem('editorState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setTitle(parsedState.title);
      setQuestions(parsedState.questions);
      setGlobalTimeLimit(parsedState.globalTimeLimit);
      setTextColor(parsedState.textColor);
      setBgColor(parsedState.bgColor);
      setFont(parsedState.font);
      setBgImageURL(parsedState.bgImageURL);
      // No restauramos bgImageFile ya que es un objeto File y no se serializa bien
    } else {
      // Inicializa con una pregunta vacía si no hay estado guardado
      setQuestions([{ questionText: '', questionImage: null, answer: '' }]);
    }
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleQuestionTextChange = useCallback((index: number, value: string) => {
    const updated = [...questions];
    updated[index].questionText = value;
    updated[index].questionImage = null; // Desactivar imagen al ingresar texto
    setQuestions(updated);
  }, [questions, setQuestions]);

  const handleQuestionImageChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...questions];
      updated[index].questionImage = URL.createObjectURL(file);
      updated[index].questionText = ''; // Desactivar texto al seleccionar imagen
      setQuestions(updated);
    }
  }, [questions, setQuestions]);

  const handleAnswerChange = useCallback((index: number, value: string) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  }, [questions, setQuestions]);

  const handleGlobalTimeLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10);
    setGlobalTimeLimit(isNaN(time) ? 60 : time);
  }, [setGlobalTimeLimit]);

  const addQuestion = useCallback(() => {
    setQuestions([...questions, { questionText: '', questionImage: null, answer: '' }]);
  }, [questions, setQuestions]);

  const handleBgImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImageFile(file);
      const url = URL.createObjectURL(file);
      setBgImageURL(url);
    } else {
      setBgImageFile(null);
      setBgImageURL(null);
    }
  }, [setBgImageFile, setBgImageURL]);

  const handleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  }, [setTextColor]);

  const handleBgColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value);
  }, [setBgColor]);

  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  }, [setFont]);

  const handlePreview = useCallback(() => {
    localStorage.setItem('editorState', JSON.stringify({ title, questions, globalTimeLimit, textColor, bgColor, font, bgImageURL }));
    navigate('/preview', { state: { title, questions, globalTimeLimit, textColor, bgColor, font, bgImageURL } });
  }, [navigate, title, questions, globalTimeLimit, textColor, bgColor, font, bgImageURL]);

  const handleClearData = useCallback(() => {
    setTitle('');
    setQuestions([{ questionText: '', questionImage: null, answer: '' }]);
    setGlobalTimeLimit(60);
    setTextColor('#000000');
    setBgColor('#ffffff');
    setFont('Arial');
    setBgImageFile(null);
    setBgImageURL(null);
    localStorage.removeItem('editorState');
  }, [setTitle, setQuestions, setGlobalTimeLimit, setTextColor, setBgColor, setFont, setBgImageFile, setBgImageURL]);

  return (
    <div className="container">
      <h1>Editor de Preguntas</h1>

      <label>Título principal:</label>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
      />

      <h2>Preguntas y Respuestas:</h2>
      {questions.map((q, index) => (
        <div key={index} className="qa-group">
          <div className="question-input-group">
            <label htmlFor={`image-${index}`} className="upload-image-label">
              Subir Imagen
            </label>
            <input
              type="file"
              id={`image-${index}`}
              accept="image/*"
              onChange={(e) => handleQuestionImageChange(index, e)}
              style={{ display: 'none' }}
              disabled={q.questionText !== ''}
            />
            {q.questionImage && (
              <div className="image-preview">
                <img src={q.questionImage} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
            <input
              type="text"
              placeholder={`Pregunta ${index + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
              disabled={q.questionImage !== null}
            />
          </div>
          <input
            type="text"
            placeholder={`Respuesta ${index + 1}`}
            value={q.answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={addQuestion}>Añadir otra pregunta</button>

      <label htmlFor="global-time">Tiempo total (segundos):</label>
      <input
        type="number"
        id="global-time"
        value={globalTimeLimit}
        onChange={handleGlobalTimeLimitChange}
        min="1"
      />

      <h2>Personalizar apariencia:</h2>
      <div className="customization">
        <label>Color de texto:</label>
        <input
          type="color"
          value={textColor}
          onChange={handleTextColorChange}
        />

        <label>Color de fondo:</label>
        <input
          type="color"
          value={bgColor}
          onChange={handleBgColorChange}
        />

        <label>Imagen de fondo:</label>
        <div className="file-upload">
          <label htmlFor="bg-image-upload" className="file-upload-button">Seleccionar archivo</label>
          <input
            id="bg-image-upload"
            type="file"
            accept="image/*"
            onChange={handleBgImageChange}
            style={{ display: 'none' }}
          />
          <span>{bgImageFile ? bgImageFile.name : 'Sin archivos seleccionados'}</span>
        </div>

        <label>Tipo de letra:</label>
        <select value={font} onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>

      <button onClick={handlePreview}>Vista Previa</button>
      <button onClick={handleClearData} className="clear-data-button">Limpiar Datos</button>
    </div>
  );
 }

 export default App;
