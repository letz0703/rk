import Image from "next/image"
import styles from "./home.module.css"

const Home = () => {
  //throw new Error("Error in Home")
  return (
    <>
      <div className={styles.container}>
        <div className={` ${styles.textContainer}`}>
          <h1 className={`${styles.title}`}>LOVE & FREE</h1>
          <p>Free Images created by Us</p>
          <div className={` ${styles.buttons}`}>
            <button className={` ${styles.button}`}>
              youtube.com/@rainskiss.m
            </button>
            <button className={` ${styles.button}`}>pinterest</button>
          </div>
          <div className={`${styles.brands}`}>
            <Image
              src="/brands.png"
              alt="brands"
              className={styles.brands}
              fill
            />
          </div>
        </div>
        <div className={` ${styles.imageContainer}`}>
          <Image src="/hero.gif" alt="" fill className={styles.heroImg} />
        </div>
      </div>
    </>
  )
}

export default Home
