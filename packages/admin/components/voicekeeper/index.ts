// VoiceKeeper UI Components (специфичные для секции)
export { ActionButtons } from "./action-buttons";
export { FeatureSection } from "./feature-section";

// Re-export commonly used widgets (унифицированные компоненты)
export { 
  EmptyState, 
  PageHeader, 
  StatCard, 
  ActionItem,
  StatusBadge,
  WarningBanner,
  SectionCard,
} from "@/ui";

// Deprecated: используйте EmptyState с variant="placeholder"
export { PreviewPlaceholder } from "./preview-placeholder";

// Deprecated: используйте ActionItem с size="sm"
export { ActionCard } from "./action-card";

// Deprecated: используйте StatusBadge из widgets
export { StatusBadge as VoiceKeeperStatusBadge } from "./status-badge";

// Deprecated: используйте WarningBanner из widgets
export { WarningBanner as VoiceKeeperWarningBanner } from "./warning-banner";

