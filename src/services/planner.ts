
'use server';

import { LessonPlan } from '@/types';

const getPlansFromStorage = (): LessonPlan[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const plansJson = window.localStorage.getItem('lessonPlans');
    if (!plansJson) return [];
    
    // Parse and revive dates
    const plans = JSON.parse(plansJson);
    return plans.map((plan: any) => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        lastModified: new Date(plan.lastModified),
    }));

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
export async function createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'lastModified' | 'status'>): Promise<string> {
  const plans = getPlansFromStorage();
  const newId = Date.now().toString();
  const newPlan: LessonPlan = {
      ...plan,
      id: newId,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'Borrador'
  };
  const updatedPlans = [...plans, newPlan];
  savePlansToStorage(updatedPlans);
  console.log('Creating lesson plan (localStorage):', newPlan);
  return Promise.resolve(newId);
}

// Read (all)
export async function getLessonPlans(): Promise<LessonPlan[]> {
  console.log('Getting all lesson plans from localStorage');
  const plans = getPlansFromStorage();
  return Promise.resolve(plans.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()));
}

// Read (single)
export async function getLessonPlan(planId: string): Promise<LessonPlan | null> {
    console.log('Getting single lesson plan from localStorage:', planId);
    const plans = getPlansFromStorage();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      return Promise.resolve(null);
    }
    return Promise.resolve(plan);
}


// Update
export async function updateLessonPlan(planId: string, updates: Partial<Omit<LessonPlan, 'id'| 'createdAt' | 'userId'>>): Promise<void> {
  console.log('Updating lesson plan (localStorage):', planId, updates);
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
  console.log('Deleting lesson plan (localStorage):', planId);
  let plans = getPlansFromStorage();
  const updatedPlans = plans.filter(p => p.id !== planId);
  savePlansToStorage(updatedPlans);
  return Promise.resolve();
}
