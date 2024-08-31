//import styles from './postUser.module.css'
const PostUser = async ({userId}) => {
  //const user = await getData(userId)
  const user = await getUser(userId)
  return (
    <div className={styles.container}>
      <span className={styles.title}>Author</span>
      <span className={styles.username}>{user.username}</span>
    </div>
  )
}
export default PostUser
