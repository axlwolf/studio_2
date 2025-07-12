import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold font-headline tracking-tight">Configuración</h1>
            <p className="text-muted-foreground">Administra la configuración de tu cuenta y la aplicación.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Perfil</CardTitle>
                <CardDescription>Esta es tu información personal.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Próximamente: Edita tu nombre, correo y contraseña.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Preferencias</CardTitle>
                <CardDescription>Configuración de la aplicación.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Próximamente: Elige entre tema claro y oscuro.</p>
            </CardContent>
        </Card>
    </div>
  );
}
