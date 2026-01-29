import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import type { StyleProfile } from "@/features/voicekeeper/fingerprint";

interface SettingsPreviewProps {
  profile: StyleProfile;
}

export function SettingsPreview({ profile }: SettingsPreviewProps) {
  return (
    <Card>
      <CardHeader className="pb-1 p-1.5">
        <CardTitle className="text-[10px]">Текущие настройки стиля</CardTitle>
        <CardDescription className="text-[8px]">
          Параметры, используемые при генерации постов
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1.5">
        <div className="grid gap-1.5 grid-cols-2 text-[8px]">
          {/* Tone */}
          <div className="space-y-0.5 p-1.5 rounded bg-[hsl(15,12%,8%)]">
            <div className="font-medium text-[9px] mb-1">Тон</div>
            <div>Эмоц: {(profile.tone?.emotionality ?? 0.5).toFixed(1)}</div>
            <div>Увер: {(profile.tone?.assertiveness ?? 0.5).toFixed(1)}</div>
            <div>Ирония: {(profile.tone?.irony ?? 0).toFixed(1)}</div>
          </div>
          
          {/* Language */}
          <div className="space-y-0.5 p-1.5 rounded bg-[hsl(15,12%,8%)]">
            <div className="font-medium text-[9px] mb-1">Язык</div>
            <div>Длина: {profile.language?.sentenceLength === 'short' ? 'Короткие' : profile.language?.sentenceLength === 'long' ? 'Длинные' : 'Средние'}</div>
            <div>Сленг: {(profile.language?.slangLevel ?? 0.3).toFixed(1)}</div>
            <div>Проф: {profile.language?.professionalLexicon ? 'Да' : 'Нет'}</div>
            <div>Эмодзи: {(profile.language?.emojiFrequency ?? 0.2).toFixed(1)}</div>
          </div>
          
          {/* Structure */}
          <div className="space-y-0.5 p-1.5 rounded bg-[hsl(15,12%,8%)]">
            <div className="font-medium text-[9px] mb-1">Структура</div>
            <div>Начало: {profile.structure?.hookType === 'question' ? 'Вопрос' : profile.structure?.hookType === 'provocation' ? 'Провокация' : profile.structure?.hookType === 'statement' ? 'Утверждение' : 'Смешанный'}</div>
            <div>Абзацы: {profile.structure?.paragraphLength ?? '3-4 sentences'}</div>
            <div>Списки: {profile.structure?.useLists ? 'Да' : 'Нет'}</div>
            <div>Ритм: {profile.structure?.rhythm === 'fast' ? 'Быстрый' : profile.structure?.rhythm === 'slow' ? 'Размеренный' : 'Умеренный'}</div>
          </div>
          
          {/* Rhetoric */}
          <div className="space-y-0.5 p-1.5 rounded bg-[hsl(15,12%,8%)]">
            <div className="font-medium text-[9px] mb-1">Риторика</div>
            <div>Вопросов: {profile.rhetoric?.questionsPerPost ?? 1}</div>
            <div>Метафоры: {profile.rhetoric?.metaphors === 'frequent' ? 'Часто' : profile.rhetoric?.metaphors === 'none' ? 'Нет' : 'Редко'}</div>
            <div>Истории: {profile.rhetoric?.storytelling ? 'Да' : 'Нет'}</div>
            <div>CTA: {profile.rhetoric?.ctaStyle === 'direct' ? 'Прямой' : profile.rhetoric?.ctaStyle === 'soft' ? 'Мягкий' : 'Нет'}</div>
          </div>
        </div>
        
        {/* Forbidden & Signature */}
        {((profile.forbidden?.phrases?.length ?? 0) > 0 || (profile.forbidden?.tones?.length ?? 0) > 0 || 
          (profile.signature?.typicalOpenings?.length ?? 0) > 0 || (profile.signature?.typicalClosings?.length ?? 0) > 0) && (
          <div className="grid gap-1.5 sm:grid-cols-2 mt-1.5 pt-1.5 border-t border-white/5">
            {(profile.forbidden?.phrases?.length ?? 0) > 0 && (
              <div className="space-y-0.5">
                <div className="font-medium text-[9px] text-red-400">Запрещённые фразы</div>
                <div className="flex flex-wrap gap-0.5">
                  {(profile.forbidden?.phrases ?? []).map((phrase, idx) => (
                    <Badge key={idx} variant="destructive" className="text-[7px] px-0.5 py-0">{phrase}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(profile.forbidden?.tones?.length ?? 0) > 0 && (
              <div className="space-y-0.5">
                <div className="font-medium text-[9px] text-red-400">Запрещённые тона</div>
                <div className="flex flex-wrap gap-0.5">
                  {(profile.forbidden?.tones ?? []).map((tone, idx) => (
                    <Badge key={idx} variant="destructive" className="text-[7px] px-0.5 py-0">{tone}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(profile.signature?.typicalOpenings?.length ?? 0) > 0 && (
              <div className="space-y-0.5">
                <div className="font-medium text-[9px]">Типичные начала</div>
                <div className="flex flex-wrap gap-0.5">
                  {(profile.signature?.typicalOpenings ?? []).map((opening, idx) => (
                    <Badge key={idx} variant="outline" className="text-[7px] px-0.5 py-0">{opening}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(profile.signature?.typicalClosings?.length ?? 0) > 0 && (
              <div className="space-y-0.5">
                <div className="font-medium text-[9px]">Типичные окончания</div>
                <div className="flex flex-wrap gap-0.5">
                  {(profile.signature?.typicalClosings ?? []).map((closing, idx) => (
                    <Badge key={idx} variant="outline" className="text-[7px] px-0.5 py-0">{closing}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

