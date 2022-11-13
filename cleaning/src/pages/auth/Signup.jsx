import React, { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { axios } from "../../config"
import Loader from "../../components/Loader"

function Signup() {
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState(false)

	// References to input fields
	const nameRef = useRef()
	const emailRef = useRef()
	const passwordRef = useRef()
	const phoneRef = useRef()
	const addressRef = useRef()

	// Method to handle submitting user's data for registration and then logging in
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Send request to server to register the user
			const { status } = await axios.post("/auth/register", {
				fullName: nameRef.current.value,
				email: emailRef.current.value,
				password: passwordRef.current.value,
				phoneNumber: phoneRef.current.value,
				address: addressRef.current.value,
			})

			// Navigate to Login screen for user to log in
			if (status === 200) {
				navigate("/login")
			}
		} catch (err) {
			localStorage.removeItem("accessToken")
			setIsLoading(false)
			alert("Failed to register user " + err.response?.data.message)
			console.log(err.response?.data.message || err.message)
		}
	}

	return (
		<div className="min-h-screen grid place-items-center p-4">
			{isLoading && <Loader />}
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md py-8 px-6 rounded-lg md:px-10"
				style={{
					boxShadow: "0px 0px 10px 0px rgba(169, 169, 169, 0.25)",
				}}
			>
				<h2 className="text-3xl font-semibold mb-6 text-blue-600">
					Signup
				</h2>

				<label className="block mb-1" htmlFor="name">
					Full Name
				</label>
				<input
					required
					ref={nameRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="text"
					name="username"
					id="username"
				/>

				<label className="block mb-1" htmlFor="email">
					Email
				</label>
				<input
					required
					ref={emailRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="email"
					name="email"
					id="email"
				/>

				<label className="block mb-1" htmlFor="password">
					Password
				</label>
				<input
					required
					ref={passwordRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="password"
					name="password"
					id="password"
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

				<label className="block mb-1" htmlFor="phone">
					Address
				</label>
				<input
					required
					ref={addressRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="text"
					name="address"
					id="address"
				/>

				<button
					className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-2 mb-4 mx-auto block rounded-md"
					type="submit"
				>
					Submit
				</button>

				<div className="mt-2">
					<p className="text-center text-sm">
						Already have an account?{" "}
						<Link
							className="cursor-pointer  text-blue-600 hover:underline"
							to={"/login"}
						>
							Login
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Signup
