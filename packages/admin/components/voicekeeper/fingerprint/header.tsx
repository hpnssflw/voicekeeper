import { PageHeader, StatusBadge, WarningBanner } from "@/ui";
import { Fingerprint, Key } from "lucide-react";

interface FingerprintHeaderProps {
  hasFingerprint?: boolean;
  hasApiKey?: boolean;
}

export function FingerprintHeader({ hasFingerprint, hasApiKey }: FingerprintHeaderProps) {
  return (
    <PageHeader
      title="Voice Fingerprint"
      description="Структурированный профиль стиля"
      backHref="/dashboard/voicekeeper"
      rightContent={
        <>
          {!hasApiKey && (
            <WarningBanner
              icon={Key}
              message="Настройте API ключ"
              actionLabel="Настроить"
              actionHref="/dashboard/settings/api-keys"
              variant="warning"
            />
          )}
          {hasFingerprint && (
            <StatusBadge
              icon={Fingerprint}
              label="Fingerprint активен"
              variant="success"
            />
          )}
        </>
      }
    />
  );
}

