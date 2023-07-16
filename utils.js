export const getGoogleBooksInfo = async (titlesArr) => {
	return await Promise.all(titlesArr.map(async ({title}) => {
		let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&langRestrict=en&maxResults=1`)
		if (response.ok) {
			response = await response.json()
			const bookObj = response.items[0]
			return {
				title,
				subtitle: bookObj.volumeInfo.subtitle,
				genre: bookObj.volumeInfo.categories ? bookObj.volumeInfo.categories[0] : "NA",
				authors: bookObj.volumeInfo.authors,
				summary: bookObj.volumeInfo.description,
				publisher: bookObj.volumeInfo.publisher,
				image: bookObj.volumeInfo.imageLinks ? bookObj.volumeInfo.imageLinks.thumbnail : "",
				isbn10: bookObj.volumeInfo.industryIdentifiers
					? getIsbn10(bookObj.volumeInfo.industryIdentifiers)
					: undefined,
			}
		}
	}))
}

const getIsbn10 = (industryIdentifiers) => {
	console.log(industryIdentifiers)
	for (const identifier of industryIdentifiers) {
		if (identifier.type === "ISBN_10") {
			return identifier.identifier;
		}
	}
}