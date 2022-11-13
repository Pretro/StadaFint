import React, { useEffect, useState } from "react"
import deleteIcon from "../../../assets/icons/trash.svg"
import editIcon from "../../../assets/icons/edit.png"
import { axios } from "../../../config"
import { useAppContext } from "../../../contexts/AppProvider"
import Loader from "../../../components/Loader"
import { ModalBackdrop } from "../../../components"

function AllCustomers() {
	const { token } = useAppContext()
	const [customers, setCustomers] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [userIdToDelete, setUserIdToDelete] = useState(null)

	const [updateUserForm, setUpdateUserForm] = useState({
		id: "",
		fullName: "",
		phoneNumber: "",
		address: "",
		email: "",
	})

	// Method to get all customers from DB
	async function fetchCustomers() {
		setIsLoading(true)
		try {
			const { data } = await axios.get("/admin/users", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			setCustomers(data)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			alert("Failed to load orders.")
			console.log(err.response?.data.message || err.message)
		}
	}

	// Fetch the customers when the component is mounted
	useEffect(() => {
		fetchCustomers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Method to send request to server to delete user
	const handleDeleteUser = async () => {
		// Validation check to ensure a user to be deleted has been selected
		if (!userIdToDelete) return
		setIsLoading(true)

		// Request to delete user
		try {
			await axios.delete(`/admin/user/${userIdToDelete}`, {
				headers: {
					authorization: "Bearer " + token,
				},
			})

			setShowDeleteModal(false)
			setIsLoading(false)
			fetchCustomers()
		} catch (err) {
			setIsLoading(false)
			alert("Failed to delete user.")
			console.log(err.response?.data.message || err.message)
		}
	}

	// Method to send request to server to update user info
	const handleSubmitUserEditInfo = async (e) => {
		e.preventDefault()

		// Validate fields to ensure data is passed correctly
		if (
			!updateUserForm.address ||
			!updateUserForm.email ||
			!updateUserForm.fullName ||
			!updateUserForm.phoneNumber
		)
			return alert("Please ensure all fields are filled")
		setIsLoading(true)

		// Send request to server
		try {
			const { data } = await axios.put(
				`/admin/user/${updateUserForm.id}`,
				updateUserForm,
				{
					headers: {
						authorization: "Bearer " + token,
					},
				}
			)
			setCustomers(data)
			setShowEditModal(false)
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			alert(
				"Failed to update user information. " +
					err.response?.data.message
			)
			console.log(err.response?.data.message || err.message)
		}
	}

	return (
		<div className="p-8">
			{isLoading && <Loader />}

			<h1 className="text-lg mb-4">All Customers</h1>

			<table className="border-collapse w-full">
				<thead className="bg-slate-200">
					<tr className="border-b-gray-200 border-b-2 text-left">
						<th className="p-3 pr-2">Name</th>
						<th className="p-3 pr-2">Email</th>
						<th className="p-3 pr-2">Phone no.</th>
						<th className="p-3 pr-2">Actions</th>
					</tr>
				</thead>

				<tbody>
					{/* List of all customers */}
					{customers?.map((customer) => (
						<tr
							key={customer._id}
							className="cursor-pointer whitespace-nowrap odd:bg-white even:bg-slate-50 hover:bg-slate-100 text-left md:whitespace-normal"
						>
							<td className="p-3 pr-2">{customer.fullName}</td>
							<td className="p-3 pr-2">{customer.email}</td>
							<td className="p-3 pr-2">{customer.phoneNumber}</td>
							<td
								className="p-3"
								onClick={() => handleDeleteUser(customer._id)}
							>
								<div className="flex gap-3 items-center">
									<img
										onClick={() => {
											// Pass current data of customer to be updated so the update form knows the current user's data
											setUpdateUserForm({
												id: customer._id,
												fullName: customer.fullName,
												address: customer.address,
												email: customer.email,
												phoneNumber:
													customer.phoneNumber,
											})
											setShowEditModal(true)
										}}
										className="w-5 cursor-pointer"
										src={editIcon}
										alt="edit"
									/>
									<img
										onClick={() => {
											// Open modal to confirm if customer should be deleteds
											setShowDeleteModal(true)
											// Set user ID so the component knows what user to delete
											setUserIdToDelete(customer._id)
										}}
										className="w-5 cursor-pointer "
										src={deleteIcon}
										alt="delete"
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Modal to confirm is user should be deleted */}
			{showDeleteModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md px-10 py-14 rounded-lg text-center">
							<span
								className="absolute top-3 right-5 text-xl cursor-pointer font-semibold opacity-70"
								onClick={() => setShowDeleteModal(false)}
							>
								&#x2715;
							</span>

							<h2 className="text-xl font-semibold">
								Are you sure you want to delete this user?
							</h2>

							<div className="flex gap-4 justify-center mt-8">
								<button
									onClick={handleDeleteUser}
									className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-400"
								>
									Confirm
								</button>
							</div>
						</article>
					</div>
				</ModalBackdrop>
			) : null}

			{/* Modal to show edit form for editing customer info */}
			{showEditModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md px-10 pt-14 pb-8 rounded-lg">
							<span
								className="absolute top-3 right-5 text-xl cursor-pointer font-semibold opacity-70"
								onClick={() => setShowEditModal(false)}
							>
								&#x2715;
							</span>

							<form
								onSubmit={handleSubmitUserEditInfo}
								className="w-full max-w-md py-8rounded-lg"
							>
								<h2 className="text-2xl font-semibold mb-6 text-blue-600 text-center">
									Edit user info
								</h2>

								<label className="block mb-1" htmlFor="name">
									Full Name
								</label>
								<input
									required
									value={updateUserForm.fullName}
									onChange={(e) =>
										setUpdateUserForm((prev) => ({
											...prev,
											fullName: e.target.value,
										}))
									}
									className="border-2 px-3 py-2 w-full mb-4 text-sm"
									type="text"
									name="name"
									id="name"
								/>

								<label className="block mb-1" htmlFor="phone">
									Phone number
								</label>
								<input
									required
									value={updateUserForm.phoneNumber}
									onChange={(e) =>
										setUpdateUserForm((prev) => ({
											...prev,
											phoneNumber: e.target.value,
										}))
									}
									className="border-2 px-3 py-2 w-full mb-4 text-sm"
									type="tel"
									name="phone"
									id="phone"
								/>

								<label className="block mb-1" htmlFor="phone">
									Address
								</label>
								<input
									required
									value={updateUserForm.address}
									onChange={(e) =>
										setUpdateUserForm((prev) => ({
											...prev,
											address: e.target.value,
										}))
									}
									className="border-2 px-3 py-2 w-full mb-4 text-sm"
									type="text"
									name="address"
									id="address"
								/>

								<button
									className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-2 mb-4 mx-auto block rounded-md"
									type="submit"
								>
									Save
								</button>
							</form>
						</article>
					</div>
				</ModalBackdrop>
			) : null}
		</div>
	)
}

export default AllCustomers
