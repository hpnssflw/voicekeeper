export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh bg-aurora pointer-events-none opacity-70" />
      <div className="fixed inset-0 bg-dots pointer-events-none opacity-20" />
      {children}
    </div>
  );
}
