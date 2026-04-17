import Link from 'next/link'
import Header from '@/components/layout/header/Header'
import { Footer } from '@/components/layout/footer/Footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-muted/20 px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[12rem] font-black text-primary/10 leading-none select-none tracking-tighter">
              404
            </h1>
          </div>
          <div className="-mt-20 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-title uppercase tracking-tighter mb-6">
              La ligne d&apos;arrivée est introuvable.
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Désolé, la page que vous cherchez a dû faire un détour imprévu. 
              Même les meilleurs coureurs peuvent parfois se tromper de chemin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="default" className="text-lg px-10 h-14">
                <Link href="/">
                  Retour à l&apos;accueil
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-10 h-14">
                <Link href="/evenements">
                  Voir nos événements
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
