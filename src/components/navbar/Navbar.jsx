import Links from "./links/Links"
import styles from "./navbar.module.css"

const Navbar = () => {
  return (
    <div className={styles.container}>
      <h2 className="text-2xl border-lime-50">Logo</h2>
      <div>
        <Links></Links>
      </div>
    </div>
  )
}
export default Navbar
