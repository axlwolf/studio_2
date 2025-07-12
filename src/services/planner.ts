
'use server';

import { db } from '@/lib/firebase';
import { LessonPlan } from '@/types';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';

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
  const q = query(collection(db, 'lessonPlans'), where('userId', '==', userId), orderBy('lastModified', 'desc'));
  const querySnapshot = await getDocs(q);
  const plans: LessonPlan[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    plans.push({ 
        id: doc.id, 
        ...data,
        // Ensure timestamps are correctly typed
        createdAt: data.createdAt as Timestamp,
        lastModified: data.lastModified as Timestamp,
    } as LessonPlan);
  });
  return plans;
}

// Update
export async function updateLessonPlan(planId: string, updates: Partial<Omit<LessonPlan, 'id'| 'createdAt'>>): Promise<void> {
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
