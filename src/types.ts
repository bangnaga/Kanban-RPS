export interface CPL {
  id: string;
  code: string; // e.g., CPL-01
  description: string;
}

export interface CPMK {
  id: string;
  code: string; // e.g., CPMK-01
  description: string;
  cplId: string; // Mapped to CPL
}

export type CardType = 'lesson' | 'assessment';

export interface RubricCriteria {
  id: string;
  criteria: string;
  maxScore: number;
}

export interface KanbanCard {
  id: string;
  title: string;
  type: CardType;
  description: string;
  cpmkId: string; // Mapped to CPMK
  week: number; // Week 1 to 16
  taxonomy: string; // e.g., "C3 - Mengaplikasikan"
  method: string; // e.g., "Project-Based Learning"
  weight: number; // Weight in %, only for assessments
  rubrics: RubricCriteria[];
  cqiNote?: string; // Continuous Quality Improvement notes / Refleksi
  columnId: 'planning' | 'progress' | 'assessment' | 'completed';
}

export interface Column {
  id: 'planning' | 'progress' | 'assessment' | 'completed';
  title: string;
  color: string;
  description: string;
}
