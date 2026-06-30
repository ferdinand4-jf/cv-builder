import { Metadata } from 'next'
import { LoginForm } from '../../../components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - CV Builder',
  description: 'Login to your CV Builder account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LoginForm />
    </div>
  )
}