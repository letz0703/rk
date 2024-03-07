import Link from "next/link"
import Links from "./links/Links"
import styles from "./Navbar.module.css"

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        rainskiss][kiss
      </Link>
      <div>
        <Links></Links>
      </div>
    </div>
  )
}
export default Navbar
