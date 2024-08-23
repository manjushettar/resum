import { getOpenAIEmbeddings } from './openai';

export async function calculateSimilarityScore(resumeText: string, jobPostingText: string): Promise<number> {
  const resumeEmbedding = await getOpenAIEmbeddings(resumeText);
  const jobPostingEmbedding = await getOpenAIEmbeddings(jobPostingText);

  const similarityScore = cosineSimilarity(resumeEmbedding, jobPostingEmbedding);

  return similarityScore * 100; 
}

function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
