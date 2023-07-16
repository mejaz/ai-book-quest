import Head from "next/Head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Query from "@/components/Query";
import Suggestions from "@/components/Suggestions";
import {useState} from "react";
import Intro from "@/components/Intro";


export default function Home() {
	const [suggestions, setSuggestions] = useState([])
	return (
		<main className={"bg-mauve-gradient"}>
			<Head>
				<title>AI Book Quest</title>
			</Head>
			<div className={'flex-grow'}>
				<Header/>
				<div className={'pt-40 h-[calc(100vh-65px)] overflow-auto'}>
					<div className={'max-w-5xl mx-auto'}>
						<div className={'grid grid-cols-1 lg:grid-cols-3 lg:gap-4 px-4 lg:px-0'}>
							<div className={"col-span-1 lg:col-span-1"}>
								{/*query form*/}
								<Query setSuggestions={setSuggestions}/>
							</div>
							<div className={"col-span-1 lg:col-span-2"}>
								{/*suggestions section*/}
								{
									suggestions.length > 0
										? <Suggestions suggestions={suggestions}/>
										: <Intro />
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer/>
		</main>
	);
}
