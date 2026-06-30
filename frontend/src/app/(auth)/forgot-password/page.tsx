import { Metadata } from 'next'
import { ForgotPasswordForm } from '../../../components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password - CV Builder',
  description: 'Reset your CV Builder password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <ForgotPasswordForm />
    </div>
  )
}