// Tipos de datos
export type QuestionType = 'multiple' | 'boolean' | 'open';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  userAnswer?: string | string[];
  isEditing: boolean;
}

export interface FormData {
  title: string;
  description: string;
  questions: Question[];
  isSubmitted: boolean;
}
