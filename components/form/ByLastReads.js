import InputText from "@/components/form/InputText";
import {getGoogleBooksInfo} from "@/utils";
import toast from "react-hot-toast";
import {useState} from "react";

export default function ByLastReads({loading, setLoading, setSuggestions, url}) {
	const [titlesCount, setTitlesCount] = useState(3)

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent form submission and page reload
		setLoading(true)

		// get each title in an array
		let titles = [...Array(titlesCount).keys()].map(i => (
			event.target.elements[`title${i + 1}`].value
		))

		// remove empty items
		titles = titles.filter(Boolean)

		if (titles.length === 0) {
			toast.error('At least one title is required')
			setLoading(false)
			return
		}

		const data = {
			searchType: event.target.elements["search-type"].value,
			titles: titles.join(", ")
		}

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
					<div className={' grid grid-cols-1 md:grid-cols-2 gap-2'}>
						<input name={"search-type"} type={"text"} hidden={true} value={"last-reads"} readOnly/>
					</div>
					<div className={"text-xs text-primary-main my-2"}>Enter below at least one last read book title</div>
					{
						[...Array(titlesCount).keys()].map((index) => (
							<InputText key={index} label={`Title ${index + 1}`} id={`title${index + 1}`}/>
						))
					}
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