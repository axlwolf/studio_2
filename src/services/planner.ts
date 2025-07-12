
'use server';

import { db } from '@/lib/firebase';
import { LessonPlan } from '@/types';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, Timestamp, getDoc } from 'firebase/firestore';

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

// Read (all for user)
export async function getLessonPlans(userId: string): Promise<LessonPlan[]> {
  const q = query(collection(db, 'lessonPlans'), where('userId', '==', userId), orderBy('lastModified', 'desc'));
  const querySnapshot = await getDocs(q);
  const plans: LessonPlan[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    plans.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt as Timestamp,
        lastModified: data.lastModified as Timestamp,
    } as LessonPlan);
  });
  return plans;
}

// Read (single)
export async function getLessonPlan(planId: string): Promise<LessonPlan> {
    const docRef = doc(db, 'lessonPlans', planId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error('No such document!');
    }

    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        lastModified: data.lastModified as Timestamp,
    } as LessonPlan;
}


// Update
export async function updateLessonPlan(planId: string, updates: Partial<Omit<LessonPlan, 'id'| 'createdAt' | 'userId'>>): Promise<void> {
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
