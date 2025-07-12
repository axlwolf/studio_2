
'use server';

import { LessonPlan } from '@/types';

const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    userId: '1',
    title: 'El Ciclo del Agua',
    grade: '3er Grado',
    subject: 'Ciencias Naturales',
    duration: '2 semanas',
    status: 'Completado',
    lastModified: new Date(new Date().setDate(new Date().getDate() - 5)),
    activities: [
        { title: 'Introducción', description: 'Ver video sobre el ciclo del agua.', materials: 'Proyector, video' },
        { title: 'Experimento', description: 'Crear un ciclo del agua en una bolsa.', materials: 'Bolsas Ziploc, agua, marcadores' },
    ],
    createdAt: new Date(),
    formativeField: 'Saberes y Pensamiento Científico',
    articulatingAxis: 'Vida saludable',
    content: 'El ciclo del agua y su importancia para la vida.',
    pda: 'Comprende que el agua es un recurso vital.',
    contextDiagnosis: 'Grupo de 3er grado con interés en temas de naturaleza.'
  },
  {
    id: '2',
    userId: '1',
    title: 'Introducción a las Fracciones',
    grade: '4º Grado',
    subject: 'Matemáticas',
    duration: '3 sesiones',
    status: 'Borrador',
    lastModified: new Date(new Date().setDate(new Date().getDate() - 1)),
    activities: [],
    createdAt: new Date(),
  },
];


// Create
export async function createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'lastModified' | 'status'>): Promise<string> {
  console.log('Creating lesson plan (mock):', plan);
  const newId = (mockLessonPlans.length + 1).toString();
  return Promise.resolve(newId);
}

// Read (all for user)
export async function getLessonPlans(userId: string): Promise<LessonPlan[]> {
  console.log('Getting all lesson plans for user (mock):', userId);
  return Promise.resolve(mockLessonPlans);
}

// Read (single)
export async function getLessonPlan(planId: string): Promise<LessonPlan> {
    console.log('Getting single lesson plan (mock):', planId);
    const plan = mockLessonPlans.find(p => p.id === planId);
    if (!plan) {
        throw new Error('No such document!');
    }
    return Promise.resolve(plan);
}


// Update
export async function updateLessonPlan(planId: string, updates: Partial<Omit<LessonPlan, 'id'| 'createdAt' | 'userId'>>): Promise<void> {
  console.log('Updating lesson plan (mock):', planId, updates);
  return Promise.resolve();
}

// Delete
export async function deleteLessonPlan(planId: string): Promise<void> {
  console.log('Deleting lesson plan (mock):', planId);
  return Promise.resolve();
}
