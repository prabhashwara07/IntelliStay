import { OpenAI } from "openai";

export const generateEmbedding = async (text: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to your backend .env file.");
  }
  const openai = new OpenAI({ apiKey });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 1536,
    input: text,
  });
  return response.data[0].embedding;
};
