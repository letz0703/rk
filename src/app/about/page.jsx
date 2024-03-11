import Image from "next/image"
import styles from "./about.module.css"
const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.subtitle}>About Agency</h2>
        <h1 className={styles.title}>Love & Free</h1>
        <p className={styles.description}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id nam
          sapiente quaerat eos molestias repellat commodi blanditiis est quas
          ratione?
        </p>
      </div>
      <div className={styles.boxes}>
        <div className={styles.boxes}>
          <h1>10 K+</h1>
          <p> Years of experience </p>
        </div>
        <div className={styles.boxes}>
          <h1>10 K+</h1>
          <p> Years of experience </p>
        </div>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h1>10 K+</h1>
            <p> Years of experience </p>
          </div>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image src="/about.png" alt="about" fill />
      </div>
    </div>
  )
}
export default AboutPage
