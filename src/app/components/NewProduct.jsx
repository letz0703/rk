"use client"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {uploadImage} from "../../api/uploader"

export default function NewProduct() {
  const [product, setProduct] = useState({})
  const [file, setFile] = useState()
  const handleChange = e => {
    const {name, value, files} = e.target
    if (name === "file") {
      setFile(files && files[0])
      return
    }
    setProduct(product => ({...product, [name]: value}))
  }
  const handleSubmit = e => {
    e.preventDefault = e => {
      e.preventDefault()
      uploadImage(file).then(url => {
        console.log(url)
      })
    }
  }

  return (
    <>
      <section>
        {file && <img src={URL.createObjectURL(file)} alt="local file" />}
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image"
            name="file"
            required
            onChange={handleChange}
          ></input>
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
            placeholder="genre"
            required
            onChange={handleChange}
          />
          {/*<input
            type="text"
            name="option"
            value={product.options ?? ""}
            placeholder="options, comma"
            required
            onChange={handleChange}
          />*/}
          <Button text={"제품 등록하기"} />
        </form>
      </section>
    </>
  )
}
