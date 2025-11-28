import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'
import { RegistrationFlow } from '@/components/auth/registration-flow'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthAwareNavigation />

      <div className="container mx-auto px-4 py-12">
        <RegistrationFlow />
      </div>

      <AuthAwareFooter />
    </div>
  )
}
