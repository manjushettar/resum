import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

export const getOpenAIEmbeddings = async(content: string): Promise<number[]> =>{
  try{
    const embeddings = await client.embeddings.create(
      {
        model: 'text-embedding-3-small',
        input: content,
        encoding_format: "float"
      });
    return embeddings.data[0].embedding;
  } catch(error){
    console.error('Error fetching OpenAI Embedding response:', error);
    throw new Error('Failed to fetch OpenAI response');
  }
}


export const getOpenAIResponse = async (prompt: string): Promise<string> => {
    try {
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
      };
  
      const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create(params);
      return chatCompletion.choices[0].message.content || 'No response from model';
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      throw new Error('Failed to fetch OpenAI response');
    }
  };