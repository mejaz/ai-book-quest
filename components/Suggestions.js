import {useState} from "react";
import CustomModal from "@/components/CustomModal";

export default function Suggestions({suggestions}) {
	let [isOpen, setIsOpen] = useState(false)
	let [data, setData] = useState({})

	function closeModal() {
		setIsOpen(false)
	}

	function openModal(obj) {
		setIsOpen(true)
		setData(obj)
	}

	return (
		<div className="w-full lg:px-4 pb-40">
			<div className="mx-auto w-full grid grid-cols-2 md:grid-cols-3">
				{/*iterate through each suggestion*/}
				{
					suggestions.map((obj, index) => (
						<div
							key={index}
							className={"col-span-1 lg:mx-2 mb-4 h-fit shadow-md hover:shadow-xl cursor-pointer"}
							onClick={() => openModal(obj)}
						>
							<img src={obj.image} width={"100%"} height={"auto"}/>
						</div>
					))
				}

				{/*custom modal to display the book details*/}
				<CustomModal
					closeModal={closeModal}
					openModal={openModal}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					data={data}
				/>

			</div>
		</div>
	)
}
