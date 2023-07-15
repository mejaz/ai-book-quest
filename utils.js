export const getGoogleBooksInfo = async (titlesArr) => {
	const details = await Promise.all(titlesArr.map(async({title}) => {
		let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&langRestrict=en&maxResults=1`)
		if(response.ok) {
			response = await response.json()
			const bookObj = response.items[0]
			console.log('-->obj--', bookObj)
			const data = {
				title,
				subtitle: bookObj.volumeInfo.subtitle,
				crux: ["test"],
				genre: bookObj.volumeInfo.categories ? bookObj.volumeInfo.categories[0] : "NA",
				authors: bookObj.volumeInfo.authors,
				summary: bookObj.volumeInfo.description,
				publisher: bookObj.volumeInfo.publisher,
				image: bookObj.volumeInfo.imageLinks.thumbnail
			}

			console.log('--final--', data)
			return data
		}
	}))
	return details
}