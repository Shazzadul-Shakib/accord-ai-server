export function extractJsonFromMarkdown(text: string): string {
  // Remove markdown code block syntax
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1]?.trim() ?? '';
  }

  // If no code block, try to find JSON-like content
  const startIndex = text.indexOf('{');
  const lastIndex = text.lastIndexOf('}');

  if (startIndex !== -1 && lastIndex !== -1 && startIndex < lastIndex) {
    return text.substring(startIndex, lastIndex + 1);
  }

  throw new Error('No valid JSON found in response');
}
