import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"

import { axios } from "../../config"
import { useAppContext } from "../../contexts/AppProvider"
import Loader from "../../components/Loader"

function Login() {
	const { setUser, setToken } = useAppContext()

	const [isLoading, setIsLoading] = useState(false)

	// References to input fields
	const emailRef = useRef()
	const passwordRef = useRef()

	// Metod för att hantera användare som skickar in data för att logga in
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Begäran till servern med användarens e-post och lösenord för att få auth jwt-token
			const { data } = await axios.post("/auth/login", {
				email: emailRef.current.value,
				password: passwordRef.current.value,
			})

			// Begäran till servern för att få användarens information genom att skicka autentiseringstoken som auktoriseringshuvud
			const { data: user } = await axios.get("/user", {
				headers: {
					authorization: "Bearer " + data.token,
				},
			})
			// Uppdatera appkontext
			setToken(data.token)
			setUser(user)
			// Ställ in autentiseringstoken till lokal lagring som ska användas för beständig användarautentisering
			localStorage.setItem("accessToken", data.token)
		} catch (err) {
			localStorage.removeItem("accessToken")
			setIsLoading(false)
			if (err.response?.data) {
				alert("Failed to login. " + err.response?.data.message)
			} else {
				alert("Failed to login. " + err.message)
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
					Logga in
				</h2>

				<label className="block mb-1 text-md" htmlFor="email">
					E-post
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
					Lösenord
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
					glömt ditt lösenord
				</Link>

				<button
					className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-2 mb-4 mx-auto block rounded-md"
					type="submit"
				>
					Submit
				</button>

				<div className="mt-2">
					<p className="text-center text-sm">
						Har du inget konto?{" "}
						<Link
							className="cursor-pointer  text-blue-600 hover:underline"
							to={"/signup"}
						>
							Bli Medlem
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Login
