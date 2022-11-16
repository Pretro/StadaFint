import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { axios } from "../../config"
import { useAppContext } from "../../contexts/AppProvider"
import Loader from "../../components/Loader"

function Login() {
	const { setUser, setToken } = useAppContext()
	const [isLoading, setIsLoading] = useState(false)
	const emailRef = useRef()
	const passwordRef = useRef()

	// Metod för att hantera användare som skickar in data för att logga in
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Funktion som veriferar email och lösenord för att kunna logga in
			const { data } = await axios.post("/auth/login", {
				email: emailRef.current.value,
				password: passwordRef.current.value,
			})

			// Verifrerar informationen
			const { data: user } = await axios.get("/user", {
				headers: {
					authorization: "Bearer " + data.token,
				},
			})
			setToken(data.token)
			setUser(user)
			
			// Ställ in autentiseringstoken till lokal lagring som ska användas för att bekröfta användarautentisering
			localStorage.setItem("accessToken", data.token)
		} catch (err) {
			localStorage.removeItem("accessToken")
			setIsLoading(false)
			if (err.response?.data) {
				alert("Kunde inte logga in. " + err.response?.data.message)
			} else {
				alert("Kunde inte logga in " + err.message)
			}
			console.log(err.response?.data || err.message)
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
					Login
				</h2>

				<label className="block mb-1 text-md" htmlFor="email">
					Email
				</label>
				<input
					ref={emailRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="email"
					name="email"
					id="email"
					placeholder="e.g, johndoe@example.com"
					required
				/>
				<label className="block mb-1" htmlFor="password">
					Password
				</label>
				<input
					ref={passwordRef}
					className="border-2 px-3 py-2 w-full mb-4 text-sm"
					type="password"
					name="password"
					id="password"
					placeholder="********"
					required
				/>

				<Link
					className="text-sm underline text-blue-500"
					to={"/forgot-password"}
				>
					Forgot password
				</Link>

				<button
					className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-2 mb-4 mx-auto block rounded-md"
					type="submit"
				>
					Submit
				</button>

				<div className="mt-2">
					<p className="text-center text-sm">
						Don't have an account?{" "}
						<Link
							className="cursor-pointer  text-blue-600 hover:underline"
							to={"/signup"}
						>
							Sign up
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Login
