import { SignUp } from "@clerk/nextjs"
import { Dumbbell } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="bg-[#0a0a0c] min-h-svh flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="size-12 rounded-2xl bg-[#5e5ce6] flex items-center justify-center shadow-lg shadow-[#5e5ce6]/20">
          <Dumbbell className="size-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">FITCLASS</h1>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-zinc-950 border border-white/5 shadow-2xl rounded-3xl",
            headerTitle: "text-white font-black text-2xl tracking-tight",
            headerSubtitle: "text-zinc-500",
            socialButtonsBlockButton: "bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white rounded-2xl transition-all",
            socialButtonsBlockButtonText: "font-bold",
            dividerLine: "bg-white/5",
            dividerText: "text-zinc-600 font-bold text-[10px] uppercase tracking-widest",
            formFieldLabel: "text-zinc-400 font-black text-[10px] uppercase tracking-widest mb-1.5",
            formFieldInput: "bg-zinc-900/50 border-white/5 text-white rounded-xl focus:ring-[#5e5ce6]/30",
            formButtonPrimary: "bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white font-black rounded-xl h-11 transition-all shadow-lg shadow-[#5e5ce6]/20",
            footerActionText: "text-zinc-500 font-medium",
            footerActionLink: "text-[#5e5ce6] hover:text-white font-bold transition-colors",
            identityPreviewText: "text-white font-bold",
            identityPreviewEditButtonIcon: "text-[#5e5ce6]",
          },
        }}
        signInUrl="/login"
        forceRedirectUrl="/onboarding"
      />
    </div>
  )
}
