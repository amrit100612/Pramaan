import { generateText } from "ai";

// Load .env.local via Node standard library
try {
  process.loadEnvFile?.(".env.local");
} catch {
  // Ignore if file doesn't exist
}

async function main() {
  const { text } = await generateText({
    model: "openai/gpt-5.5",
    prompt: "Invent a new holiday and describe its traditions.",
  });

  console.log(text);
}

main().catch(console.error);
