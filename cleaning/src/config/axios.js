import axios from "axios"

// Skapar en axios instance som ska användas genom appen
export default axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
})
