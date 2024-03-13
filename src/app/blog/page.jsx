import styles from "./blog.module.css"
import PostCard from "@/components/postCard/postCard"

const BlogPage = () => {
  return (
    <div>
      <div className={styles.container}>
        <PostCard className={styles.post} />
        <PostCard className={styles.post} />
        <PostCard className={styles.post} />
        <PostCard className={styles.post} />
      </div>
    </div>
  )
}
export default BlogPage
