import { useState } from 'react';
import axios from 'axios';
import './App.css';

type userLog = {
	score: number, 
	timestamp: number,
	description: string
};



function App() {
  const [resume, setResume] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [scoreHistory, setScoreHistory] = useState<userLog[]>([]);  
	const [resumeName, setResumeName] = useState<string | null>('');
	const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (resumeFile){
        formData.append('resumeFile',resumeFile)
      } else{
        formData.append('resume', resume);
      }
      formData.append('jobPosting', jobPosting);
      const response = await axios.post('http://localhost:3000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
			const analysisData = response.data;
      setAnalysis(analysisData);
			
			const newLog: userLog = {
					score: parseFloat(analysisData.scoreValue.toFixed(3)), 
					timestamp:  Date.now(), 
					description: resumeName || 'Text Input'
			};

			setScoreHistory(scoreHistory => [...scoreHistory,newLog]); 
					  
	  } catch (error) {
      console.error('Could not connect to backend', error);
    } finally {
      setLoading(false);
    }
  };

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setResumeFile(file);
		setResumeName(file?.name || null);	
	};

  return (
    <div className="App">
      <h1>R-Analyzer</h1>
      <div className="input-container">
        <div className="input-group">
            <textarea
              placeholder="Paste your resume here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              disabled={resumeFile !== null}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-input"
            />
        </div>

        <textarea
          placeholder="Paste the job posting here..."
          value={jobPosting}
          onChange={(e) => setJobPosting(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {analysis && (
      <div className="results">
        <h2>Analysis Results:</h2>
        <pre>{analysis.finalAnalysis}</pre> {}
      </div> )} 

			{scoreHistory.length > 0 && (
			<div className = "scoreHist">
				{scoreHistory.map((scoreItem, index) => (
					<div key = {index}>
						<p>{scoreItem.description.slice(0, 5)}:  {scoreItem.score}</p>
						<p>{new Date(scoreItem.timestamp).toLocaleString()}</p>
					</div>
			))}
			</div>)}
		</div>
  );
}

export default App;
