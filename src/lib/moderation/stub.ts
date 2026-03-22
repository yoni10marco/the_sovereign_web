export async function moderateImage(_url: string): Promise<{ safe: boolean; reason?: string }> {
  // TODO: Replace with Google Vision API or OpenAI Moderation
  return { safe: true };
}

export async function moderateText(_text: string): Promise<{ safe: boolean; reason?: string }> {
  // TODO: Replace with LLM-based sentiment check + keyword blacklist
  return { safe: true };
}
