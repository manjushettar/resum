import { getOpenAIEmbeddings } from './openai'; // Assume this service handles embedding retrieval

export async function calculateSimilarityScore(resumeText: string, jobPostingText: string): Promise<number> {
  // Step 1: Get embeddings for both the resume and job posting
  const resumeEmbedding = await getOpenAIEmbeddings(resumeText);
  const jobPostingEmbedding = await getOpenAIEmbeddings(jobPostingText);

  // Step 2: Calculate the cosine similarity between the two embeddings
  const similarityScore = cosineSimilarity(resumeEmbedding, jobPostingEmbedding);

  return similarityScore * 100;  // Scale to a percentage
}

function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}