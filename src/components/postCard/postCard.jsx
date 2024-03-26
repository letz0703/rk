import Image from "next/image"
import styles from "./postCard.module.css"
import Link from "next/link"
const PostCard = ({post}) => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.imgContainer}>
          <Image
            src="https://i.pinimg.com/736x/8e/81/be/8e81be981a75754f2c1065c26cbd1dda.jpg"
            alt=""
            className={styles.img}
            fill
          />
        </div>
        <span className={styles.date}>03.13.2024</span>
      </div>
      <div className={styles.bottom}>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>{post.body}</p>
        <Link
          //href="/blog/post"
          href={`/blog/${post.id}`}
          className={styles.link}
        >
          READ MORE
        </Link>
      </div>
    </div>
  )
}
export default PostCard
