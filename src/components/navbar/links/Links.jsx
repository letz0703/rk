"use client"
import styles from "./links.module.css"
import NavLink from "./navLink/navLink"
import {useState} from "react"
import Image from "next/image"

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
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map(link => (
          <NavLink item={link} key={link.title} />
        ))}
        {session && (
          <>
            {isAdmin && <NavLink item={{title: "Admin", path: "/admin"}} />}
            {rkuser && <NavLink item={{title: "members", path: "/vip"}} />}
            <button className={styles.logout}>Logout</button>
          </>
        )}
        {!session && <NavLink item={{title: "Login", path: "/login"}} />}
      </div>
      <Image
        src="/menu.png"
        width={30}
        height={30}
        className={styles.menuButton}
        alt="Menu"
        onClick={() => setOpen(prev => !prev)}
      />
      {open && (
        <div className={styles.mobileLinks}>
          {links.map(link => (
            <NavLink item={link} key={link.title} />
          ))}
          {session && isAdmin && (
            <NavLink item={{title: "Admin", path: "/admin"}} />
          )}
          {session && rkuser && (
            <NavLink item={{title: "members", path: "/vip"}} />
          )}
        </div>
      )}
    </div>
  )
}

export default Links
