import { Logo } from "@/components/brand/logo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-grid opacity-[0.02] pointer-events-none" />
      
      {/* Decorative blurs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-center">
          <Logo size="md" />
        </div>
      </header>
      
      {/* Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}

