import { createContext, useContext, useEffect, useState } from "react"
import Loader from "../components/Loader"
import { axios } from "../config"

const AppContext = createContext()

const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// Funktion som verifierar status på användaren, om den inte finns, laddas det inte
		async function persistUser() {
			setIsLoading(true)
			const token = localStorage.getItem("accessToken")

			if (!token) {
				return setIsLoading(false)
			}

			// Begäran till servern för att få användarinformation genom att skicka auth jwt-token som header
			try {
				const { data: user } = await axios.get("/user", {
					headers: {
						authorization: "Bearer " + token,
					},
				})

				// Updaterar context states
				setToken(token)
				setUser(user)
				setIsLoading(false)
			} catch (err) {
				setIsLoading(false)
				if (err.response?.data) {
					alert("Opps, Något misslyckades." + err.response?.data.message)
				} else {
					alert("Opps, Något misslyckades." + err.message)
				}
				console.log(err.response?.data || err.message)
			}
		}

		persistUser()
	}, [])

	// Visar loader
	if (isLoading) {
		return <Loader/>
	}

	return (
		<AppContext.Provider value={{ user, setUser, token, setToken }}>
			{children}
		</AppContext.Provider>
	)
}

export default AppProvider

// Hook för user app context
export const useAppContext = () => {
	return useContext(AppContext)
}
