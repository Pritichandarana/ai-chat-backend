export function chunkText(text, size = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export function findRelevantChunks(chunks, query) {
  return chunks
    .map((chunk) => ({
      text: chunk,
      score: chunk.toLowerCase().includes(query.toLowerCase()) ? 1 : 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((c) => c.text);
}
