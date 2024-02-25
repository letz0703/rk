import Links from "./links/Links"
import styles from "./Navbar.module.css"

const Navbar = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>Logo</h2>
      <div>
        <Links></Links>
      </div>
    </div>
  )
}
export default Navbar
