"use client"
import Link from "next/link"
import styles from "./links.module.css"
import NavLink from "./navLink/navLink"
import {useState} from "react"

const links = [
  {
    title: "Home",
    path: "/"
  },
  {
    title: "About",
    path: "/about"
  },
  {
    title: "Contact",
    path: "/contact"
  },
  {
    title: "Blog",
    path: "/blog"
  }
]

const Links = () => {
  const [open, setOpen] = useState(false)
  const session = true
  const isAdmin = true
  const rkuser = true

  return (
    <>
      <div className={`${styles.container}`}>
        <div className={styles.links}>
          {links.map(link => (
            <NavLink item={link} key={link.title} />
          ))}
          {session ? (
            <>
              {isAdmin && <NavLink item={{title: "Admin", path: "/admin"}} />}
              {rkuser && <NavLink item={{title: "members", path: "/vip"}} />}
              <button className={` ${styles.logout}`}>Logout</button>
            </>
          ) : (
            <NavLink item={{title: "Login", path: "/login"}} />
          )}
        </div>
        <button className={styles.menuButton} onClick={() => setOpen(!open)}>
          Menu
        </button>{" "}
      </div>
      {open && (
        <div className={styles.mobileLinks}>
          {links.map(link => (
            <div key={link.title}>{link.title}</div>
          ))}
        </div>
      )}
    </>
  )
}
export default Links
