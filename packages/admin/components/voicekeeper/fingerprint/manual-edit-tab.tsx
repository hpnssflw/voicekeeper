import { ToneSection } from "./manual-edit/tone-section";
import { LanguageSection } from "./manual-edit/language-section";
import { StructureSection } from "./manual-edit/structure-section";
import { RhetoricSection } from "./manual-edit/rhetoric-section";
import { ForbiddenSection } from "./manual-edit/forbidden-section";
import { SignatureSection } from "./manual-edit/signature-section";
import type { StyleProfile } from "@/lib/ai";

interface ManualEditTabProps {
  profile: StyleProfile;
  onProfileChange: (profile: StyleProfile) => void;
}

export function ManualEditTab({ profile, onProfileChange }: ManualEditTabProps) {
  const handleToneChange = (tone: StyleProfile["tone"]) => {
    onProfileChange({ ...profile, tone });
  };

  const handleLanguageChange = (language: StyleProfile["language"]) => {
    onProfileChange({ ...profile, language });
  };

  const handleStructureChange = (structure: StyleProfile["structure"]) => {
    onProfileChange({ ...profile, structure });
  };

  const handleRhetoricChange = (rhetoric: StyleProfile["rhetoric"]) => {
    onProfileChange({ ...profile, rhetoric });
  };

  const handleAddPhrase = (phrase: string) => {
    onProfileChange({
      ...profile,
      forbidden: {
        ...profile.forbidden,
        phrases: [...(profile.forbidden?.phrases ?? []), phrase],
      },
    });
  };

  const handleRemovePhrase = (index: number) => {
    onProfileChange({
      ...profile,
      forbidden: {
        ...profile.forbidden,
        phrases: (profile.forbidden?.phrases ?? []).filter((_, i) => i !== index),
      },
    });
  };

  const handleAddTone = (tone: string) => {
    onProfileChange({
      ...profile,
      forbidden: {
        ...profile.forbidden,
        tones: [...(profile.forbidden?.tones ?? []), tone],
      },
    });
  };

  const handleRemoveTone = (index: number) => {
    onProfileChange({
      ...profile,
      forbidden: {
        ...profile.forbidden,
        tones: (profile.forbidden?.tones ?? []).filter((_, i) => i !== index),
      },
    });
  };

  const handleAddOpening = (opening: string) => {
    onProfileChange({
      ...profile,
      signature: {
        ...profile.signature,
        typicalOpenings: [...(profile.signature?.typicalOpenings ?? []), opening],
      },
    });
  };

  const handleRemoveOpening = (index: number) => {
    onProfileChange({
      ...profile,
      signature: {
        ...profile.signature,
        typicalOpenings: (profile.signature?.typicalOpenings ?? []).filter((_, i) => i !== index),
      },
    });
  };

  const handleAddClosing = (closing: string) => {
    onProfileChange({
      ...profile,
      signature: {
        ...profile.signature,
        typicalClosings: [...(profile.signature?.typicalClosings ?? []), closing],
      },
    });
  };

  const handleRemoveClosing = (index: number) => {
    onProfileChange({
      ...profile,
      signature: {
        ...profile.signature,
        typicalClosings: (profile.signature?.typicalClosings ?? []).filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="grid gap-1.5 lg:grid-cols-2">
      <ToneSection profile={profile} onChange={handleToneChange} />
      <LanguageSection profile={profile} onChange={handleLanguageChange} />
      <StructureSection profile={profile} onChange={handleStructureChange} />
      <RhetoricSection profile={profile} onChange={handleRhetoricChange} />
      <ForbiddenSection
        profile={profile}
        onAddPhrase={handleAddPhrase}
        onRemovePhrase={handleRemovePhrase}
        onAddTone={handleAddTone}
        onRemoveTone={handleRemoveTone}
      />
      <SignatureSection
        profile={profile}
        onAddOpening={handleAddOpening}
        onRemoveOpening={handleRemoveOpening}
        onAddClosing={handleAddClosing}
        onRemoveClosing={handleRemoveClosing}
      />
    </div>
  );
}

