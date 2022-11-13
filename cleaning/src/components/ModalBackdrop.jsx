import { createPortal } from "react-dom"

// Create a custom component as modal backdrop to make a modal which will render over any view using react portal
function ModalBackdrop({ children }) {
	return createPortal(
		<div className="absolute inset-0 flex flex-col ">{children}</div>,
		document.getElementById("modal-portal")
	)
}

export default ModalBackdrop
