"use client"

import { useState } from "react"



export default function AlertAll() {
	const [isOpen, setIsOpen]=useState(false)

	const openAlert=() => setIsOpen(true)
	const closeAlert=() => setIsOpen(false)

	return (
		<div className="modal-overlay">
			<button
				className="rounded bg-blue-500 text-white px-4 py-2"
				onClick={openAlert}
			>
				<b>Letter from ][</b>
			</button>

			{isOpen&&(
				<div
					className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50"
					onClick={closeAlert}
				>
					<div
						className="bg-white p-6 rounded shadow"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-xl font-bold mb-4">Working On Progress 2025.03.20 THU</h2>
						<p>MON - EN</p>
						<p>TUE - JP</p>
						<p>WED - SHORT</p>
						<p>THU - 4K- EN</p>
						<p>FRI - 4K- JP</p>
						<p>SAT - 4K- SHORT</p>
						<button
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
							onClick={closeAlert}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
