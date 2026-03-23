import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";

export default function DemoOne({ onLogin }: { onLogin?: () => void }) {
  return (
    <main className="relative w-screen h-screen bg-background">
      <SmokeyBackground color="#ffffff" className="absolute inset-0 opacity-15" />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}
