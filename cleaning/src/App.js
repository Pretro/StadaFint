import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom"

import { Navbar } from "./components"
import { useAppContext } from "./contexts/AppProvider"
import {
	CustomerHome,
	Login,
	Signup,
	AdminAllCustomers,
	RegisteredOrders,
	ForgotPassword,
	CustomerNewRequest,
	AdminAllCleaners,
} from "./pages"

const App = () => {
	const { user } = useAppContext()

	return (
		<div className="app h-screen overflow-auto w-screen">
			<Router>
				<Navbar />

				{user ? (
					<div className={`${user?.isAdmin && " mt-20"}`}>
						<Routes>
							<Route
								exact
								path="/"
								element={
									user?.isAdmin ? (
										<Navigate to="/all-customers" />
									) : (
										<CustomerHome />
									)
								}
							/>
							<Route
								exact
								path="/new-request"
								element={<CustomerNewRequest />}
							/>
							<Route
								exact
								path="/all-customers"
								element={<AdminAllCustomers />}
							/>
							<Route
								exact
								path="/all-cleaners"
								element={<AdminAllCleaners />}
							/>
							<Route
								exact
								path="/registered-orders"
								element={<RegisteredOrders />}
							/>
							<Route
								path="*"
								element={<Navigate to="/" replace />}
							/>
						</Routes>
					</div>
				) : (
					<Routes>
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/signup" element={<Signup />} />
						<Route
							exact
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route
							path="*"
							element={<Navigate to="/login" replace />}
						/>
					</Routes>
				)}
			</Router>
		</div>
	)
}

export default App
