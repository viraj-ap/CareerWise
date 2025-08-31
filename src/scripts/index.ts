import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY!,
});

const model = "gemini-2.5-flash";

export async function sendMessage(prompt: string): Promise<string> {
  const config = {
    responseModalities: ["TEXT"],
  };

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return text;
}
