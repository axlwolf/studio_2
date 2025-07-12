
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit, Loader2, Save, Sparkles, Trash2 } from 'lucide-react';
import { generateActivitySuggestions, GenerateActivitySuggestionsOutput } from '@/ai/flows/generate-activity-suggestions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createLessonPlan } from '@/services/planner';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const plannerFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  grade: z.string().min(1, 'El grado es requerido'),
  subject: z.string().min(1, 'La asignatura es requerida'),
  duration: z.string().min(1, 'La duración es requerida'),
  contextDiagnosis: z.string().optional(),
  formativeField: z.string().optional(),
  articulatingAxis: z.string().optional(),
  content: z.string().optional(),
  pda: z.string().optional(),
  activities: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        materials: z.string(),
      })
    )
    .optional(),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

const mockSelectOptions = {
  grades: ['1er Grado', '2º Grado', '3er Grado'],
  subjects: ['Español', 'Matemáticas', 'Ciencias', 'Historia', 'Geografía', 'Formación Cívica y Ética'],
  formativeFields: ['Lenguajes', 'Saberes y Pensamiento Científico', 'Ética, Naturaleza y Sociedades', 'De lo Humano y lo Comunitario'],
  articulatingAxes: ['Inclusión', 'Pensamiento Crítico', 'Interculturalidad crítica', 'Igualdad de género', 'Vida saludable', 'Apropiación de las culturas a través de la lectura y la escritura', 'Artes y experiencias estéticas'],
};

export function PlannerForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<GenerateActivitySuggestionsOutput>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      title: '',
      grade: '',
      subject: '',
      duration: '',
      activities: [],
    },
  });

  const watchedValues = form.watch();

  async function handleGenerateSuggestions() {
    const { grade, subject, title: topic } = watchedValues;
    if (!grade || !subject || !topic) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor, completa los campos de Título, Grado y Asignatura para generar sugerencias.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setAiSuggestions([]);

    try {
      const suggestions = await generateActivitySuggestions({
        grade,
        subject,
        topic,
        activityType: 'cualquiera',
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error de IA',
        description: 'No se pudieron generar las sugerencias. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function addActivity(suggestion: GenerateActivitySuggestionsOutput[0]) {
    const currentActivities = form.getValues('activities') || [];
    form.setValue('activities', [...currentActivities, suggestion]);
    setAiSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  }

  function removeActivity(index: number) {
    const currentActivities = form.getValues('activities') || [];
    form.setValue('activities', currentActivities.filter((_, i) => i !== index));
  }

  async function onSubmit(data: PlannerFormValues) {
    if (!user) {
      toast({
        title: 'Error de autenticación',
        description: 'Debes iniciar sesión para guardar una planeación.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newPlan = {
        ...data,
        userId: user.uid,
        activities: data.activities || [],
      };
      await createLessonPlan(newPlan);
      toast({
        title: 'Planeación Guardada',
        description: 'Tu planeación ha sido guardada con éxito.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar la planeación. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Crear Nueva Planeación</h1>
            <p className="text-muted-foreground">Llena los campos para crear tu planeación de clase.</p>
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Guardando...' : 'Guardar Planeación'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Información General</CardTitle>
            <CardDescription>Datos básicos de la planeación.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Título de la Planeación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. El ciclo del agua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="grade"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un grado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSelectOptions.grades.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="subject"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignatura</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una asignatura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSelectOptions.subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Duración</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. 2 semanas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Diagnóstico y Contexto NEM</CardTitle>
            <CardDescription>Alineación con la Nueva Escuela Mexicana.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              name="contextDiagnosis"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Diagnóstico del Contexto</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el contexto del grupo y la comunidad..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="formativeField"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo Formativo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un campo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSelectOptions.formativeFields.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="articulatingAxis"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eje Articulador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un eje" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSelectOptions.articulatingAxes.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Contenidos del programa a abordar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="pda"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procesos de Desarrollo de Aprendizaje (PDA)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="PDA a favorecer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold font-headline">Actividades</h2>
              <p className="text-muted-foreground">Añade actividades a tu planeación o genera ideas con IA.</p>
            </div>
            <Button
              type="button"
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              variant="outline"
              className="text-accent-foreground border-accent hover:bg-accent/10 hover:text-accent-foreground"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
              )}
              Generar Sugerencias con IA
            </Button>
          </div>

          {isGenerating && (
            <p className="text-center text-muted-foreground py-8">
              Generando ideas... <Loader2 className="inline-block h-4 w-4 animate-spin" />
            </p>
          )}

          {aiSuggestions.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold font-headline flex items-center gap-2 text-primary">
                <BrainCircuit className="h-5 w-5" />
                Sugerencias de la IA
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {aiSuggestions.map((suggestion, index) => (
                  <Card key={index} className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base font-headline">{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
                      <p className="text-sm">
                        <strong className="font-medium">Materiales:</strong> {suggestion.materials}
                      </p>
                      <Button size="sm" className="mt-4 w-full" onClick={() => addActivity(suggestion)}>
                        Añadir a la planeación
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {watchedValues.activities && watchedValues.activities.length > 0 ? (
              watchedValues.activities.map((activity, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-headline">{activity.title}</CardTitle>
                      <CardDescription>Actividad {index + 1}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeActivity(index)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar actividad</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                    <p className="text-sm">
                      <strong className="font-medium">Materiales:</strong> {activity.materials}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert variant="default" className="border-dashed">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>No hay actividades</AlertTitle>
                <AlertDescription>
                  Aún no has añadido ninguna actividad. Usa el generador de IA para obtener ideas.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
