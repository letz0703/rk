"use client"

import React, { forwardRef, useRef } from "react"
import { CustomModal } from "../CustomModal"

export default function Letter() {
	const inputRef=useRef<HTMLInputElement>(null)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (inputRef.current) {
			console.log(inputRef.current.value)
		}
	}

	return (<>
		<CustomModal isOpen={false} onClose={function (): void {
			throw new Error("Function not implemented.")
		}} />
		<form onSubmit={handleSubmit}>
			{/* Use the CustomInput component with the ref */}
			<CustomInput ref={inputRef} placeholder="Enter text" />
			<button type="submit">Submit</button>
		</form>
	</>
	)
}

// CustomInput component with ref forwarding
const CustomInput=forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
	(props, ref) => {
		return <input {...props} ref={ref} style={{ border: "1px solid black", padding: "8px" }} />
	}
)

CustomInput.displayName="CustomInput"
