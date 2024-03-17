import Image from "next/image"
import styles from "./singlePost.module.css"

const SinglePost = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image
          src="https://i.pinimg.com/originals/c5/7e/64/c57e647b37964ea171f62a39566bbc70.png"
          className={styles.img}
          alt=""
          fill
        />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Title</h1>
        <div className={styles.detail}>
          <Image
            className={styles.avartar}
            src="/avartar.png"
            alt=""
            width={50}
            height={50}
          />
          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Author</span>
            <span className={styles.detailValue}>rainskiss.m</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Published</span>
            <span className={styles.detailValue}>2024.03.13</span>
          </div>
        </div>
        <div className={styles.content}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim vero non
          dolore quam molestias eaque doloribus praesentium quod ex officia!
        </div>
      </div>
    </div>
  )
}
export default SinglePost
