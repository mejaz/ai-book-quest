import CustomSelect from "@/components/form/CustomSelect";
import {BOOK_LENGTH, GENRE} from "@/constants";
import InputText from "@/components/form/InputText";
import {getGoogleBooksInfo} from "@/utils";
import toast from "react-hot-toast";

export default function ByFilterForm({loading, setLoading, setSuggestions, url}) {

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent form submission and page reload
		setLoading(true)

		// Retrieve the form field values
		const searchType = event.target.elements["search-type"].value;
		const genre = event.target.elements.genre.value;
		const bookLength = event.target.elements["book-length"].value;
		const author = event.target.elements.author.value;
		const publication = event.target.elements.publication.value;

		// Create an object with the form values
		const data = {
			searchType,
			genre,
			bookLength,
			author,
			publication,
		};

		let response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				"Content-type": "application/json"
			}
		})

		if (response.ok) {
			response = await response.json()
			const details = await getGoogleBooksInfo(response.result)
			setSuggestions(details)
			setLoading(false)
			toast.success("Suggestions generated!")
		} else {
			response = await response.json()
			console.error('error')
			setLoading(false)
			toast.error(response.error.message)
		}
	};
	return (
		<form
			className="w-full mt-1"
			onSubmit={handleSubmit}
			autoComplete={"off"}>
			<div className="flex flex-wrap">
				<div className="w-full mb-6 md:mb-0">
					<div className={"text-xs text-primary-main my-2"}>Make a selection and search your next read</div>
					<div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>
						<input name={"search-type"} type={"text"} hidden={true} value={"filter"} readOnly/>
						<CustomSelect
							id={'genre'}
							label={'Genre'}
							values={GENRE}
						/>
						<CustomSelect
							id={'book-length'}
							label={'Book Length'}
							values={BOOK_LENGTH}
						/>
					</div>
					<InputText label={"Author"} id={"author"}/>
					<InputText label={"Publication"} id={"publication"}/>
				</div>
			</div>

			<div className="mt-6 text-right">
				<button
					type="submit"
					disabled={loading}
					className="rounded-md bg-primary-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
					{loading ? 'Please wait...' :
						<div className={'flex justify-center items-center gap-2'}>Search</div>}
				</button>
			</div>
		</form>
	)
}