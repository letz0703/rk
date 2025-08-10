"use client"
import ListBgm from "../components/ListBgm"
import NewProduct from "../components/NewProduct"
import {useAuthContext} from "@/components/context/AuthContext"

export default function New() {
  const {isAdmin} = useAuthContext()

  return (
    <>
      {/*{isAdmin && <NewProduct />}*/}
      <NewProduct />
      <ListBgm />
    </>
  )
}
