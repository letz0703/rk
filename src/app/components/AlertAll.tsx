// components/AlertAll.tsx
"use client"

import {useState} from "react"

export default function AlertAll() {
  const [isOpen, setIsOpen] = useState(false)

  const openAlert = () => setIsOpen(true)
  const closeAlert = () => setIsOpen(false)

  return (
    <div className="modal-overlay">
      {/*<button
        className="rounded bg-blue-500 text-white px-4 py-2"
        onClick={openAlert}
      >
        <b>Letter from ][</b>
      </button>*/}

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50"
          onClick={closeAlert}
        >
          <div
            className="relative bg-white rounded shadow w-[576px] h-[768px] flex flex-col justify-end items-center overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* 배경 이미지 */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage: "url('/cute.webp')"}}
            ></div>

            {/* 글자 배경을 약간 어둡게 */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* 내용 */}
            <div className="relative z-10 text-center text-white p-4 drop-shadow-lg mb-4">
              <h2 className="text-xl font-bold">
                Let me have your picture
                <br />
                and I'll make a cute 3D character of you.
                <br />
                One Character Free
              </h2>
            </div>

            <button
              className="relative z-10 mb-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
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
