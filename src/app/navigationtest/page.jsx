import Link from "next/link"

//import styles from './navigationTest.module.css'
const NavigationTest = () => {
  return (
    <div>
      <Link href="/" prefetch={false}>
        Click Here
      </Link>
    </div>
  )
}
export default NavigationTest
