// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {getCompletion} from "@/openAiServices";

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
