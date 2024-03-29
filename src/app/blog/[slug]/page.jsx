import Image from "next/image"
import styles from "./singlePost.module.css"
import {getPost} from "@/lib/data"

//const SinglePost = ({params, searchParams}) => { //2024.03.20 수 search param

const getData = async slug => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${slug}`,
    {
      next: {revalidate: 3600 * 12}
    }
  )
  if (!res.ok) {
    throw new Error("went wrong")
  }
  return res.json()
}

const SinglePost = async ({params, searchParams}) => {
  //2024.03.20 수 search param
  //console.log(searchParams)
  const {slug} = params
  const post = getPost(slug)
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
        <h1 className={styles.title}>{post?.title}</h1>
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
        <div className={styles.content}>{post.body}</div>
      </div>
    </div>
  )
}
export default SinglePost
