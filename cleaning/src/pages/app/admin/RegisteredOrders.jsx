import React, { useEffect, useState } from "react"
import Loader from "../../../components/Loader"
import editIcon from "../../../assets/icons/edit.png"
import { axios } from "../../../config"
import { useAppContext } from "../../../contexts/AppProvider"
import { ModalBackdrop } from "../../../components"

function RegisteredOrders() {
	const { token } = useAppContext()

	const [orders, setOrders] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	// Method to fetch all orders made and their status
	async function fetchOrders() {
		setIsLoading(true)
		try {
			const { data } = await axios.get("/admin/services", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			setOrders(data)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			alert("Failed to load orders.")
			console.log(err.response?.data.message || err.message)
		}
	}

	// Run the fetchOrders method when the component mounts
	useEffect(() => {
		fetchOrders()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="p-8 w-full ">
			{isLoading && <Loader />}

			<h1 className="text-lg mb-4">Registered orders</h1>

			<table className="border-collapse w-full overflow-x-auto bg-blue-400">
				<thead className="bg-slate-200">
					<tr className="border-b-gray-200 border-b-2 text-left">
						<th className="p-3 pr-2">Name</th>
						<th className="p-3 pr-2">Email</th>
						<th className="p-3 pr-2">Phone no.</th>
						<th className="p-3 pr-2">Cleaning type</th>
						<th className="p-3 pr-2">Order status</th>
					</tr>
				</thead>

				<tbody>
					{orders?.map((order, i) =>
						!order.customer ? null : (
							<OrderRow
								key={order._id + i}
								order={order}
								setIsLoading={setIsLoading}
								fetchOrders={fetchOrders}
							/>
						)
					)}
				</tbody>
			</table>
		</div>
	)
}

export default RegisteredOrders

const OrderRow = ({ order, setIsLoading, fetchOrders }) => {
	const { token } = useAppContext()
	const selectedStatus = order.status
	const [statusOptions, setStatusOptions] = useState(null)
	const [showEditModal, setShowEditModal] = useState(false)

	useEffect(() => {
		// Logic to know the options to render depending on the current status of an order
		if (selectedStatus === "pending") {
			setStatusOptions(["approved", "rejected", "completed"])
		} else if (selectedStatus === "approved") {
			setStatusOptions(["completed"])
		} else if (
			selectedStatus === "completed" ||
			selectedStatus === "rejected"
		) {
			setStatusOptions([])
		}
	}, [selectedStatus])

	// Request to server to update the status of an order
	const handleUpdateOrderStatus = async (status) => {
		setIsLoading(true)
		try {
			await axios.put(
				`/admin/service/${order._id}`,
				{ status },
				{
					headers: {
						authorization: "Bearer " + token,
					},
				}
			)
			setShowEditModal(false)
			setIsLoading(false)
			fetchOrders()
		} catch (err) {
			setIsLoading(false)
			alert("Failed update order's status.")
			console.log(err.response?.data.message || err.message)
		}
	}

	return (
		<>
			<tr className="cursor-pointer whitespace-nowrap odd:bg-white even:bg-slate-50 hover:bg-slate-100 text-left md:whitespace-normal">
				<td className="p-3 pr-2">{order.customer.fullName}</td>
				<td className="p-3 pr-2">{order.customer.email}</td>
				<td className="p-3 pr-2">{order.customer.phoneNumber}</td>
				<td className="p-3 pr-2">
					{/* Rendering the order type in a more user friendly way than it was sent from the server */}
					{order.type === "windowCleaning"
						? "Window"
						: order.type === "premiumCleaning"
						? "Premium"
						: "Standard"}
				</td>
				<td className="p-3 pr-2">
					<div
						className="flex items-center gap-4"
						style={{ fontSize: "12px" }}
					>
						{/* Some styles are dynamically rendered depending on the status */}
						<span
							className={`border-2 border-gray-200 px-2 py-1 rounded-md cursor-pointer hover:opacity-70 w-20 grid place-items-center ${
								selectedStatus === "approved" &&
								"bg-purple-50 border-purple-400 text-purple-500"
							} ${
								selectedStatus === "rejected" &&
								"bg-red-50 border-red-400 text-red-500"
							} ${
								selectedStatus === "completed" &&
								"bg-green-50 border-green-400 text-green-500"
							} ${
								selectedStatus === "pending" &&
								"bg-orange-50 border-orange-400 text-orange-500"
							}
            `}
						>
							{selectedStatus}
						</span>
						<img
							onClick={() => {
								setShowEditModal(true)
							}}
							className="w-5 cursor-pointer"
							src={editIcon}
							alt="edit"
						/>
					</div>
				</td>
			</tr>

			{/* Modal for editing an order status */}
			{showEditModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md px-10 py-8 rounded-lg">
							<span
								className="absolute top-3 right-5 text-xl cursor-pointer font-semibold opacity-70"
								onClick={() => setShowEditModal(false)}
							>
								&#x2715;
							</span>

							{selectedStatus === "rejected" ||
							selectedStatus === "completed" ? (
								<h2 className="text-center text-xl text-blue-600 font-semibold">
									Order has been{" "}
									{selectedStatus === "rejected"
										? "rejected"
										: "completed"}
								</h2>
							) : (
								<h2 className="text-center text-xl font-semibold">
									Update order status
								</h2>
							)}

							<div
								className="mt-6 flex justify-center gap-4"
								style={{ fontSize: "12px" }}
							>
								{statusOptions?.map((option) => (
									<span
										key={option}
										onClick={() =>
											handleUpdateOrderStatus(option)
										}
										className={`border-2 border-gray-200 px-2 py-1 rounded-md cursor-pointer hover:opacity-70 ${
											option === "approved" &&
											"bg-purple-50 border-purple-400 text-purple-500"
										} ${
											option === "rejected" &&
											"bg-red-50 border-red-400 text-red-500"
										} ${
											option === "completed" &&
											"bg-green-50 border-green-400 text-green-500"
										} ${
											option === "pending" &&
											"bg-orange-50 border-orange-400 text-orange-500"
										}
                    `}
									>
										{option}
									</span>
								))}
							</div>
						</article>
					</div>
				</ModalBackdrop>
			) : null}
		</>
	)
}
