import React from 'react'
import {createPortal} from "react-dom"

const ModalBackdrop = ({children}) => {
  return createPortal(
    <div className="absolute inset-0 flex flex-col ">{children}</div>,
    document.getElementById("modal-portal")
  )
}

export default ModalBackdrop
