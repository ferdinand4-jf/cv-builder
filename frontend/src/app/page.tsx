'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { FileText, Layout, Zap, Shield, LogOut, User, Settings, Loader2, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import toast from 'react-hot-toast'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      logout()
      toast.success('Déconnexion réussie', { duration: 3000, position: 'top-right' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('La déconnexion a échoué, réessayez.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  const features = [
    {
      icon: <FileText className="h-7 w-7" />,
      title: 'Des modèles qui se distinguent',
      description: 'Moderne, classique, optimisé ATS ou créatif — quatre mises en page réellement différentes, pas juste une couleur qui change.',
    },
    {
      icon: <Layout className="h-7 w-7" />,
      title: 'Personnalisation fine',
      description: 'Couleurs, police, taille de texte : ajustez chaque détail jusqu\'à ce que le CV vous ressemble vraiment.',
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: 'Export PDF en un clic',
      description: 'Un CV propre, prêt à envoyer, généré instantanément sans mise en page à refaire à la main.',
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Vos données, chez vous',
      description: 'Seul vous avez accès à vos CV. Rien n\'est partagé, rien n\'est revendu.',
    },
  ]

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <nav className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-display font-bold text-ink">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-redpen" />
          CV Builder
        </Link>
        <div className="flex gap-2 sm:gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="hover:bg-redpen-light hover:text-redpen-dark hidden sm:inline-flex">
                  Tableau de bord
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative h-10 w-10 rounded-full border-border hover:border-redpen/50 transition-colors"
                    disabled={isLoggingOut}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-ink text-white text-sm font-medium">
                        {getInitials(user?.firstName || '', user?.lastName || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-ink-soft truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-ink-soft mt-1">
                        <span className="inline-block px-2 py-0.5 bg-redpen-light text-redpen-dark rounded-full text-[10px] font-mono font-medium">
                          {user?.role || 'Utilisateur'}
                        </span>
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Réglages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-redpen cursor-pointer focus:text-redpen-dark focus:bg-redpen-light"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Déconnexion...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Déconnexion</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-redpen-light hover:text-redpen-dark">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-redpen hover:bg-redpen-dark text-white">
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-redpen mb-4">
            <span className="h-px w-6 bg-redpen" /> Construit pour être relu, pas juste rempli
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight">
            Le CV qui se corrige
            <br className="hidden sm:block" /> en même temps qu'il s'écrit
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-soft max-w-2xl mx-auto leading-relaxed">
            Choisissez un modèle, remplissez vos informations, ajustez les couleurs —
            et exportez un CV prêt à postuler, sans jamais toucher à une mise en page.
          </p>
          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <Link href="/register">
                  <Button size="lg" className="bg-redpen hover:bg-redpen-dark text-white">
                    Créer mon CV gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-border">
                    Se connecter
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="bg-redpen hover:bg-redpen-dark text-white">
                  Aller au tableau de bord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border hover:border-redpen/40 hover:shadow-lg transition-all duration-200 page-fold"
            >
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-redpen-light text-redpen mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="font-display text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-ink-soft leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative bg-ink rounded-2xl shadow-xl p-8 sm:p-14 text-center overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-redpen/20" />
          <h2 className="relative text-2xl sm:text-3xl font-display font-semibold mb-3 text-white">
            Prêt à postuler avec un CV qui tient la route ?
          </h2>
          <p className="relative text-white/70 mb-6 max-w-xl mx-auto">
            Rejoignez les candidats qui ont déjà préparé leur CV avec nous.
          </p>
          {!isAuthenticated ? (
            <Link href="/register" className="relative inline-block">
              <Button size="lg" className="bg-redpen hover:bg-redpen-dark text-white">
                Commencer maintenant
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard" className="relative inline-block">
              <Button size="lg" className="bg-redpen hover:bg-redpen-dark text-white">
                Aller au tableau de bord
              </Button>
            </Link>
          )}
        </div>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 py-8 text-center text-ink-soft border-t border-border">
        <p className="text-sm">&copy; 2026 CV Builder. Tous droits réservés.</p>
        <p className="text-xs mt-1 font-mono">
          Built with J❤️ël for professionals
        </p>
      </footer>
    </div>
  )
}
