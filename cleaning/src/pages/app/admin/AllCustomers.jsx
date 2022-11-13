import React, { useEffect, useState } from "react"
import deleteIcon from "../../../assets/icons/trash.svg"
import editIcon from "../../../assets/icons/edit.png"
import { axios } from "../../../config"
import { useAppContext } from "../../../contexts/AppProvider"
import Loader from "../../../components/Loader"
import { ModalBackdrop } from "../../../components"

const AllCustomers = () => {
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

	// Metod för att hämta alla kunder från DB
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

	// Hämta kunderna när komponenten är monterad
	useEffect(() => {
		fetchCustomers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Method som skcikar en request till servern för att radera en användare
	const handleDeleteUser = async () => {
		// Bekräftar att användaren har blivit raderat
		if (!userIdToDelete) return
		setIsLoading(true)

		// Begäran att radera användaren
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
			alert("Kunde inte radera användaren.")
			console.log(err.response?.data.message || err.message)
		}
	}

	// Uppdaterar användaren information
	const handleSubmitUserEditInfo = async (e) => {
		e.preventDefault()

		// Validerar variabler
		if (
			!updateUserForm.address ||
			!updateUserForm.email ||
			!updateUserForm.fullName ||
			!updateUserForm.phoneNumber
		)
			return alert("Please ensure all fields are filled")
		setIsLoading(true)

		// Skickar en request till servern
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
				"Kunde inte uppdatera användarinformation. " +
					err.response?.data.message
			)
			console.log(err.response?.data.message || err.message)
		}
	}

	return (
		<div className="p-8">
			{isLoading && <Loader />}

			<h1 className="text-lg mb-4">Alla Kunder</h1>

			<table className="border-collapse w-full">
				<thead className="bg-slate-200">
					<tr className="border-b-gray-200 border-b-2 text-left">
						<th className="p-3 pr-2">Namn</th>
						<th className="p-3 pr-2">Email</th>
						<th className="p-3 pr-2">Telefon</th>
						<th className="p-3 pr-2">Actions</th>
					</tr>
				</thead>

				<tbody>
					{/* Lista av alla kunder */}
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
                                            // Överför data av alla kunder för att uppdateras, detta gör att formulären kan veta den aktuella kundens data
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
                                            // Öppna modal för att bekräfta om kunder borde raderas
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

			{/* Modal för att bekräfta att användaren är raderad */}
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
								Är du säker att du vill radera användaren?
							</h2>

							<div className="flex gap-4 justify-center mt-8">
								<button
									onClick={handleDeleteUser}
									className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-400"
								>
									Bekräfta
								</button>
							</div>
						</article>
					</div>
				</ModalBackdrop>
			) : null}

			{/* Modal för att visa redigeringsformulär för redigering av kundinformation */}
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
									Editera användar info
								</h2>

								<label className="block mb-1" htmlFor="name">
									Namn
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
									Telefon
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
									Spara
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

