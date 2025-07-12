
export type LessonPlan = {
  id: string;
  userId: string;
  title: string;
  grade: string;
  subject: string;
  duration: string;
  contextDiagnosis?: string;
  formativeField?: string;
  articulatingAxis?: string;
  content?: string;
  pda?: string;
  activities: {
    title: string;
    description: string;
    materials: string;
  }[];
  status: 'Borrador' | 'Completado';
  createdAt: Date;
  lastModified: Date;
};
