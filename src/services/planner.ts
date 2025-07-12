'use server';

import { db } from '@/lib/firebase';
import { LessonPlan } from '@/types';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Create
export async function createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'lastModified' | 'status'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'lessonPlans'), {
    ...plan,
    status: 'Borrador',
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });
  return docRef.id;
}

// Read
export async function getLessonPlans(userId: string): Promise<LessonPlan[]> {
  const q = query(collection(db, 'lessonPlans'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const plans: LessonPlan[] = [];
  querySnapshot.forEach((doc) => {
    plans.push({ id: doc.id, ...doc.data() } as LessonPlan);
  });
  return plans;
}

// Update
export async function updateLessonPlan(planId: string, updates: Partial<LessonPlan>): Promise<void> {
  const planRef = doc(db, 'lessonPlans', planId);
  await updateDoc(planRef, {
    ...updates,
    lastModified: serverTimestamp(),
  });
}

// Delete
export async function deleteLessonPlan(planId: string): Promise<void> {
  await deleteDoc(doc(db, 'lessonPlans', planId));
}
