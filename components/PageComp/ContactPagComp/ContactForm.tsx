'use client'

import { useActionState } from 'react'; // Ou useFormState selon ta version de React/Next
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react'; // Assure-toi d'avoir lucide-react
import { sendContactEmail } from '@/src/features/contact/contact.action';

export function ContactForm() {
  const [state, action, isPending] = useActionState(sendContactEmail, null);

  return (
    <section>


    <Card className="p-4 px-1 space-y-5">
      <CardHeader className='px-2'>
        <CardTitle className='text-xl'>Envoyez-nous un message</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous. Les champs marqués d'une * sont obligatoires.
        </CardDescription>
      </CardHeader>
      <CardContent className='px-1 lg:px-2'>
        {state?.success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
            <h3 className="font-bold mb-1">Message envoyé !</h3>
            <p>{state.message}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Envoyer un autre message
            </Button>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Jean Dupont" 
                required 
                aria-describedby="name-error"
              />
              {state?.errors?.name && (
                <p id="name-error" className="text-sm text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="email@exemple.fr" 
                  required 
                />
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                )}
              </div>

              {/* Téléphone (Optionnel) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="phone">Téléphone</Label>
                  <span className="text-xs text-muted-foreground">(Optionnel)</span>
                </div>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="06 12 34 XX XX" 
                />
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet *</Label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="Demande d'adhésion, question..." 
                required 
              />
               {state?.errors?.subject && (
                  <p className="text-sm text-red-500">{state.errors.subject[0]}</p>
                )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Votre message ici..." 
                className="min-h-[120px]" 
                required 
              />
              {state?.errors?.message && (
                  <p className="text-sm text-red-500">{state.errors.message[0]}</p>
                )}
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le message <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
        </section>
  );
}