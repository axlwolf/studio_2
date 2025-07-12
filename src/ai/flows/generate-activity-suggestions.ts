'use server';

/**
 * @fileOverview Generates activity suggestions for lesson plans using the Google Gemini API.
 *
 * - generateActivitySuggestions - A function that generates activity suggestions for a lesson plan.
 * - GenerateActivitySuggestionsInput - The input type for the generateActivitySuggestions function.
 * - GenerateActivitySuggestionsOutput - The return type for the generateActivitySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActivitySuggestionsInputSchema = z.object({
  grade: z.string().describe('The grade level for the lesson plan.'),
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The specific topic within the subject.'),
  activityType: z.string().describe('The type of activity (e.g., reading, discussion, project).'),
});
export type GenerateActivitySuggestionsInput = z.infer<typeof GenerateActivitySuggestionsInputSchema>;

const GenerateActivitySuggestionsOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the activity.'),
    description: z.string().describe('A detailed description of the activity.'),
    materials: z.string().describe('A list of materials needed for the activity.'),
  })
);
export type GenerateActivitySuggestionsOutput = z.infer<typeof GenerateActivitySuggestionsOutputSchema>;

export async function generateActivitySuggestions(
  input: GenerateActivitySuggestionsInput
): Promise<GenerateActivitySuggestionsOutput> {
  return generateActivitySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActivitySuggestionsPrompt',
  input: {schema: GenerateActivitySuggestionsInputSchema},
  output: {schema: GenerateActivitySuggestionsOutputSchema},
  prompt: `Genera 3 sugerencias de actividades para una sección de planeación.
  Contexto: Grado: {{{grade}}}, Asignatura: {{{subject}}}, tema: {{{topic}}}.
  Tipo: {{{activityType}}}. Asegúrate de que sean inclusivas y sigan NEM.
  Devuelve como arreglo JSON con título, descripción y materiales.`,
});

const generateActivitySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateActivitySuggestionsFlow',
    inputSchema: GenerateActivitySuggestionsInputSchema,
    outputSchema: GenerateActivitySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
