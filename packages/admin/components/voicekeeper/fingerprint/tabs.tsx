import { Pencil, Sparkles } from "lucide-react";

interface TabsProps {
  activeTab: "text" | "manual";
  onTabChange: (tab: "text" | "manual") => void;
}

export function FingerprintTabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-0.5 bg-[hsl(15,12%,8%)] rounded-lg">
      {[
        { id: "text" as const, label: "AI Анализ", icon: Sparkles },
        { id: "manual" as const, label: "Вручную", icon: Pencil },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[10px] font-medium transition-all ${
            activeTab === tab.id 
              ? "bg-orange-500/20 text-orange-400" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <tab.icon className="h-3 w-3" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

