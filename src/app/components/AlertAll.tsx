"use client"

import { useState } from "react"



export default function AlertAll() {
	const [isOpen, setIsOpen]=useState(false)

	const openAlert=() => setIsOpen(true)
	const closeAlert=() => setIsOpen(false)

	return (
		<>
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
						<h2 className="text-xl font-bold mb-4">Working On Progress 2025.01.09 THU</h2>
						<p>homepage is under construction. It will some time as I do this on my free time</p>
						<button
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
							onClick={closeAlert}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	)
}
