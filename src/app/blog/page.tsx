import {getPost, getPosts} from "@/lib/data"
import styles from "./blog.module.css"
import PostCard from "@/components/postCard/postCard"

//const getData = async () => {
//  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
//  if (!res.ok) {
//    throw new Error("wrong!")
//  }

//  return res.json()
//}

const BlogPage = async () => {
  //const posts = await getData()
  const posts = await getPosts()
  return (
    <div>
      <div className={styles.container}>
        {posts.map(post => (
          <div className={styles.post} key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default BlogPage
