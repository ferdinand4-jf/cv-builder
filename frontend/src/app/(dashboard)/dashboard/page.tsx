'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CVList } from '@/components/cv/CVList'
import { Plus, FileText, Layout, LogOut, User, Settings, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { cvs, loading, fetchCVs } = useCVStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCVs()
  }, [isAuthenticated, router, fetchCVs])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Déconnecter l'utilisateur
      logout()
      
      toast.success('Logged out successfully', {
        duration: 3000,
        position: 'top-right',
      })
      
      // ✅ Rediriger vers la page d'accueil (pas vers /login)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total CVs',
      value: cvs.length,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Templates Used',
      value: new Set(cvs.map(cv => cv.templateId)).size,
      icon: <Layout className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec déconnexion */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cvs/create">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create New CV
            </Button>
          </Link>
          
          {/* Menu utilisateur avec déconnexion */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="relative h-10 w-10 rounded-full hover:border-primary/50 transition-colors"
                disabled={isLoggingOut}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
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
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
                      {user?.role || 'User'}
                    </span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste des CVs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your CVs</h2>
          {cvs.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {cvs.length} {cvs.length === 1 ? 'CV' : 'CVs'} total
            </span>
          )}
        </div>
        {cvs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No CVs yet</h3>
                  <p className="text-muted-foreground">
                    Create your first CV and start building your professional profile.
                  </p>
                </div>
                <Link href="/cvs/create">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First CV
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CVList cvs={cvs} />
        )}
      </div>
    </div>
  )
}