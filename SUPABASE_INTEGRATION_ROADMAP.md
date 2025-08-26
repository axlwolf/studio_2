# Roadmap: Integración de Supabase en NEM Planner Pro

Esta es una guía paso a paso para migrar la aplicación del almacenamiento local a un backend completo con Supabase, utilizando el esquema de base de datos que proporcionaste.

## Fase 1: Configuración y Conexión

El objetivo de esta fase es instalar las dependencias necesarias y establecer la conexión inicial con tu proyecto de Supabase.

1.  **Instalar Librerías de Supabase:**
    Abre tu terminal y ejecuta los siguientes comandos para añadir los clientes de Supabase a tu proyecto:
    ```bash
    npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr
    ```

2.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz de tu proyecto (si no existe) y añade las claves de tu proyecto de Supabase. Las encontrarás en `Project Settings > API` en tu dashboard de Supabase.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=URL_DE_TU_PROYECTO
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
    ```

3.  **Crear el Cliente de Supabase:**
    Crea un archivo en `src/lib/supabase-client.ts` para inicializar y exportar el cliente de Supabase. Esto te permitirá reutilizar la misma instancia en toda la aplicación.

    ```typescript
    // src/lib/supabase-client.ts
    import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
    
    export const supabase = createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
    ```
    *Nota: Dado que la app usa el App Router de Next.js, investiga el uso de `@supabase/ssr` para una integración más moderna y del lado del servidor si lo necesitas.*


## Fase 2: Autenticación de Usuarios

Aquí reemplazarás el sistema de usuario local falso por el sistema de autenticación de Supabase.

1.  **Crear Páginas de Autenticación:**
    -   Crea una página de `login` (`/login`) con un formulario para correo y contraseña.
    -   Crea una página de `signup` (`/signup`) para el registro de nuevos usuarios.
    -   Utiliza `supabase.auth.signInWithPassword()` y `supabase.auth.signUp()` para manejar la lógica.

2.  **Proteger Rutas:**
    -   Modifica el `layout` o `middleware` principal para redirigir a los usuarios no autenticados a la página de `/login`.
    -   Usa `supabase.auth.getSession()` para verificar si hay una sesión activa.

3.  **Gestionar Sesión en la UI:**
    -   Modifica el componente `AppLayout` (`src/components/app-layout.tsx`) para:
        -   Mostrar el nombre o avatar del usuario real.
        -   Añadir un botón de "Cerrar Sesión" que llame a `supabase.auth.signOut()`.
        -   Crear un contexto (`AuthContext`) para que el estado de la sesión esté disponible en toda la app.

## Fase 3: Migración de Datos (Capa de Servicio)

Esta es la fase más importante. Reemplazarás las funciones del archivo `src/services/planner.ts` que usan `localStorage` por llamadas a la API de Supabase.

1.  **Definir Tipos de Datos:**
    Crea un archivo (`src/types/supabase.ts`) para definir los tipos de TypeScript que se correspondan con tus tablas y vistas de Supabase. Esto te dará autocompletado y seguridad de tipos.

2.  **Reescribir `getLessonPlans()`:**
    -   Utiliza `supabase.from('view_plans').select('*')` para obtener todas las planeaciones del usuario autenticado (`auth.uid()`).
    -   La vista `view_plans` ya agrega la información relacionada, lo que simplifica la consulta.

3.  **Reescribir `getLessonPlan(id)`:**
    -   Usa `supabase.from('view_plans').select('*').eq('id', id).single()` para obtener una sola planeación.

4.  **Reescribir `createLessonPlan()` y `updateLessonPlan()`:**
    -   Estas dos funciones se pueden unificar en una sola que llame a tu función de base de datos `save_plans`.
    -   Usa `supabase.rpc('save_plans', { ...args })`, pasando todos los campos del formulario como argumentos a la función. El `user_id` se gestionará automáticamente por la base de datos.

5.  **Reescribir `deleteLessonPlan(id)`:**
    -   Usa `supabase.from('plans').delete().eq('id', id)` para eliminar una planeación.

## Fase 4: Integración con la Interfaz de Usuario

Finalmente, asegúrate de que los componentes que muestran y modifican datos estén correctamente conectados a la nueva capa de servicio de Supabase.

1.  **Actualizar el Dashboard (`/dashboard/page.tsx`):**
    -   Asegúrate de que la llamada a `getLessonPlans()` ahora obtenga los datos desde Supabase.
    -   Maneja los estados de carga y error mientras se obtienen los datos.

2.  **Actualizar el Formulario (`/planner/[id]/edit/page.tsx` y `/planner/new/page.tsx`):**
    -   Verifica que `getLessonPlan(id)` funcione correctamente para rellenar el formulario en modo de edición.
    -   Asegúrate de que el `onSubmit` del formulario llame a la nueva función `save_plans` con los datos correctos.

3.  **Página de Perfil (`/settings/page.tsx`):**
    -   Crea la lógica para obtener el perfil del usuario desde la tabla `profiles`.
    -   Implementa el formulario para que los usuarios puedan actualizar su información llamando a la función `save_profile` que creaste.

¡Mucha suerte con el proyecto, compa! Espero que esta guía te sirva para dejar tu aplicación jalando al cien con Supabase.