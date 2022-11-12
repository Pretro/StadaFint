import React from "react"
import { useState } from "react"
import { Player } from "@lottiefiles/react-lottie-player"
import doneAnimation from "../../assets/animations/done.json"
import { ModalBackdrop } from "../../components"
import { axios } from "../../config"
import { useAppContext } from "../../contexts/AppProvider"
import Loader from "../../components/Loader"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DateTimePicker from "react-datetime-picker"

// Constanter för olika typer av städtjänster
const CLEANING_TYPES = [
	{
		id: "1",
		title: "Window Cleaning",
		state: "windowCleaning",
	},
	{
		id: "2",
		title: "Premium Cleaning",
		state: "premiumCleaning",
	},
	{
		id: "3",
		title: "Standard Cleaning",
		state: "standardCleaning",
	},
]

const CustomerNewRequest = () => {
	const { token } = useAppContext()
	const navigate = useNavigate()

	const [showConfirmationModal, setShowConfirmationModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [showCleanersModal, setShowCleanersModal] = useState(false)
	const [cleaners, setCleaners] = useState(null)
	const [selectedCleaningType, setSelectedCleaningType] = useState(null)
	const [dateTimeValue, setDateTimeValue] = useState()

	// Calendar Status
	const [calendarIsOpen, setCalendarIsOpen] = useState(false)
	const [clockIsOpen, setClockIsOpen] = useState(false)
	const datePickerHeight = calendarIsOpen
		? "320px"
		: clockIsOpen
		? "240px"
		: 0
	//

	// Hämtar alla städare
	const getCleaners = async () => {
		setIsLoading(true)
		try {
			// Hämtar alla städare från servern
			const { data } = await axios.get("/user/cleaners", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			setIsLoading(false)
			setCleaners(data)
		} catch (err) {
			setIsLoading(false)
			if (err.response?.data.message) {
				alert("Kunde inte hämta städarlista. " + err.response.data.message)
			} else {
				alert("Kunde inte hämta städarlista. " + err.message)
			}
			console.log(err.response?.data.message || err.message)
		}
	}

	// Method som väljer typ av tjönst
	const handleSubmit = async (cleanerId) => {
		setIsLoading(true)
		try {
			// Skapar en order för vilken typ av tjänst
			await axios.post(
				"/user/service",
				{
					serviceType: selectedCleaningType,
					cleanerId,
					serviceTime: dateTimeValue.getTime(),
				},
				{
					headers: {
						authorization: "Bearer " + token,
					},
				}
			)
			setIsLoading(false)
			setShowCleanersModal(false)
			setShowConfirmationModal(true)
			navigate("/")
		} catch (err) {
			setIsLoading(false)
			alert("Kunde inte skapa ordern.")
			console.log(err.response?.data.message || err.message)
		}
	}

	// Method som hanterar vilken typ av tjänst som har valts
	const selectCleaner = async (cleanerId) => {
		
		if (!selectedCleaningType)
			return alert(" Se till att rengöringstypen är giltig.")
		if (!dateTimeValue)
			return alert("Se till att du har valt datum och tid")

		setShowCleanersModal(true)
	}

	useEffect(() => {
		getCleaners()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		//  ${selectedCleaningType === 'type.state' ? 'bg-blue-900' : 'bg-blue-500'}
		<div className="bg-gray-100 min-h-screen grid place-items-center">
			{isLoading && <Loader />}

			<main className=" bg-white mx-4 p-10 shadow-xl shadow-gray-100 rounded-xl">
				<h1 className="text-xl font-semibold">
					Please select the type of cleaning you want
				</h1>
				<div className="flex flex-col md:flex-row gap-4 mt-4 ">
					{/* List of available cleaning types */}
					{CLEANING_TYPES.map((type) => (
						<article
							key={type.id}
							// handleSubmit(type.title)
							onClick={() => {
								setSelectedCleaningType(type.state)
							}}
							className={`relative p-8 rounded-lg bg-blue-500 cursor-pointer text-white hover:scale-105 transition-transform ${
								selectedCleaningType === type.state
									? "bg-blue-700"
									: "bg-blue-300"
							}`}
						>
							<p className="font-semibold">{type.title}</p>
						</article>
					))}
				</div>

				<div className="mb-12 mt-12">
					<h1 className="text-xl font-semibold mb-2">
						Please select date and time
					</h1>
					<div style={{ height: datePickerHeight }}>
						<DateTimePicker
							onChange={setDateTimeValue}
							value={dateTimeValue}
							// autoFocus
							// State Tracking
							onCalendarOpen={() => setCalendarIsOpen(true)}
							onCalendarClose={() => setCalendarIsOpen(false)}
							onClockOpen={() => setClockIsOpen(true)}
							onClockClose={() => setClockIsOpen(false)}
							// State Tracking
							dayPlaceholder="DD"
							monthPlaceholder="MM"
							yearPlaceholder="YYYY"
							minutePlaceholder="mm"
							hourPlaceholder="hh"
							minDate={new Date()}
						/>
					</div>
				</div>
				<button
					className="mr-auto px-4 rounded-md py-2 text-sm bg-blue-500 border-none text-white border-2 hover:bg-blue-400"
					onClick={selectCleaner}
				>
					Select Cleaner
				</button>
			</main>

			{showConfirmationModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md p-8 rounded-lg text-center ">
							<span
								className="absolute top-2 right-4 text-2xl cursor-pointer font-semibold"
								onClick={() => setShowConfirmationModal(false)}
							>
								&#x2715;
							</span>

							<Player
								src={doneAnimation}
								className="player"
								autoplay
								loop
								speed={1}
								style={{ height: "100px", width: "100px" }}
							/>

							<h2 className="text-2xl font-semibold">
                            Beställningen har tagits emots
							</h2>
							<p className="my-2 opacity-70">
                            En bekräftelse har skickats till din e-post
							</p>
						</article>
					</div>
				</ModalBackdrop>
			) : null}

			{showCleanersModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-2xl p-8 pt-12 rounded-lg">
							<span
								className="absolute top-2 right-4 text-2xl cursor-pointer font-semibold"
								onClick={() => setShowCleanersModal(false)}
							>
								&#x2715;
							</span>

							<h2 className="mb-4 text-xl font-medium">
                            Välj en städare
							</h2>

							<table className="border-collapse w-full">
								<thead className="bg-slate-200">
									<tr className="border-b-gray-200 border-b-2 text-left">
										<th className="p-3 pr-2 font-medium">
											Namn
										</th>
										<th className="p-3 pr-2 font-medium">
											Telefon
										</th>
										<th className="p-3 pr-2 font-medium">
											Status
										</th>
									</tr>
								</thead>

								<tbody>
									{/* Lista av alla städare */}

									{cleaners?.map((cleaner) => (
										<tr
											onClick={() => {
												handleSubmit(cleaner._id)
											}}
											key={cleaner._id}
											className="cursor-pointer whitespace-nowrap odd:bg-white even:bg-slate-50 hover:bg-slate-100 text-left md:whitespace-normal"
										>
											<td className="p-3 pr-2">
												{cleaner.userName}
											</td>
											<td className="p-3 pr-2">
												{cleaner.phoneNumber}
											</td>
											<td className="p-3 pr-2">
												<span
													style={{ fontSize: "12px" }}
													className={`border-2 border-gray-200 px-2 py-1 rounded-md cursor-pointer hover:opacity-70 w-20 grid place-items-center ${
														!cleaner.isAvailable
															? "bg-red-50 border-red-400 text-red-500"
															: "bg-green-50 border-green-400 text-green-500"
													}`}
												>
													{cleaner.isAvailable
														? "tillgängligt"
														: "inte tillgänglig"}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</article>
					</div>
				</ModalBackdrop>
			) : null}
		</div>
	)
}

export default CustomerNewRequest
