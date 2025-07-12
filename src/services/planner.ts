import { LessonPlan } from '@/types';

const DUMMY_PLANS: Omit<LessonPlan, 'id' | 'createdAt' | 'lastModified' | 'userId'>[] = [
    {
        title: 'Explorando los Ecosistemas',
        grade: '4º Grado',
        subject: 'Ética, Naturaleza y Sociedades (C. del Medio)',
        duration: '2 Sesiones',
        status: 'Completado',
        contextDiagnosis: 'Grupo participativo con interés en la naturaleza. Acceso a patio escolar con árboles.',
        formativeField: 'Ética, Naturaleza y Sociedades',
        articulatingAxis: 'Vida saludable',
        content: 'Interacciones entre plantas, animales y el entorno natural, y su importancia para la vida.',
        pda: 'Comprende que un ecosistema es el conjunto de seres vivos y no vivos, y que los seres humanos somos parte de él.',
        activities: [
            { title: 'Safari Fotográfico', description: 'Los alumnos exploran el patio escolar y toman fotografías de diferentes seres vivos y elementos no vivos.', materials: 'Cámaras o celulares, lupa, cuaderno de notas.' },
            { title: 'Creación de un Terrario', description: 'En equipos, los alumnos construyen un pequeño terrario en un frasco para observar un ecosistema en miniatura.', materials: 'Frascos de vidrio, tierra, piedras pequeñas, plantas pequeñas, insectos (opcional).' }
        ]
    },
    {
        title: 'La Narrativa de Nuestra Comunidad',
        grade: 'Secundaria 1er Grado',
        subject: 'Lenguajes (Español)',
        duration: '3 Sesiones',
        status: 'Borrador',
        contextDiagnosis: '',
        formativeField: 'Lenguajes',
        articulatingAxis: 'Apropiación de las culturas a través de la lectura y la escritura',
        content: 'Narraciones de la comunidad y de otros lugares.',
        pda: 'Reconoce y utiliza recursos narrativos (personajes, espacio, tiempo, trama) para crear sus propias historias.',
        activities: [
            { title: 'Entrevista a un Anciano', description: 'Los alumnos entrevistan a una persona mayor de su comunidad para recopilar una historia o leyenda local.', materials: 'Grabadora de voz o celular, cuaderno de preguntas.' },
        ]
    },
    {
        title: 'Resolviendo Problemas con Fracciones',
        grade: '5º Grado',
        subject: 'Saberes y Pensamiento Científico (Matemáticas)',
        duration: '1 Sesión',
        status: 'Borrador',
        contextDiagnosis: '',
        formativeField: 'Saberes y Pensamiento Científico',
        articulatingAxis: 'Pensamiento Crítico',
        content: 'Resolución de problemas que implican sumas y restas de fracciones con diferentes denominadores.',
        pda: 'Utiliza diversas estrategias para resolver problemas de suma y resta de fracciones.',
        activities: [
            { title: 'Recetas de Cocina', description: 'Los alumnos trabajan con recetas de cocina, ajustando las cantidades de los ingredientes, lo que requiere sumar o restar fracciones.', materials: 'Recetas impresas, papel y lápiz.' },
            { title: 'La Pizzería Matemática', description: 'Se simula una pizzería donde los alumnos deben calcular porciones de pizza para resolver problemas de reparto.', materials: 'Círculos de papel representando pizzas, tijeras, plumones.' },
        ]
    },
];

const getPlansFromStorage = (): LessonPlan[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const plansJson = window.localStorage.getItem('lessonPlans');
    if (plansJson) {
      const plans = JSON.parse(plansJson);
      // Ensure dates are parsed correctly
      return plans.map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          lastModified: new Date(plan.lastModified),
      }));
    }
    
    // If no plans, create and save dummy data
    const initialPlans: LessonPlan[] = DUMMY_PLANS.map((plan, index) => ({
        ...plan,
        id: `plan-${index + 1}-${Date.now()}`,
        userId: 'local-user',
        createdAt: new Date(),
        lastModified: new Date(),
    }));
    savePlansToStorage(initialPlans);
    return initialPlans;

  } catch (error) {
    console.error('Error reading from localStorage', error);
    return [];
  }
};

const savePlansToStorage = (plans: LessonPlan[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem('lessonPlans', JSON.stringify(plans));
    } catch (error) {
        console.error('Error saving to localStorage', error);
    }
};

// Create
export async function createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'lastModified' | 'userId'>): Promise<string> {
  const plans = getPlansFromStorage();
  const newId = `plan-${Date.now()}`;
  const newPlan: LessonPlan = {
      ...plan,
      id: newId,
      userId: 'local-user',
      createdAt: new Date(),
      lastModified: new Date(),
  };
  const updatedPlans = [...plans, newPlan];
  savePlansToStorage(updatedPlans);
  return Promise.resolve(newId);
}

// Read (all)
export async function getLessonPlans(): Promise<LessonPlan[]> {
  const plans = getPlansFromStorage();
  return Promise.resolve(plans.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()));
}

// Read (single)
export async function getLessonPlan(planId: string): Promise<LessonPlan | null> {
    const plans = getPlansFromStorage();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      return Promise.resolve(null);
    }
    return Promise.resolve(plan);
}


// Update
export async function updateLessonPlan(planId: string, updates: Partial<Omit<LessonPlan, 'id'| 'createdAt' | 'userId'>>): Promise<void> {
  let plans = getPlansFromStorage();
  const planIndex = plans.findIndex(p => p.id === planId);
  if (planIndex === -1) {
      throw new Error('Plan not found for update');
  }
  plans[planIndex] = {
      ...plans[planIndex],
      ...updates,
      lastModified: new Date(),
  };
  savePlansToStorage(plans);
  return Promise.resolve();
}

// Delete
export async function deleteLessonPlan(planId: string): Promise<void> {
  let plans = getPlansFromStorage();
  const updatedPlans = plans.filter(p => p.id !== planId);
  if (updatedPlans.length === plans.length) {
    console.warn(`Plan with ID ${planId} not found for deletion.`);
  }
  savePlansToStorage(updatedPlans);
  return Promise.resolve();
}
