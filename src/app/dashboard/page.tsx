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

const lessonPlans = [
  {
    id: '1',
    title: 'Poesía Regional y su Impacto Cultural',
    grade: '2º Grado',
    subject: 'Español',
    status: 'Borrador',
    lastModified: 'Hace 2 días',
  },
  {
    id: '2',
    title: 'Ecuaciones de Primer Grado',
    grade: '1er Grado',
    subject: 'Matemáticas',
    status: 'Completado',
    lastModified: 'Hace 1 semana',
  },
  {
    id: '3',
    title: 'La Revolución Mexicana',
    grade: '3er Grado',
    subject: 'Historia',
    status: 'Completado',
    lastModified: 'Hace 3 semanas',
  },
  {
    id: '4',
    title: 'El Ciclo del Agua',
    grade: '1er Grado',
    subject: 'Ciencias',
    status: 'Borrador',
    lastModified: 'Hace 1 mes',
  },
];

export default function DashboardPage() {
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
        {lessonPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-lg font-headline leading-tight">{plan.title}</CardTitle>
                        <CardDescription>{plan.grade} - {plan.subject}</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <PenSquare className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-between text-sm text-muted-foreground">
                <Badge variant={plan.status === 'Completado' ? 'default' : 'secondary'}>
                    {plan.status}
                </Badge>
                <span>{plan.lastModified}</span>
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
      </div>
    </>
  );
}
