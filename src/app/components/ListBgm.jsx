"use client"

export default function ListBgm({items = []}) {
  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">등록된 BGM 목록</h3>
      <ul className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
        {items.map(p => (
          <li
            key={p.id}
            className="bg-[#3b4355] p-4 rounded-lg shadow-md hover:shadow-lg overflow-hidden cursor-pointer"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="mt-2 px-2 text-lg font-bold flex justify-between items-center">
              <h3 className="truncate">{p.title}</h3>
            </div>
            <p className="px-2 text-sm">Price: ☕️ x {p.price}</p>
            <p className="mb-2 px-2 text-gray-100 text-sm">Genre: {p.genre}</p>

            {p.link && (
              <p className="text-sm mt-1 px-2">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      p.link,
                      "_blank",
                      "width=800,height=600,noopener,noreferrer"
                    )
                  }
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  download mp3
                </button>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
