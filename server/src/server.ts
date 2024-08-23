import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { getOpenAIResponse, getOpenAIEmbeddings } from './services/openai';
import { calculateSimilarityScore } from './services/similarity';
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON request bodies

const upload = multer({ storage: multer.memoryStorage() });

app.post('/analyze', upload.fields([{ name: 'resumeFile' }]), async (req, res) => {
    let resume: string;
  
    if (req.files && 'resumeFile' in req.files) {
      const resumeFiles = req.files['resumeFile'] as Express.Multer.File[];
      const resumeBuffer = resumeFiles[0].buffer;
      const resumeData = await pdfParse(resumeBuffer);
      resume = resumeData.text;
    } else {
      resume = req.body.resume;
    }
    
    const { jobPosting } = req.body;
  
    if (!resume || !jobPosting) {
      return res.status(400).json({ error: 'Both resume and job posting are required.' });
    }

    const score = await calculateSimilarityScore(resume, jobPosting);
    try{
        let prompt = 
        `Please compare the following resume with the job posting. Be harsh; if you believe the provided information is irrelevant, do not hallucinate an answer and do not try to make connections where there are none. If there is not enough information, please include a tag like:
        [Warning: not enough information provided from] and specify if it's the job posting or resume. 
        Concisely provide the following in a structured list of bullets:
        1. A list of differences or gaps
        - [difference1]...
        2. A list of similarities (skills, experience, qualifications)
        - [similarity1]...
        
	Modify 3 lines in the resume to better match the job posting. Use action words and reasonable, quantifiable metrics and make sure to keep the new lines in context of the original resume and job posting. Only give the new lines.
	- [new line1]...`

	prompt += "Resume: \n" + resume + "\nJob posting: \n "+ jobPosting;
        const analysis = await getOpenAIResponse(prompt);
        res.json({ 
          finalAnalysis: analysis, 
          scoreValue : score
        });
    } catch (error) {
      console.error('Error in /analyze route:', error);
     res.status(500).json({ error: 'Failed to analyze the resume and job posting.' });
    }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Resume Analyzer API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
