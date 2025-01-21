"use client"

import React, { useRef } from "react"

export default function Letter() {
	const inputRef=useRef<HTMLInputElement>(null)

	function handleSubmit(e: React.FormEvent) {
e.preventDefault()
		if (inputRef.current) {
			console.log(inputRef.current.value)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<CustomInput ref={inputRef} placeholder="Enter text" />
			<button type="submit">Submit</button>
		</form>
	)
}

const CustomInput=React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
	(props, ref) => {
		return <input {...props} ref={ref} style={{ border: "1px solid black", padding: "8px" }} />
	}
)

CustomInput.displayName="CustomInput"
