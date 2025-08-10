export interface ICIQSFAnswers {
  userId: string;
  date: string;
  sum: number;
  observations?: string;
  questions: Record<Question['id'], string | number | boolean | string[]>;
}

export interface QuestionOptions {
  label: string;
  value: any;
}

export interface Question {
  id: string;
  text: string;
  type:
    | 'text'
    | 'radio'
    | 'checkbox'
    | 'slider'
    | 'select'
    | 'date'
    | 'time'
    | 'number';
  options?: QuestionOptions[];
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
  value?: number | string | boolean | string[];
  required?: boolean;
  placeholder?: string;
}
