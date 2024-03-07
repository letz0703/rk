import styles from "./home.module.css"

const Home = () => {
  //throw new Error("Error in Home")
  return (
    <>
      <div className={`${styles.container}`}>rainskiss</div>
      <div className={` ${styles.textContainer}`}>
        <h1>LOVE & FREE</h1>
        <p>Free Images created by Us</p>
      </div>
      <div className={` ${styles.buttons}`}>
        <button className={` ${styles.button}`}>
          youtube.com/@rainskiss.m
        </button>
        <button className={` ${styles.button}`}>pinterest</button>
      </div>
      <div className={` ${styles.imageContainer}`}>
        <Image src="hero.png" alt="" fill className={styles.heroImg} />
      </div>
    </>
  )
}

export default Home
