import React, { useState } from "react"

import { axios } from "../../config"
import Loader from "../../components/Loader"
import { useAppContext } from "../../contexts/AppProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
	const { token } = useAppContext()
	const navigate = useNavigate()

	const [previousRequests, setPreviousRequests] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetchPreviousRequests = async () => {
		setIsLoading(true)
		try {
			const { data } = await axios.get("/user/services", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			setPreviousRequests(data)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			console.log(err)
		}
	}

	useEffect(() => {
		fetchPreviousRequests()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="mt-20 px-4">
			{isLoading && <Loader />}

			<main className="w-full max-w-4xl mx-auto">
				<header className="pt-4 pb-6 flex items-center">
					<h2 className="text-lg font-semibold">Previous requests</h2>
					<button
						className="ml-auto px-4 rounded-md py-2 text-sm bg-blue-500 border-none text-white border-2 hover:bg-blue-400"
						onClick={() => navigate("/new-request")}
					>
						<i className="fa-regular fa-plus mr-2"></i>
						New request
					</button>
				</header>
				<table className="border-collapse w-full">
					<thead className="bg-slate-200">
						<tr className="border-b-gray-200 border-b-2 text-left">
							<th className="p-3 pr-2">Request type</th>
							<th className="p-3 pr-2 ">Cleaner</th>
							<th className="p-3 pr-2 ">Date</th>
							<th className="p-3 pr-2 text-center">Status</th>
						</tr>
					</thead>

					<tbody>
						{/* List of all previous requests */}
						{previousRequests?.map((request) => (
							<tr
								key={request._id}
								className="whitespace-nowrap odd:bg-white even:bg-slate-50  text-left md:whitespace-normal"
							>
								<td className="p-3 pr-2">
									{request.type === "windowCleaning"
										? "Window"
										: request.type === "premiumCleaning"
										? "Premium"
										: "Standard"}
								</td>
								<td className="p-3 pr-2">
									<div>
										<p>
											{!request.cleaner
												? "-"
												: request.cleaner.userName}
										</p>
										<p
											style={{ fontSize: "12px" }}
											className="text-sm opacity-50"
										>
											{!request.cleaner
												? "-"
												: request.cleaner.phoneNumber}
										</p>
									</div>
								</td>
								<td className="p-3 pr-2">
									<div>
										<p>
											{!request.serviceTime
												? "-"
												: new Date(
														request.serviceTime
												  ).toLocaleDateString()}
										</p>
										<p
											style={{ fontSize: "12px" }}
											className="text-sm opacity-50"
										>
											{!request.serviceTime
												? "-"
												: new Date(
														request.serviceTime
												  ).toLocaleTimeString()}
										</p>
									</div>
								</td>
								<td className="p-3 pr-2">
									<span
										style={{ fontSize: "12px" }}
										className={`mx-auto border-2 border-gray-200 px-2 py-1 rounded-md w-20 grid place-items-center ${
											request.status === "approved" &&
											"bg-purple-50 border-purple-400 text-purple-500"
										} ${
											request.status === "rejected" &&
											"bg-red-50 border-red-400 text-red-500"
										} ${
											request.status === "completed" &&
											"bg-green-50 border-green-400 text-green-500"
										} ${
											request.status === "pending" &&
											"bg-orange-50 border-orange-400 text-orange-500"
										}
            `}
									>
										{request.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
		</div>
	)
}

export default Home
