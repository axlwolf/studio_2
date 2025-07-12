'use server';

/**
 * @fileOverview Generates NEM context for lesson plans using an AI model.
 *
 * - generateNemContext - A function that generates NEM context based on grade, subject, and topic.
 * - GenerateNemContextInput - The input type for the generateNemContext function.
 * - GenerateNemContextOutput - The return type for the generateNemContext function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNemContextInputSchema = z.object({
  grade: z.string().describe('The grade level for the lesson plan.'),
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The specific topic within the subject.'),
});
export type GenerateNemContextInput = z.infer<typeof GenerateNemContextInputSchema>;

const GenerateNemContextOutputSchema = z.object({
  formativeField: z.string().describe('El Campo Formativo principal que corresponde al tema.'),
  articulatingAxis: z.string().describe('El Eje Articulador más relevante para el tema.'),
  content: z.string().describe('Un Contenido (del programa sintético) que se aborda con el tema.'),
  pda: z.string().describe('Un Proceso de Desarrollo de Aprendizaje (PDA) asociado al contenido.'),
});
export type GenerateNemContextOutput = z.infer<typeof GenerateNemContextOutputSchema>;

export async function generateNemContext(
  input: GenerateNemContextInput
): Promise<GenerateNemContextOutput> {
  return generateNemContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNemContextPrompt',
  input: { schema: GenerateNemContextInputSchema },
  output: { schema: GenerateNemContextOutputSchema },
  prompt: `Eres un experto en la Nueva Escuela Mexicana (NEM).
  Basado en la siguiente información, genera el contexto NEM para una planeación didáctica.

  Grado: {{{grade}}}
  Asignatura: {{{subject}}}
  Tema: {{{topic}}}

  Tu tarea es devolver un solo objeto JSON con las siguientes propiedades, asegurándote que los valores seleccionados sean coherentes y pertinentes al tema.
  - formativeField: El Campo Formativo principal.
  - articulatingAxis: El Eje Articulador más relevante.
  - content: Un Contenido específico del programa sintético que se alinea con el tema.
  - pda: Un Proceso de Desarrollo de Aprendizaje (PDA) que se deriva del contenido seleccionado.
  
  Sé conciso y preciso en tus respuestas.`,
});

const generateNemContextFlow = ai.defineFlow(
  {
    name: 'generateNemContextFlow',
    inputSchema: GenerateNemContextInputSchema,
    outputSchema: GenerateNemContextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
