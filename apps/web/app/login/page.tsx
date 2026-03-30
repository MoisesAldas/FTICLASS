import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-black min-h-svh flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

