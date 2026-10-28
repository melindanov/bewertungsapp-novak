// Entsprechen den JSON-Antworten der Sequelize-Modelle im Backend

export interface Team {
  id: number;
  name: string;
  klasse: string;
  createdAt: string;
  updatedAt: string;
}

export interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  weight: number;
}

export interface Juror {
  id: number;
  name: string;
}

export interface Evaluation {
  id: number;
  projectId: number;
  criterionId: number;
  jurorId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  Criterion?: Criterion;
  Juror?: Juror;
}

export interface Project {
  id: number;
  teamId: number;
  titel: string;
  beschreibung: string;
  praesentiertAm: string;
  createdAt: string;
  updatedAt: string;
  Team?: Team;
  Evaluations?: Evaluation[];
}
