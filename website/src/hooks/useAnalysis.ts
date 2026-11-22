import { useState, useCallback } from "react";
import { DetectionResult, AnalysisStatus } from "../types";
import { SYSTEM_PROMPT, USER_PROMPT, RESPONSE_SCHEMA } from "../constants";
import { SamplePart } from "../sampleData";

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  const analyze = useCallback(
    async (
      imageData: string,
      apiUrl: string,
      modelName: string,
      activeSample?: SamplePart | null
    ) => {
      setStatus("analyzing");
      setError("");
      setResult(null);
      setIsDemoFallback(false);

      try {
        const base64Data = imageData.split(",")[1];
        const mimeType = imageData.split(";")[0].split(":")[1] || "image/jpeg";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(`${apiUrl}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: modelName || "default",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: [
                  { type: "text", text: USER_PROMPT },
                  {
                    type: "image_url",
                    image_url: { url: `data:${mimeType};base64,{base64Data}` },
                  },
                ],
              },
            ],
            response_format: RESPONSE_SCHEMA,
            temperature: 0.2,
            max_tokens: 1024,
            stream: false,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No response content received from local model");
        }

        const parsed: DetectionResult = JSON.parse(content);
        setResult(parsed);
        setStatus("done");
      } catch (err) {
        // If local LM Studio isn't reachable and the user is inspecting a sample, graceful demo fallback
        if (activeSample) {
          await new Promise((r) => setTimeout(r, 600));
          setResult(activeSample.mockResult);
          setIsDemoFallback(true);
          setStatus("done");
          return;
        }

        const message =
          err instanceof Error
            ? err.name === "AbortError"
              ? `Connection timed out connecting to ${apiUrl}. Is LM Studio running with 'lms server start --cors'?`
              : err.message
            : "Unknown error occurred";
        setError(message);
        setStatus("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError("");
    setIsDemoFallback(false);
  }, []);

  return { status, result, error, isDemoFallback, analyze, reset };
}
