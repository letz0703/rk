import Image from "next/image"
import styles from "./contact.module.css"

//const HydrationTestNoSSR = dynamic(() => import("@/components/hydrationTest"), {
//  ssr: false
//})
const a = 2

export const metadata = {
  title: "Contact"
}

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src="/contact.png" fill alt="" className={styles.img} />
      </div>
      {/*<div suppressHydrationWarning>{a}</div>*/}
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <input type="text" placeholder="Name and Sirname" />
          <input type="text" placeholder="Email Address" />
          <input type="text" placeholder="Phone Number (Optional)" />
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="message"
          ></textarea>
          <button>Send</button>
        </form>
      </div>
    </div>
  )
}
export default ContactPage
