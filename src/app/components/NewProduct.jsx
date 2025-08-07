"use client"
import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {uploadImage} from "../../api/uploader"
import {addNewProduct, getProducts} from "@/api/firebase"

export default function NewProduct() {
  const [product, setProduct] = useState({})
  const [file, setFile] = useState()
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState("")
  const [productList, setProductList] = useState([])

  const handleChange = e => {
    const {name, value, files} = e.target
    if (name === "file") {
      setFile(files && files[0])
      return
    }
    setProduct(prev => ({...prev, [name]: value}))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsUploading(true)

    if (!file) return alert("이미지를 선택하세요")

    try {
      const url = await uploadImage(file)
        .then(url => {
          addNewProduct(product, url).then(() => {
            setSuccess("BGM 업로드 완료")
            setTimeout(() => setSuccess(null), 3000)
          })
          return url
        })
        .finally(() => setIsUploading(false))

      const newProduct = {
        ...product,
        image: url
      }
      console.log("등록할 상품:", newProduct)
    } catch (error) {
      console.error("업로드 실패:", error)
    }
  }

  useEffect(() => {
    getProducts(setProductList)
  }, [])

  return (
    <section className="w-full min-h-screen bg-[#2f3545] p-8 text-white">
      <h2 className="text-4xl font-bold text-center mb-6">NEW BGM</h2>
      {success && <p className="text-green-300 text-center mb-4">{success}</p>}

      <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-5xl mx-auto">
        {/* 입력 폼 */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/3 max-w-md space-y-4"
        >
          <input
            type="file"
            accept="image/*"
            name="file"
            required
            onChange={handleChange}
            className="w-full bg-white text-black p-2 rounded"
          />
          <div className="relative">
            <input
              type="text"
              name="title"
              value={product.title ?? ""}
              placeholder="제품명"
              required
              onChange={handleChange}
              className="w-full p-2 pr-10 rounded bg-[#3b4355] text-white placeholder-gray-400 border border-gray-600"
            />
            {product.title && (
              <button
                type="button"
                onClick={() => setProduct(prev => ({...prev, title: ""}))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <input
            type="number"
            name="price"
            value={product.price ?? ""}
            placeholder="가격"
            required
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b4355] text-white placeholder-gray-400 border border-gray-600"
          />
          <input
            type="text"
            name="genre"
            value={product.genre ?? ""}
            placeholder="장르"
            required
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b4355] text-white placeholder-gray-400 border border-gray-600"
          />
          {/* ✅ 링크 입력 필드 추가 */}
          <input
            type="url"
            name="link"
            value={product.link ?? ""}
            placeholder="BGM 링크 (예: Google Drive)"
            required
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3b4355] text-white placeholder-gray-400 border border-gray-600"
          />
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isUploading ? "uploading..." : "add"}
          </Button>
        </form>

        {/* 이미지 미리보기 */}
        <div className="w-full md:w-2/5 flex justify-center items-start">
          {file ? (
            <img
              className="w-80 h-auto object-cover rounded shadow"
              src={URL.createObjectURL(file)}
              alt="preview"
            />
          ) : (
            <div className="w-80 h-80 bg-gray-700 rounded flex items-center justify-center text-white">
              이미지 미리보기
            </div>
          )}
        </div>
      </div>

      {/* BGM 리스트 */}
      <div className="mt-12 max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">등록된 BGM 목록</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productList.map(p => (
            <div
              key={p.id}
              className="bg-[#3b4355] p-4 rounded-lg shadow hover:shadow-lg"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-bold">{p.title}</h4>
              <p className="text-sm">price:☕️ x {p.price} </p>
              <p className="text-sm">장르: {p.genre}</p>
              {p.link && (
                <p className="text-sm mt-1">
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
                    링크 열기
                  </button>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
