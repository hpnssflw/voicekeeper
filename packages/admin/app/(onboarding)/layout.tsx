import { Logo } from "@/components/brand/logo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-60" />
      <div className="fixed inset-0 bg-dots pointer-events-none opacity-20" />
      
      {/* Decorative blurs */}
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 bg-card/20 backdrop-blur-2xl shadow-[0_1px_0_0_hsl(var(--primary)/0.05)]">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-center">
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
