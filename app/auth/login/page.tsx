import { LoginForm } from '@/components/auth/login-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
