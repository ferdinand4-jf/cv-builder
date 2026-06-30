'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Statistics } from '@/components/admin/Statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Layout, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import { Statistics as StatisticsType } from '@/types'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<StatisticsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/statistics')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, router, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      color: 'text-blue-500',
    },
    {
      title: 'Total CVs',
      value: stats?.totalCVs || 0,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      color: 'text-green-500',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      color: 'text-purple-500',
    },
    {
      title: 'Templates',
      value: stats?.totalTemplates || 0,
      icon: <Layout className="h-4 w-4 text-muted-foreground" />,
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats && <Statistics stats={stats} />}
    </div>
  )
}