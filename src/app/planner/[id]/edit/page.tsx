
'use client';

import { PlannerForm } from '@/components/planner-form';
import { getLessonPlan } from '@/services/planner';
import type { LessonPlan } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function EditPlannerPage({ params: { id } }: { params: { id: string } }) {
  const { toast } = useToast();
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
        if (!id) return;
        setLoading(true);
        try {
            const plan = await getLessonPlan(id);
            if (plan) {
                setLessonPlan(plan);
            } else {
                 toast({
                    title: 'Error',
                    description: 'La planeación no fue encontrada.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error(error);
            toast({
            title: 'Error',
            description: 'No se pudo cargar la planeación para editar.',
            variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }
    
    loadPlan();
  }, [id, toast]);

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="w-full h-[200px] rounded-lg" />
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
    )
  }

  if (!lessonPlan) {
    return <div>Planeación no encontrada.</div>;
  }

  return <PlannerForm existingPlan={lessonPlan} />;
}
