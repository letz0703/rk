"use client"

import Link from "next/link"
import {useRouter} from "next/navigation"

//import styles from './navigationTest.module.css'
const NavigationTest = () => {
  const router = useRouter()
  const handleClick = () => {
    console.log("clicked")
    router.push("/")
  }
  return (
    <div>
      <div>
        <Link href="/" prefetch={false}>
          Click Here
        </Link>
      </div>
      <button className="bg-blue-200 p-2 text-black" onClick={handleClick}>
        Write and Redirect
      </button>
    </div>
  )
}
export default NavigationTest
