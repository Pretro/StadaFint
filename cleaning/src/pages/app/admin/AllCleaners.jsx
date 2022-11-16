import React, { useEffect, useState, useRef } from "react"
import { axios } from "../../../config"
import { useAppContext } from "../../../contexts/AppProvider"
import Loader from "../../../components/Loader"
import { ModalBackdrop } from "../../../components"

const AllCleaners = () => {
    const { token } = useAppContext()
	const [cleaners, setCleaners] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const [serviceWindow, setServiceWindow] = useState(false)
	const [serviceStandard, setServiceStandard] = useState(false)
	const [servicePremium, setServicePremium] = useState(false)

	// Referencer till input fields
	const nameRef = useRef()
	const phoneRef = useRef()
	const availabilityRef = useRef()

	// Metod för att hämta alla städare från DB
	async function fetchCleaners() {
		setIsLoading(true)
		try {
			const { data } = await axios.get("/user/cleaners", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			setCleaners(data)
			console.log(data)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			alert("Failed to load orders.")
			console.log(err.response?.data.message || err.message)
		}
	}

	async function handleAddCleaner(e) {
		e.preventDefault()
		setIsLoading(true)

		try {
			await axios.post(
				"/admin/cleaner",
				{
					userName: nameRef.current.value,
					phoneNumber: phoneRef.current.value,
					isAvailable: availabilityRef.current.value,
					services: {
						windowCleaning: serviceWindow,
						premiumCleaning: servicePremium,
						standardCleaning: serviceStandard,
					},
				},
				{
					headers: {
						authorization: "Bearer " + token,
					},
				}
			)
			setIsLoading(false)
			setShowModal(false)
			fetchCleaners()
		} catch (err) {
			setIsLoading(false)
			alert("Kunde inte registrera användare " + err.response?.data.message)
			console.log(err.response?.data.message || err.message)
		}
	}

	// Hämta städarna 
	useEffect(() => {
		fetchCleaners()
	}, [])

	return (
		<>
			<div className="p-8">
				{isLoading && <Loader />}

				<div className="mb-4 ml-auto w-fit">
					<ul style={{ fontSize: "12px" }} className="flex  gap-4">
						<li className="flex items-center gap-1 ">
							<div
								style={{ fontSize: "10px" }}
								className="w-5 h-5 grid place-items-center text-white bg-purple-500 rounded-full"
							>
								F
							</div>
							<p>Fönsterputs</p>
						</li>
						<li className="flex items-center gap-1 ">
							<div
								style={{ fontSize: "10px" }}
								className="w-5 h-5 grid place-items-center text-white bg-red-500 rounded-full"
							>
								P
							</div>
							<p>Premium</p>
						</li>
						<li className="flex items-center gap-1 ">
							<div
								style={{ fontSize: "10px" }}
								className="w-5 h-5 grid place-items-center text-white bg-yellow-500 rounded-full"
							>
								S
							</div>
							<p>Standard</p>
						</li>
					</ul>
				</div>

				<header className="flex items-center mt-6 mb-4">
					<h1 className="text-lg">Alla Städare</h1>
					<button
						onClick={() => setShowModal(true)}
						className="ml-auto px-4 rounded-md py-2 text-sm bg-blue-500 border-none text-white border-2 hover:bg-blue-400"
					>
						<i className="fa-regular fa-plus mr-2"></i>
						Lägg till städare
					</button>
				</header>

				<table className="border-collapse w-full">
					<thead className="bg-slate-200">
						<tr className="border-b-gray-200 border-b-2 text-left">
							<th className="p-3 pr-2">Namn</th>
							<th className="p-3 pr-2">Telefon</th>
							<th className="p-3 pr-2">Tjänster</th>
							<th className="p-3 pr-2">Status</th>
						</tr>
					</thead>

					<tbody>
						{/* Lista av alla städare */}
						{cleaners?.map((cleaner) => (
							<tr
								key={cleaner._id}
								className="whitespace-nowrap odd:bg-white even:bg-slate-50 text-left md:whitespace-normal"
							>
								<td className="p-3 pr-2">{cleaner.userName}</td>
								<td className="p-3 pr-2">
									{cleaner.phoneNumber}
								</td>
								<td className="p-3 pr-2">
									<div className="flex gap-1">
										{cleaner.services.windowCleaning && (
											<div
												style={{ fontSize: "10px" }}
												className="w-5 h-5 grid place-items-center text-white bg-purple-500 rounded-full"
											>
												W
											</div>
										)}
										{cleaner.services.premiumCleaning && (
											<div
												style={{ fontSize: "10px" }}
												className="w-5 h-5 grid place-items-center text-white bg-red-500 rounded-full"
											>
												P
											</div>
										)}
										{cleaner.services.standardCleaning && (
											<div
												style={{ fontSize: "10px" }}
												className="w-5 h-5 grid place-items-center text-white bg-yellow-500 rounded-full"
											>
												S
											</div>
										)}
									</div>
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
											? "available"
											: "unavailable"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{showModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md px-10 pt-14 pb-8 rounded-lg">
							<span
								className="absolute top-3 right-5 text-xl cursor-pointer font-semibold opacity-70"
								onClick={() => setShowModal(false)}
							>
								&#x2715;
							</span>
							<h2 className="text-3xl font-semibold mb-6 text-blue-600">
								Add Cleaner
							</h2>

							<form onSubmit={handleAddCleaner}>
								<label className="block mb-1" htmlFor="name">
									Name
								</label>
								<input
									required
									ref={nameRef}
									className="border-2 px-3 py-2 w-full mb-4 text-sm"
									type="text"
									name="username"
									id="username"
								/>

								<label className="block mb-1" htmlFor="phone">
									Phone number
								</label>
								<input
									required
									ref={phoneRef}
									className="border-2 px-3 py-2 w-full mb-4 text-sm"
									type="tel"
									name="phone"
									id="phone"
								/>

								<label
									className="block mb-1"
									htmlFor="availability"
								>
									Availability
								</label>
								<div className="border-2 w-fit mb-4">
									<select
										ref={availabilityRef}
										name="availability"
										id="availability"
									>
										<option value={true}>True</option>
										<option value={false}>False</option>
									</select>
								</div>

								<label className="block" htmlFor="services">
									Services
								</label>

								<div className="flex gap-4 text-sm mt-2">
									<div className="flex gap-1 items-center">
										<input
											type="checkbox"
											id="window"
											name="window"
											checked={serviceWindow}
											onChange={() =>
												setServiceWindow(
													(prev) => !prev
												)
											}
										/>
										<label htmlFor="window">Window</label>
									</div>

									<div className="flex gap-2 items-center">
										<input
											type="checkbox"
											id="standard"
											name="standard"
											checked={serviceStandard}
											onChange={() =>
												setServiceStandard(
													(prev) => !prev
												)
											}
										/>
										<label htmlFor="standard">
											Standard
										</label>
									</div>

									<div className="flex gap-2 items-center">
										<input
											type="checkbox"
											id="premium"
											name="premium"
											checked={servicePremium}
											onChange={() =>
												setServicePremium(
													(prev) => !prev
												)
											}
										/>
										<label htmlFor="premium">Premium</label>
									</div>
								</div>

								<button
									className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-6 mb-4 mx-auto block rounded-md"
									type="submit"
								>
									Submit
								</button>
							</form>
						</article>
					</div>
				</ModalBackdrop>
			) : null}
		</>
	)
}

export default AllCleaners
