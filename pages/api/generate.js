const generatePromptByFilter = (userData) => {
	return `
		Based on the data below, suggest maximum 12 book titles in the below JSON format
		
		data: ${JSON.stringify(userData)}
		sample output JSON:
		[{"title": "The White Tiger"}, {"title": "A House For Mr. Biswas"}]
		
		Answer:
	`
}

const generatePromptByLastReads = (userData) => {
	return `
		Based on these titles ${userData}, which is a users' last read books, suggest maximum 12 book titles 
		that this user may like in the below JSON format. Do not send any of the last read books in the response.
		
		sample output JSON:
		[{"title": "The White Tiger"}, {"title": "A House For Mr. Biswas"}]
		
		Answer:
	`
}

export const getCompletion = async (prompt) => {
	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const content = data.choices[0]?.message?.content;

		if (!content) {
			throw new Error('No content received from OpenAI');
		}

		return JSON.parse(content);
	} catch (error) {
		console.error('OpenAI API Error:', error.message);
		throw new Error(`OpenAI API failed: ${error.message}`);
	}
}


export default async function handler(req, res) {
	try {
		if (req.method === 'POST') {
			const {searchType, ...data} = req.body
			let result;
			let prompt

			if (searchType.toLowerCase() === 'filter') {  // search by filter
				prompt = generatePromptByFilter({...data})
			} else {
				prompt = generatePromptByLastReads(data.titles)
			}

			result = await getCompletion(prompt)
			return res.json({result})
		} else {
			return res.status(400).json({message: 'Method not supported'})
		}
	} catch (e) {
		return res.status(500).json({message: `Error occurred: ${e.message}`})
	}

}
