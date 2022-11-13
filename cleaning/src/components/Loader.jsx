import React from 'react'
import { Player } from "@lottiefiles/react-lottie-player"
import loadingAnimation from "../assets/animations/loading.json"
import ModalBackdrop from "./ModalBackdrop"

// Loader-komponent att rendera vid laddningstillstånd
const Loader = () => {
  return (
    <ModalBackdrop>
			<div className="flex-1 bg-tranparentDark grid place-items-center">
				<Player
					src={loadingAnimation}
					className="player"
					autoplay
					loop
					speed={1}
					style={{ height: "100px", width: "100px" }}
				/>
			</div>
		</ModalBackdrop>
  )
}

export default Loader
