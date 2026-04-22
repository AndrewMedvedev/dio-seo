import { useCallback } from "react";
import { PromotionApi } from "../../api/Promotion";

export function usePromotionActions(url, generationId) {
  const handleAnalyze = useCallback(
    async (
      setContent,
      setAiContent,
      setShowAiContent,
      setLoading,
      setGenerationId,
    ) => {
      if (!url?.trim()) return;

      setLoading(true);
      setContent(null);
      setAiContent(null);
      setShowAiContent(false);
      setGenerationId(null);

      try {
        const data = await PromotionApi.seo(url.trim());
        console.log(data);
        setContent(data);

        const newGenerationId =
          data?.generation_id ||
          data?.data?.generation_id ||
          data?.result?.generation_id ||
          data?.seo_result?.generation_id;

        if (newGenerationId) {
          setGenerationId(newGenerationId);
          console.log("✅ Получен generation_id:", newGenerationId);
        } else {
          console.warn("⚠️ generation_id не найден в ответе:", data);
        }
      } catch (error) {
        console.error("Ошибка анализа SEO:", error);
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  const generateAIContent = useCallback(
    async (setAiContent, setShowAiContent, setAiGenerating, generationId) => {
      if (!url?.trim()) {
        return;
      }
      if (!generationId) {
        return;
      }

      setAiGenerating(true);
      try {
        const data = await PromotionApi.aio(url.trim(), generationId);
        setAiContent(data);
        setShowAiContent(true);
      } catch (error) {
        console.error("Ошибка генерации AIO:", error);
      } finally {
        setAiGenerating(false);
      }
    },
    [url],
  );

  return { handleAnalyze, generateAIContent };
}
