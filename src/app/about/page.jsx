import Image from "next/image"
import styles from "./about.module.css"
const AboutPage = () => {
  return (
    <div>
      <div className={styles.imgContainer} />
      <Image
        src="https://i.pinimg.com/736x/8d/8f/c7/8d8fc761bbac70f07973e9bd7d25eca7.jpg"
        alt="about"
        fill
      />
    </div>
  )
}
export default AboutPage
