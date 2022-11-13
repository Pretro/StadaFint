import React, {useState, useRef} from "react"
import { Player } from "@lottiefiles/react-lottie-player"
import { ModalBackdrop } from "../../components"
import doneAnimation from "../../assets/animations/done.json"

const ForgotPassword = () => {
  
	const emailRef = useRef()
	const [showModal, setShowModal] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setShowModal(true)
	}

	return (
		<div className="min-h-screen grid place-items-center p-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md pt-8 py-6 px-6 rounded-lg md:px-10"
				style={{
					boxShadow: "0px 0px 10px 0px rgba(169, 169, 169, 0.25)",
				}}
			>
				<h2 className="text-3xl font-semibold mb-6 text-blue-600">
					Glömt lösenord
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

				<button
					className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white mt-2 mb-4 mx-auto block rounded-md"
					type="submit"
				>
					Skicka
				</button>
			</form>
			{showModal ? (
				<ModalBackdrop>
					<div className="bg-tranparentDark flex-1 grid place-items-center">
						<article className="relative bg-white w-full max-w-md p-8 rounded-lg text-center ">
							<span
								className="absolute top-2 right-4 text-2xl cursor-pointer font-semibold"
								onClick={() => setShowModal(false)}
							>
								&#x2715;
							</span>

							<Player
								src={doneAnimation}
								className="player"
								autoplay
								loop
								speed={1}
								style={{ height: "100px", width: "100px" }}
							/>

							<h2 className="text-2xl font-semibold">
                                Lösenordsåterställning lyckades							</h2>
							<p className="my-2 opacity-70">
                                En återställningskod har skickats till {emailRef.current.value}
							</p>
						</article>
					</div>
				</ModalBackdrop>
			) : null}
		</div>
	)
}

export default ForgotPassword
