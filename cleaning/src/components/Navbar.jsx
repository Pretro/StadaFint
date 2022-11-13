import React from "react"
import { Link } from "react-router-dom"
import userIcon from "../assets/icons/user.png"
import { useAppContext } from "../contexts/AppProvider"

const Navbar = () => {
	// Getting data from app context
	const { setUser, user, setToken } = useAppContext()

	// Method for signing out a user
	const logout = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem("accessToken")
	}

	return (
		<nav className="px-4 md:px-8 bg-blue-600 h-20 absolute inset-0 bottom-auto flex items-center gap-4 text-white">
			<div className="logo hidden md:block">
				<Link className="text-2xl cursor-pointer" to="/">
					Stada fint Arbetaportal
				</Link>
			</div>

			<ul className="gap-8 items-center ml-auto hidden md:flex">
				{/* Dynamically render links depending on whether user is admin or not */}
				{user?.isAdmin && (
					<li>
						<Link to={"/all-customers"}>All Customers</Link>
					</li>
				)}
				{user?.isAdmin && (
					<li>
						<Link to={"/registered-orders"}>Registered orders</Link>
					</li>
				)}
				{user?.isAdmin && (
					<li>
						<Link to={"/all-cleaners"}>All cleaners</Link>
					</li>
				)}
			</ul>

			<ul className="flex items-center ml-auto">
				{/* Render logout button only is a user is currently logged in */}
				{user && (
					<li
						onClick={logout}
						className="ml-12 flex gap-2 items-center cursor-pointer"
					>
						<div className="bg-gray-100 rounded-full w-9 h-9 p-1">
							<img
								className="w-7 opacity-40"
								src={userIcon}
								alt="user"
							/>
						</div>
						<div className="hover:underline">
							<p className="text-sm">
								{user.fullName.split(" ")[0]}
							</p>
							<p className="text-sm">Logout</p>
						</div>
					</li>
				)}
			</ul>

			<div className="ml-4 md:hidden">
				<i className="fa-lg fa-solid fa-bars"></i>
			</div>
		</nav>
	)
}

export default Navbar
