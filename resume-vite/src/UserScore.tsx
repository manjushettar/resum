import { useState } from 'react;
function UserScore(){
	const [score, setScore] = useState('');
	const [timestamp, setTimestamp] = useState(0);
	const [briefDescription, setDescription] = useState('');
	
	const logScore = async () => {
		try{


		}catch(error){
			console.log("Could not upload score", error);
		}


	}

}
