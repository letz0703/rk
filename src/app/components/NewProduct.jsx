"use client"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {uploadImage} from "../../api/uploader"
import {addNewProduct} from "@/api/firebase"

export default function NewProduct() {
  const [product, setProduct] = useState({})
  const [file, setFile] = useState()

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
    console.log("실행됨 handle submit")
    if (!file) return alert("이미지를 선택하세요")

    try {
      const url = await uploadImage(file).then(url => {
        //console.log(url)
        addNewProduct(product, url)
        console.log(" add New Don submit")
      })
      //console.log("Cloudinary URL:", url)

      const newProduct = {
        ...product,
        image: url
      }
      console.log("등록할 상품 데이터:", newProduct)

      // TODO: 상품 정보를 서버나 DB에 저장하는 코드 추가
    } catch (error) {
      console.error("업로드 실패:", error)
    }
  }

  return (
    <section>
      {file && (
        <img src={URL.createObjectURL(file)} alt="local file" width={200} />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          value={product.title ?? ""}
          placeholder="제품명"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={product.price ?? ""}
          placeholder="가격"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          value={product.genre ?? ""}
          placeholder="장르"
          required
          onChange={handleChange}
        />
        <Button text={"제품 등록하기"} />
      </form>
    </section>
  )
}
