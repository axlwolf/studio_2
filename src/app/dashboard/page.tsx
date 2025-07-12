
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, PenSquare, PlusCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { deleteLessonPlan, getLessonPlans } from '@/services/planner';
import { LessonPlan } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [planToDelete, setPlanToDelete] = useState<LessonPlan | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getLessonPlans(user.uid)
        .then(setLessonPlans)
        .catch((err) => {
          console.error(err);
          toast({
            title: 'Error',
            description: 'No se pudieron cargar las planeaciones.',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [user, toast]);
  
  const handleDelete = async () => {
    if (!planToDelete || !planToDelete.id) return;
    try {
      await deleteLessonPlan(planToDelete.id);
      setLessonPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      toast({
        title: 'Planeación eliminada',
        description: 'La planeación ha sido eliminada con éxito.',
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'No se pudo eliminar la planeación.',
        variant: 'destructive',
      });
    } finally {
        setPlanToDelete(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Fecha desconocida';
    try {
      const date = timestamp.toDate();
      return `Hace ${formatDistanceToNow(date, { locale: es })}`;
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Mis Planeaciones</h1>
          <p className="text-muted-foreground">Aquí puedes ver y gestionar todas tus planeaciones.</p>
        </div>
        <Link href="/planner/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Planeación
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
           Array.from({ length: 4 }).map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </CardContent>
             </Card>
           ))
        ) : (
          <>
            {lessonPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-headline leading-tight">{plan.title}</CardTitle>
                      <CardDescription>
                        {plan.grade} - {plan.subject}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/planner/${plan.id}/edit`}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onSelect={(e) => { e.preventDefault(); setPlanToDelete(plan); }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de eliminar?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la planeación
                                "{planToDelete?.title}".
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPlanToDelete(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-between text-sm text-muted-foreground">
                  <Badge variant={plan.status === 'Completado' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                  <span>{formatDate(plan.lastModified)}</span>
                </CardContent>
              </Card>
            ))}
            <Link href="/planner/new" className="flex">
              <Card className="flex flex-col items-center justify-center border-2 border-dashed h-full w-full hover:border-primary transition-colors hover:bg-muted/50">
                <div className="text-center text-muted-foreground p-6">
                  <PlusCircle className="mx-auto h-12 w-12 mb-2" />
                  <p className="font-semibold">Crear nueva planeación</p>
                </div>
              </Card>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
